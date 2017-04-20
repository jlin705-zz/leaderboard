import React, { Component } from 'react';
import { Input, Button } from 'semantic-ui-react';
import axios from 'axios';

export default class AddLeaderboard extends Component {
    state = {
        leaderboardName: ''
    };

    getNewLeaderboard(e, data) {
        this.setState({
            leaderboardName: data.value
        })
    };

    submit() {
        const leaderboardName = this.state.leaderboardName;
        const path = '/api/new/';
        console.log('posingt');
        axios({
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            url: path,
            data: {name: leaderboardName}
        }).then(resp => {
            console.log(resp)
            if (resp.data == 'good') {
                this.setState ({
                    sucess: true
                })
            }
        })
    };

    render() {
        const label = this.state.sucess ? <Label basic color='green' pointing='left'>Succeed!</Label> : '';

        return (
            <div>
                <h1>Create a new leaderboard:</h1>
                <div className='data-input'>
                    <Input placeholder='New leaderboard' onChange={this.getNewLeaderboard.bind(this)} />
                </div>
                <div className='submit'>
                    <Button positive onClick={this.submit.bind(this)}>Add</Button>{label}
                </div>
            </div>
        )
    }
}
