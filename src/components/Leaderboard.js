import React, { Component } from 'react';
import axios from 'axios';
import {Table, Label} from 'semantic-ui-react';
import Loading from './Loading';

export default class Leaderboard extends Component{
    static propTypes = {
        match: React.PropTypes.object.isRequired
    };

    state = {
        players: []
    };

    componentDidMount() {
        const name = this.props.match.params.gameName;
        const path = `/api/leaderboard/${name}`
        axios.get(path)
            .then(resp => {
                this.setState({
                    players: resp.data
                });
            })
            .catch(console.error);
    }

    isFirst(player) {
        const players = this.state.players;
        return players.length > 0 && player.points == players[0].points;
    }
    
    isLast(player) {
	const players = this.state.players;
        return players.length > 0 && player.points == players[players.length - 1].points;
    }

    render() {
        const leaderboardName = this.props.match.params.gameName;
        const players = this.state.players;
        if (players.length > 0) {
            return (
                <div>
                <h1>{leaderboardName}</h1>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Player</Table.HeaderCell>
                            <Table.HeaderCell>Points</Table.HeaderCell>
                            <Table.HeaderCell>Wins</Table.HeaderCell>
                            <Table.HeaderCell>Losses</Table.HeaderCell>
                            <Table.HeaderCell>Games</Table.HeaderCell>
                            <Table.HeaderCell>Win %</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {players.map(player =>
                        <Table.Row key={player._id}>
                            <Table.Cell>
                                {this.isFirst(player) ? <Label ribbon color='yellow'>First</Label> : null}
				{this.isLast(player) ? <Label ribbon color='red'>You should stop!</Label> : null}
                                {player.name}
                            </Table.Cell>
                            <Table.Cell>{player.points}</Table.Cell>
                            <Table.Cell>{player.wins}</Table.Cell>
                            <Table.Cell>{player.losses}</Table.Cell>
                            <Table.Cell>{player.games}</Table.Cell>
                            <Table.Cell>{Math.round(player.wins/player.games*10000)/100}%</Table.Cell>
                        </Table.Row>
                    )}
                    </Table.Body>
                </Table>
                </div>
            )
        } else {
            return (
                <Loading />
            )
        }
    }
}
