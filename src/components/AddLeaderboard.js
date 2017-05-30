import React, { Component } from 'react';
import { Input, Button, Confirm, Label } from 'semantic-ui-react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import App from './App';

export default class AddLeaderboard extends Component {
    state = {
        leaderboardName: '',
        openConfirm: false,
        redirect: false,
        error: false
    };

    getNewLeaderboard(e, data) {
        this.setState({
            leaderboardName: data.value
        });
    }

    submit() {
        const leaderboardName = this.state.leaderboardName;
        const path = '/api/new/';
        axios({
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            url: path,
            data: Object.assign({name: leaderboardName}, App.staticKey)
        }).then(() => {
                this.setState ({
                    sucess: true,
                    redirect: true
                });
        });
    }

    handleCancel() {
        this.setState({
            openConfirm: false
        });
    }

    confirm() {
        if (this.state.leaderboardName != '') {
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
        if (this.state.redirect) {
            const leaderboardPath = '/leaderboards/';

            return <Redirect push to={leaderboardPath} />;
        }
        return (
            <div>
                <h1>Create a new leaderboard:</h1>
                <div className='data-input'>
                    <Input placeholder='New leaderboard' onChange={this.getNewLeaderboard.bind(this)} />
                </div>
                <div className='submit'>
                    <Button positive onClick={this.confirm.bind(this)}>Add</Button>
                    {this.state.error ? <Label basic color='red' pointing='left'>Name cannot be empty!</Label> : null}
                </div>
                <Confirm
                    open={this.state.openConfirm}
                    header={`Adding new leaderboard: ${this.state.leaderboardName}`}
                    onCancel={this.handleCancel.bind(this)}
                    onConfirm={this.submit.bind(this)}
                />
            </div>
        );
    }
}
