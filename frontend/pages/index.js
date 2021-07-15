import Head from 'next/head';
import { PureComponent } from 'react';
import { withRouter } from 'next/router';
import socket from '../lib/socket';

class Home extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            username: 'Pinta',
            rooms: 0,
            roomName: ''
        };
    }

    componentDidMount() {
        socket.on('gameCreated', this.redirectToGamePage);
        socket.on('gameJoined', this.redirectToGamePage);
        socket.on('newGameCreated', () => {
            this.setState((prevState) => ({
                rooms: prevState.rooms + 1
            }));
        });
    }

    // eslint-disable-next-line class-methods-use-this
    componentWillUnmount() {
        socket.off('gameCreated');
        socket.off('gameJoined');
        socket.off('newGameCreated');
    }

    handleUsernameChange = (event) => {
        this.setState(() => ({
            username: event.target.value
        }));
    };

    handleCreateGame = () => {
        socket.emit('newGame', { username: this.state.username });
    }

    renderCreateGame = () => (
        <>
            <div>Wanna create new game?</div>
            <button type="button" onClick={this.handleCreateGame}>
                Create
            </button>
        </>
    );

    handleRoomNameChange = (event) => {
        this.setState(() => ({
            roomName: event.target.value
        }));
    }

    handleJoinGame = () => {
        socket.emit('joinGame', { username: this.state.username, roomName: this.state.roomName });
    }

    redirectToGamePage = ({ roomName, allPlayers }) => {
        localStorage.setItem('players', JSON.stringify(allPlayers));
        this.props.router.push(`/game/${roomName}`);
    }

    renderJoinGame = () => (
        <>
            <div>Wanna join existing game?</div>
            <input type="text" value={this.state.roomName} onChange={this.handleRoomNameChange}></input>
            <button type="button" onClick={this.handleJoinGame}>
                Join
            </button>
        </>
    );

    renderActiveRoomNumber = () => (
        <>
            Current active games: {this.state.rooms}
        </>
    );

    render() {
        return (
            <>
                <Head>
                    <title>Welcome to Quiz Mafia</title>
                    <meta name="description" content="Try to beat your friends!" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <div>Enter username!</div>
                <input type="text" value={this.state.username} onChange={this.handleUsernameChange}></input>
                <div>
                    {this.renderCreateGame()}
                    {this.renderJoinGame()}
                </div>

                {this.renderActiveRoomNumber()}
            </>
        );
    }
}

export default withRouter(Home);
