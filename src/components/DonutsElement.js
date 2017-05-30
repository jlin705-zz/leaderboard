import React, { Component } from 'react';
import axios from 'axios';
import {Table, Button} from 'semantic-ui-react';
import Emojify from 'react-emojione';
import App from './App';

export default class DonutsElement extends Component{
    static propTypes = {
        name: React.PropTypes.string.isRequired,
        count: React.PropTypes.number.isRequired
    };

    state = {
        count: this.props.count
    };

    handleAdd() {
        let currentCount = this.state.count;

        const path = `/api/donuts/add/${this.props.name}`;
        axios({
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            url: path,
            data: App.staticKey
        }).then(resp => {
            if (resp.data == 'good') {
                currentCount = currentCount + 1;
                this.setState({
                    count: currentCount
                });
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
                </Table.Cell>
            </Table.Row>
        );

    }
}
