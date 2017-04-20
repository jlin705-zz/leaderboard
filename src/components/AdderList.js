import React, { Component } from 'react';
import AddLeaderboard from './AddLeaderboard';
import AddResult from './AddResult';
import AddPlayer from './AddPlayer';

import { Divider } from 'semantic-ui-react';

export default class AddList extends Component {
    render() {
        return (
            <div>
                <AddResult />
                <Divider horizontal>Or</Divider>
                <AddPlayer />
                <Divider horizontal>Or</Divider>
                <AddLeaderboard />
            </div>
        )
    }
}
