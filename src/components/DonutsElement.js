import React, { Component } from 'react';
import axios from 'axios';
import {Table, Button, Label} from 'semantic-ui-react';
import Emojify from 'react-emojione';
import App from './App';

export default class DonutsElement extends Component{
    static propTypes = {
        name: React.PropTypes.string.isRequired,
        count: React.PropTypes.number.isRequired,
        lastModified: React.PropTypes.string.isRequired
    };

    state = {
        count: this.props.count,
        lastModified: this.props.lastModified,
        tooSoon: false
    };

    handleAdd() {
        let currentCount = this.state.count;

        const path = `/api/donuts/add/${this.props.name}`;
        const last = this.state.lastModified != '' ? this.state.lastModified : '2015-01-01';
        axios({
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            url: path,
            data: Object.assign({'lastModified': last}, App.staticKey)
        }).then(resp => {
            if (resp.data != 'too soon') {
                currentCount = currentCount + 1;
                this.setState({
                    count: currentCount,
                    lastModified: resp.data
                });
            } else {
                this.setState({
                    tooSoon: true
                })
            }
        });
    }

    handleClear() {
        const path = `/api/donuts/clear/${this.props.name}`;
        axios({
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            url: path,
            data: App.staticKey
        }).then(resp => {
            if (resp.data == 'good') {
                this.setState({
                    count: 0
                });
            }
        });
    }

    getEmoji() {
        const count = this.state.count;
        const result = [];
        for (let i = 0; i < count; i++){
            result.push(
                <Emojify style={{height: 32, width: 32}} key={i}>
                    <span>:doughnut:</span>
                </Emojify>
                );
        }
        return result;
    }

    render() {
        const donutsEmoj = this.getEmoji();
        const lastModified = this.state.lastModified;
        const error = this.state.tooSoon ? <Label basic color='red' pointing='left'>Try again in 30 mins</Label> : '';
        return (
            <Table.Row key={this.props.name}>
                <Table.Cell>{this.props.name}</Table.Cell>
                <Table.Cell>{donutsEmoj}{this.state.count}</Table.Cell>
                <Table.Cell>
                    <Button positive onClick={this.handleAdd.bind(this)}>
                        Add<Emojify style={{height: 15, width: 15}}><span>:doughnut:</span></Emojify>
                    </Button>
                    <Button positive onClick={this.handleClear.bind(this)}>
                        Hooray<Emojify style={{height: 15, width: 15}}><span>:fork_and_knife:</span></Emojify>
                    </Button>
                    {error}
                </Table.Cell>
                <Table.Cell>
                    {lastModified}
                </Table.Cell>
            </Table.Row>
        );

    }
}
