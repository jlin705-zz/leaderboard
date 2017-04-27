import express from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import config from '../config';
import assert from 'assert';
import GoogleImages from 'google-images';

var giphy =require('giphy-api')({https: true});

let mdb;

MongoClient.connect(config.mongodbUri, (err, db) => {
    if (err) {
        console.log('Error: Failed to connect mongodb');
    } else {
        mdb = db;
    }
});

const searchClient = new GoogleImages(config.searchEngineId, config.searchEngineApiKey);

const router = express.Router();


function doSearch(leaderboards, results, res) {
    if (leaderboards.length > 0) {
        const next = leaderboards.pop();
        giphy.search({
            q: next.name,
            limit: 10})
            .then((resp) => {
                const rand = Math.floor(10 * Math.random());
                const url = resp.data[rand]?resp.data[rand].embed_url:'';
                next['imageUrl'] = url;
                results.push(next);
                doSearch(leaderboards, results, res);

            })
    }else {
        res.send({leaderboards: results});
    }
};

router.get('/boardList', (req, res) => {
    console.log('GET /api/boardList');
    let leaderboards = [];
    let results = [];
    let mdbCollections = mdb.listCollections();
    mdbCollections.each((err, leaderboard) => {
        assert.equal(null, err);
        if (!leaderboard) {
            doSearch(leaderboards, results, res);
            return;
        }
	if (leaderboard.name != "system.indexes"){
       		leaderboards.push(leaderboard);
	}
    });

});

router.get('/leaderboard/:name', (req, res) => {
    let leaderboardName = req.params.name;
    console.log(`GET /leaderboard/${leaderboardName}`);
    mdb.collection(leaderboardName)
        .find({})
        .sort({'points': -1})
        .toArray((err, docs) => {
            res.send(docs)
        })

});

router.put('/update/:name', (req, res) => {
    let leaderboardName = req.params.name;
    console.log(`PUT /api/update/${leaderboardName}`);
    const data = req.body;
    const winner = data.winner;
    const collection = mdb.collection(leaderboardName);
    let playerCount = 0;
    for (let x in data) {
        if (data.hasOwnProperty(x)) playerCount ++;
    }
    playerCount = playerCount - 2;

    if (winner) {
        collection.findOneAndUpdate({name: winner}, {$inc: {wins: 1, games: 1, points: playerCount}}, {returnOriginal: false, upsert: true})
    } else {
        res.send('There is no winner selelcted!');
    }

    for (let i = 0; i < playerCount; ++ i) {
        const player = data[`player_${i}`];
        collection.findOneAndUpdate({name: player}, {$inc: {losses: 1, games: 1, points: -1}}, {returnOriginal: false, upsert: true})
    }

    res.send('good');
});

router.post('/new', (req, res) => {
    console.log('POST /api/new');
    const leaderboardName = req.body.name;
    mdb.createCollection(leaderboardName)
        .then((err, data) => {
            if (err) {
                res.send('Failed to create new leaderboard');
            } else {
                res.send('Succeed');
            }
        });

})

router.post('/newplayer', (req, res) => {
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
                })
                res.send('Succeed');
            }
        })

})

export default router;
