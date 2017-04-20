import React, {Component}from 'react';
import Header from './Header';
import Home from './Home';
import BoardList from './BoardList';
import Leaderboard from './Leaderboard';
import AdderList from './AdderList';
import { Route } from 'react-router-dom';

class App extends Component{

    render() {
        return (
        <div className="App">
            <Header />
            {this.props.children}
            <Route exact path='/' component={Home} />
            <Route exact path='/leaderboards' component={BoardList} />
            <Route path='/leaderboard/:gameName' component={Leaderboard} />
            <Route path='/logResult' component={AdderList} />
        </div>
        )
    }
}

export default App;
