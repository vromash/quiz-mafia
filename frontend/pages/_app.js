/* eslint-disable class-methods-use-this */
import { PureComponent } from 'react';
import '../styles/globals.css';
import socket from '../lib/socket';

class MyApp extends PureComponent {
    componentDidMount() {
        const sessionID = localStorage.getItem('sessionID');
        if (sessionID) {
            socket.auth = { sessionID };
        }

        socket.connect();
        socket.on('session', ({ sessionID, userID }) => {
            // save session data to the next reconnection attempts
            socket.auth = { sessionID };
            socket.userID = userID;
            localStorage.setItem('sessionID', sessionID);
        });
    }

    componentWillUnmount() {
        socket.off('connect_error');
        socket.off('session');
    }

    render() {
        const { Component: CurrentComponent, pageProps } = this.props;
        return <CurrentComponent {...pageProps} />;
    }
}

export default MyApp;
