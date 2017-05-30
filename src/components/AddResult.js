import React, { Component } from 'react';
import { Dropdown, Button, Label, Confirm } from 'semantic-ui-react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import App from './App';

export default class AddResult extends Component {
    state = {
        players: [],
        leaderboards: [],
        numDropdowns: 3,
        gameData: {},
        openConfirm: false,
        toLeaderboard: false,
        error: false
    };

    componentDidMount() {
        axios.get('/api/boardList')
            .then(resp => {
                const data = resp.data;
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
    }

    getPlayers(e, data){
        const path = `/api/leaderboard/${data.value}`;
        axios.get(path)
            .then(resp => {
                const playerDropdown = [];
                const data = resp.data;
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
        let gameData = {};
        gameData['leaderboard'] = data.value;
        let newGameData = Object.assign({}, this.state.gameData, gameData);
        this.setState({
            gameData: newGameData
        });
    }

    renderPlayers() {
        let list = [];
        for (let i = 0; i < this.state.numDropdowns; ++i) {
            list.push(<Dropdown id={`player_${i}`} data="test" key={`player_${i}`} placeholder='Select player' search selection options={this.state.players} onChange={this.logSelectedData.bind(this)}/>);
        }
        return list;
    }

    playerIncreament() {
            const numPlayers = this.state.numDropdowns;
            this.setState ({
                numDropdowns: numPlayers + 1
            });
    }

    submitResult() {
        const gameData = this.state.gameData;
        const path = `/api/update/${gameData.leaderboard}`;
        axios({
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            url: path,
            data: Object.assign({}, gameData, App.staticKey)
        }).then(resp => {
            if (resp.data == 'good') {
                this.setState ({
                    sucess: true,
                    toLeaderboard: true
                });
            }
        });
    }

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

    getResult() {
        const gameData = this.state.gameData;
        let players = '';
        for (const prop in gameData) {
        // skip loop if the property is from prototype
        if(!gameData.hasOwnProperty(prop) || prop == 'leaderboard' || prop == 'winner') continue;

        players = players + ', ' + gameData[prop];
    }
        return `${gameData.winner} won the game ${gameData.leaderboard} against ${players}`;
    }

    handleCancel() {
        this.setState({
            openConfirm: false
        });
    }

    confirm() {
        if (this.state.gameData && this.state.gameData.winner) {
            this.setState({
                openConfirm: true,
                error: false
            });
        }
        else {
            this.setState({
                error: true
            });
        }
    }

    render() {
        const label = this.state.sucess ? <Label basic color='green' pointing='left'>Succeed!</Label> : '';
        const leaderboardPath = `/leaderboard/${this.state.gameData.leaderboard}`;

        if (this.state.toLeaderboard) {
            return <Redirect push to={leaderboardPath} />;
        }
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
                        <Button positive onClick={this.confirm.bind(this)}>Save</Button>
                        {this.state.error ? <Label basic color='red' pointing='left'>Result cannot be empty!</Label> : null}
                        <Confirm
                            open={this.state.openConfirm}
                            header="Saving the result:"
                            content={this.getResult()}
                            onCancel={this.handleCancel.bind(this)}
                            onConfirm={this.submitResult.bind(this)}
                        />
                    </Button.Group>
                    {label}
                </div>
            </div>
        );
    }
}
