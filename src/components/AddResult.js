import React, { Component } from 'react';
import { Dropdown, Button, Label } from 'semantic-ui-react';
import axios from 'axios';

export default class AddResult extends Component {
    state = {
        players: [],
        leaderboards: [],
        numDropdowns: 3,
        gameData: {}
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

    getPlayers(e, data){
        const path = `/api/leaderboard/${data.value}`;
        axios.get(path)
            .then(resp => {
                const playerDropdown = [];
                const data = resp.data
                for (const i in data) {
                    const element = {};
                    element['key'] = data[i]._id;
                    element['value'] = data[i].name;
                    element['text'] = data[i].name;
                    playerDropdown.push(element);
                }
                this.setState({
                    players: playerDropdown
                });
            })
            .catch(console.error);
        let gameData = {}
        gameData['leaderboard'] = data.value;
        let newGameData = Object.assign({}, this.state.gameData, gameData);
        this.setState({
            gameData: newGameData
        })
    };

    renderPlayers() {
        let list = [];
        for (let i = 0; i < this.state.numDropdowns; ++i) {
            list.push(<Dropdown id={`player_${i}`} data="test" key={`player_${i}`} placeholder='Select player' search selection options={this.state.players} onChange={this.logSelectedData.bind(this)}/>);
        }
        return list;
    };

    playerIncreament() {
            const numPlayers = this.state.numDropdowns;
            this.setState ({
                numDropdowns: numPlayers + 1
            });
    };

    submitResult() {
        const gameData = this.state.gameData;
        const path = `/api/update/${gameData.leaderboard}`;
        axios({
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            url: path,
            data: gameData
        }).then(resp => {
            if (resp.data == 'good') {
                this.setState ({
                    sucess: true
                })
            }
        })
    };

    logSelectedData(e, data) {
        let gameData = {};
        if (data.dropdownName === 'winner') {
            gameData['winner'] = data.value;
        } else {
            gameData[data.id] = data.value;
        }
        let newGameData = Object.assign({}, this.state.gameData, gameData);
        this.setState({
            gameData: newGameData
        });
    }

    render() {
        const label = this.state.sucess ? <Label basic color='green' pointing='left'>Succeed!</Label> : '';
        return (
            <div>
                <h1>Log your game result here:</h1>
                <div className='data-input'>
                <Dropdown placeholder='Select leaderboard' search selection options={this.state.leaderboards} onChange={this.getPlayers.bind(this)} />
                <Dropdown id='winner' placeholder='Select winner' search selection options={this.state.players} onChange={this.logSelectedData.bind(this)} />
                {this.renderPlayers()}
                </div>
                <div className='submit'>
                    <Button.Group>
                        <Button onClick={this.playerIncreament.bind(this)}>Add player</Button>
                        <Button.Or />
                        <Button positive onClick={this.submitResult.bind(this)}>Save</Button>
                    </Button.Group>
                    {label}
                </div>
            </div>
        )
    }
}
