import React, { Component } from 'react';
import axios from 'axios';
import {Icon, Item} from 'semantic-ui-react';
import Loading from './Loading';

export default class BoardList extends Component{
    state = {
        leaderboards: []
    }

    componentDidMount() {
        axios.get('/api/boardList')
            .then(resp => {
                this.setState({
                    leaderboards: resp.data.leaderboards
                });
            })
            .catch(console.error);
    }
    render() {
        const leaderboards = this.state.leaderboards;
        if (leaderboards && leaderboards.length > 0){
            return (
                <Item.Group>
                    {leaderboards.map(obj =>
                        <Item>
                        <iframe className='game-icon' src={obj.imageUrl} frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
                        <Item.Content verticalAlign='middle' className='game-details'>
                            <Item.Header as='a' href={`/leaderboard/${obj.name}`}>{obj.name}</Item.Header>
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
