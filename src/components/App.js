import React, {Component}from 'react';
import Header from './Header';
import Home from './Home';
import BoardList from './BoardList';
import Leaderboard from './Leaderboard';
import AdderList from './AdderList';
import DonutsBoard from './DonutsBoard';
import { Route } from 'react-router-dom';
import axios from 'axios';

class App extends Component{

    static staticKey = {
        _csrf: ''
    }

    componentDidMount() {
        axios.get('/api/form')
            .then(resp => {
                 App.staticKey['_csrf']= resp.data.csrfToken;
            })
            .catch(console.error);
    }

    render() {
        return (
        <div className="App">
            <Header />
            {this.props.children}
            <Route exact path='/' component={Home} />
            <Route exact path='/leaderboards' component={BoardList} />
            <Route path='/leaderboard/:gameName' component={Leaderboard} />
            <Route path='/logResult' component={AdderList} />
            <Route path='/donuts' component={DonutsBoard} />
        </div>
    );
    }
}

export default App;
