import express from 'express';
import { MongoClient } from 'mongodb';
import config from '../config';
import csrf from 'csurf';
import bodyParser from 'body-parser';
import datetime from 'node-datetime';

let csrfProtection = csrf({ cookie: true });
let parseForm = bodyParser.urlencoded({ extended: false });

const MINUTE = 60000;

let mdb;

MongoClient.connect(config.mongodbUri, (err, db) => {
    if (err) {
        console.log('Error: Failed to connect mongodb');
    } else {
        mdb = db;
    }
});

const router = express.Router();

router.get('/form', csrfProtection, (req, res) => {
  // pass the csrfToken to the view
  res.send( { csrfToken: req.csrfToken() });
});

router.get('/boardList', (req, res) => {
    console.log('GET /api/boardList');
    mdb.collection('BoardList')
        .find({})
        .toArray((err, docs) => {
            res.send(docs);
        });

});

router.get('/donuts', (req, res) => {
    console.log('GET /api/donuts');
    mdb.collection('RentalsDonuts')
        .find({})
        .sort({'count': -1, 'name': 1})
        .toArray((err, docs) => {
            if (err) {
                console.error(err);
            }
            res.send(docs);
        });
});

router.get('/leaderboard/:name', (req, res) => {
    let leaderboardName = req.params.name;
    console.log(`GET /leaderboard/${leaderboardName}`);
    mdb.collection(leaderboardName)
        .find({})
        .sort({'points': -1})
        .toArray((err, docs) => {
            res.send(docs);
        });

});

router.put('/update/:name',parseForm, csrfProtection, (req, res) => {
    let leaderboardName = req.params.name;
    console.log(`PUT /api/update/${leaderboardName}`);
    const data = req.body;
    const winner = data.winner;
    const collection = mdb.collection(leaderboardName);
    let playerCount = 0;
    for (let x in data) {
        if (data.hasOwnProperty(x)) playerCount ++;
    }
    playerCount = playerCount - 3;

    if (winner) {
        collection.findOneAndUpdate({name: winner}, {$inc: {wins: 1, games: 1, points: playerCount}}, {returnOriginal: false, upsert: true});
    } else {
        res.send('There is no winner selelcted!');
    }

    for (let i = 0; i < playerCount; ++ i) {
        const player = data[`player_${i}`];
        collection.findOneAndUpdate({name: player}, {$inc: {losses: 1, games: 1, points: -1}}, {returnOriginal: false, upsert: true});
    }

    res.send('good');
});

router.put('/donuts/add/:name',parseForm, csrfProtection, (req, res) => {
    let updateName = req.params.name;
    const last = datetime.create(req.body.lastModified);
    const now = datetime.create();
    if (now.getTime() - last.getTime() < 30 * MINUTE) {
        res.send('too soon');
    } else {
        const formattedNow = now.format('m/d/Y H:M:S');
        console.log(`PUT /api/donuts/add/${updateName}`);
        const collectionDonuts = mdb.collection('RentalsDonuts');
        collectionDonuts.findOneAndUpdate({name: updateName}, {$inc: {count: 1}, $set: {lastModified: formattedNow}}, {returnOriginal: false, upsert: true});
        res.send(formattedNow);
    }
});

router.get('/donuts/slackadd/:name', (req, res) => {
    const name = req.params.name;
    const now = datetime.create();
    const collectionDonuts = mdb.collection('RentalsDonuts');
    let last = datetime.create('1/1/1967');
    collectionDonuts.find({'name': name})
        .sort({'count': -1, 'name': 1})
        .toArray((err, docs) => {
            if (err) {
                console.error(err);
            }
            if (!docs[0]) {
                res.send('Can\'t find ' + name);
                return;
            }
            if (docs[0].lastModified) {
                last = datetime.create(docs[0].lastModified);
            }
            if (now.getTime() - last.getTime() > 30 * MINUTE) {
                const formattedNow = now.format('m/d/Y H:M:S');
                collectionDonuts.findOneAndUpdate({name: name}, {$inc: {count: 1}, $set: {lastModified: formattedNow}}, {returnOriginal: false, upsert: true});
                const newCount = docs[0].count + 1;
                res.send('Added 1 Donut point to ' + name + ', current count: ' + newCount);
            } else {
                res.send('Donut point can be added once per 30 mins!');
            }
        });
})

router.put('/donuts/clear/:name',parseForm, csrfProtection, (req, res) => {
    let updateName = req.params.name;
    console.log(`PUT /api/donuts/add/${updateName}`);
    const collectionDonuts = mdb.collection('RentalsDonuts');
    collectionDonuts.findOneAndUpdate({name: updateName}, {$set: {count: 0}}, {returnOriginal: false, upsert: true});
    res.send('good');
});

router.post('/new', parseForm, csrfProtection, (req, res) => {
    console.log('POST /api/new');
    const leaderboardName = req.body.name;
    mdb.createCollection(leaderboardName)
        .then((err) => {
            mdb.collection('BoardList').insertOne({name: leaderboardName});
            if (err) {
                res.send('Failed to create new leaderboard');
            } else {
                res.send('Succeed');
            }
        });

});

router.post('/newplayer',parseForm, csrfProtection, (req, res) => {
    console.log('POST /api/newplayer');
    const data = req.body;
    const leaderboard = data.leaderboard;
    const player = data.player;
    const collection = mdb.collection(leaderboard);
    collection.find({name: player})
        .toArray()
        .then((err, result) => {
            console.log('err', err);
            if (err.length != 0) {
                res.send('Existed');
            } else {
                collection.insertOne({
                    name: player,
                    points: 0,
                    wins: 0,
                    losses: 0,
                    games: 0
                });
                res.send('Succeed');
            }
        });

});

export default router;
