import React, { Component } from 'react';
import axios from 'axios';
import {Item} from 'semantic-ui-react';
import Loading from './Loading';
let giphy = require('giphy-api')({https: true});


export default class BoardList extends Component{


    state = {
        leaderboards: {}
    }

    componentDidMount() {
        axios.get('/api/boardList')
            .then(resp => {
                let boards = {};
                resp.data.map((obj) => {
                    boards[obj.name] = obj;
                });

                this.setState({
                    leaderboards: boards
                });
            })
            .catch(console.error);
    }

    getGiphy(next) {
        if (next.imageUrl) {
            return next.imageUrl;
        }
        giphy.search({
            q: next.name,
            limit: 10})
            .then((resp) => {
                const rand = Math.floor(10 * Math.random());
                const url = resp.data[rand]?resp.data[rand].embed_url:'';
                let boards = this.state.leaderboards;
                boards[next.name]['imageUrl'] = url;
                this.setState({
                    leaderboards: boards
                });
                return url;
            });
    }

    render() {
        const leaderboards = this.state.leaderboards;
        if (leaderboards && Object.keys(leaderboards).length > 0){
            return (
                <Item.Group>
                    {Object.keys(leaderboards).map(key =>
                        <Item key={key}>
                        <iframe className='game-icon giphy-embed' src={this.getGiphy(leaderboards[key])} frameBorder="0" allowFullScreen></iframe>
                        <Item.Content verticalAlign='middle' className='game-details'>
                            <Item.Header as='a' href={`/leaderboard/${leaderboards[key].name}`}>{leaderboards[key].name}</Item.Header>
                        </Item.Content>
                        </Item>
                    )}
                </Item.Group>
            );
        }
        return (
            <Loading />
        );
    }
}
