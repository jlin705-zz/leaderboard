import React, {Component, PropTypes} from 'react';
import { Menu, Input } from 'semantic-ui-react';
import { Route, Link } from 'react-router-dom';
import Home from './Home';
import BoardList from './BoardList';
import Leaderboard from './Leaderboard'

class Header extends Component {
    static propTypes = {
        history: React.PropTypes.object
    };

    static contextTypes = {
       router: PropTypes.shape({
         history: PropTypes.shape({
           push: PropTypes.func.isRequired,
           replace: PropTypes.func.isRequired,
           createHref: PropTypes.func.isRequired
         }).isRequired
       }).isRequired
   };

    state = {};

    handleMenuClick = (e, { name, to }) => {
        this.setState({activeItem: name});
        const {history} = this.context.router;
        history.push(to);

    };

    render() {
        const {activeItem} = this.state;
        return (
            <Menu>
                <Menu.Item name='Home' active={activeItem === 'Home'} onClick={this.handleMenuClick} to='/'>
                Home
                </Menu.Item>
                <Menu.Item name='Leaderboards' active={activeItem === 'Leaderboards'} to='/leaderboards' onClick={this.handleMenuClick}>
                Leaderboards
                </Menu.Item>
                <Menu.Item name='Log Result' active={activeItem === 'Log Result'} to='/logResult' onClick={this.handleMenuClick}>
                Log result
                </Menu.Item>
                <Menu.Menu position='right'>
                    <Menu.Item name='Donuts' active={activeItem === 'Donuts'} to='/donuts' onClick={this.handleMenuClick}>
                    Donuts
                    </Menu.Item>
                  </Menu.Menu>
            </Menu>
        )
    }
}

export default Header;
