import React, { Component } from 'react';
import { Input, Button, Dropdown, Label } from 'semantic-ui-react';
import axios from 'axios';

export default class AddPlayer extends Component {
    state = {
        leaderboards: [],
        leaderboard: '',
        playerName: '',
    };

    componentDidMount() {
        axios.get('/api/boardList')
            .then(resp => {
                const data = resp.data.leaderboards;
                const leaderboardsDropdown = [];
                for (const i in data) {
                    const element = {};
                    element['key'] = data[i].name;
                    element['value'] = data[i].name;
                    element['text'] = data[i].name;
                    leaderboardsDropdown.push(element);
                }

                this.setState({
                    leaderboards: leaderboardsDropdown});
            })
            .catch(console.error);
    };

    getPlayerName(e, data) {
        this.setState({
            playerName: data.value
        })
    };

    submit() {
        const leaderboardName = this.state.leaderboard;
        const playerName = this.state.playerName;
        const path = '/api/newplayer/';
        axios({
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            url: path,
            data: {
                leaderboard: leaderboardName,
                player: playerName
            }
        }).then(resp => {
            if (resp.data == 'Succeed') {
                this.setState ({
                    success: true,
                    exist: false
                })
            } else if (resp.data == 'Existed') {
                this.setState ({
                    exist: true,
                    success: false
                })
            }
        })
    };

    selectBoard(e, data) {
        this.setState({
            leaderboard: data.value
        })
    };

    render() {
        const label = this.state.success ? <Label basic color='green' pointing='left'>Succeed!</Label> : '';
        const exist = this.state.exist ? <Label basic color='red' pointing='left'>Player already exist!</Label> : '';
        return (
            <div>
                <h1>Add a new player:</h1>
                <div className='data-input'>
                    <Dropdown placeholder='Select leaderboard' search selection options={this.state.leaderboards} onChange={this.selectBoard.bind(this)} />
                    <Input placeholder='New player' onChange={this.getPlayerName.bind(this)} />
                </div>
                <div className='submit'>
                    <Button positive onClick={this.submit.bind(this)}>Add</Button>{label}{exist}
                </div>

            </div>
        )
    }
}
