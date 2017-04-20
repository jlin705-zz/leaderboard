import config from './config';
import apiRouter from './api';
import App from './src/components/App';
import { StaticRouter } from 'react-router-dom';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import bodyParser from 'body-parser';

import express from 'express';

const server = express();

server.use(bodyParser.json());

server.use(sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public')
}))

server.set('view engine', 'ejs');

server.use('/api', apiRouter);
server.use('/static', express.static('public'));


server.get('*', (req, res) => {
    const location = req.url;
    const context = {};
    res.render('index', {app: ReactDOMServer.renderToString(
        <StaticRouter location={location} context={context}>
            <App />
        </StaticRouter> ,
    )});
});



server.listen(config.port, config.host, () => {
    console.log('Express listening on port ', config.port);
})
