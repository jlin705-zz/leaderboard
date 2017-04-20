import React, { Component } from 'react';
import {Dimmer, Loader} from 'semantic-ui-react';

export default class Loading extends Component {
    render() {
        return (
            <div>
              <Dimmer active inverted>
                <Loader inverted>Loading</Loader>
              </Dimmer>
            </div>
        )
    }
}
