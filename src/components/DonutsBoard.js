import React, { Component } from 'react';
import axios from 'axios';
import {Table, Icon} from 'semantic-ui-react';
import Loading from './Loading';
import DonutsElement from './DonutsElement';

export default class DonutsBoard extends Component{
    state = {
        data: []
    };

    componentDidMount() {
        axios.get('/api/donuts')
            .then(resp => {
                this.setState({
                    data: resp.data
                });
            })
            .catch(console.error);
    }

    render() {
        const data = this.state.data;
        if (data.length > 0) {
            return (
                <div>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Current Dounuts Count</Table.HeaderCell>
                            <Table.HeaderCell>More Donuts</Table.HeaderCell>
                            <Table.HeaderCell>Last Modified</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data.map( obj =>
                            <DonutsElement name={obj.name} count={obj.count} key={obj.name} dozen={obj.dozen} lastModified={obj.lastModified ? obj.lastModified : ''} />
                        )}
                    </Table.Body>
                </Table>
                <div><Icon name='shopping basket' size='large' />You need to buy donuts for the team when you got a dozen</div>
                </div>
            );
        } else {
            return (
                <Loading />
            );
        }

    }
}
