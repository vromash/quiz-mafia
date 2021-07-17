import { PureComponent } from 'react';
import { withRouter } from 'next/router';
import socket from '../lib/socket';
import Layout from '../components/Layout/Layout';
import styles from '../styles/Home.module.scss';

class Home extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            rooms: 0,
            roomName: ''
        };
    }

    componentDidMount() {
        socket.on('gameCreated', this.redirectToGamePage);
        socket.on('gameJoined', this.redirectToGamePage);
        socket.on('rooms', (rooms) => {
            console.log(rooms);
            this.setState({ rooms });
        });
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

    renderWelcome() {
        return (
            <>
                <h1 className={styles.title}>Welcome to Quiz Mafia</h1>
                <p className={styles.description}>Create new game or join existing</p>
            </>
        );
    }

    renderUsername() {
        return (
            <div className={styles.username}>
                <h2>Enter username first!</h2>
                <input className={styles.input} type="text" value={this.state.username} onChange={this.handleUsernameChange} placeholder="Pinta "></input>
            </div>
        );
    }

    renderCreateGame() {
        return (
            <div className={styles.column_el}>
                <button className={styles.card} type="button" onClick={this.handleCreateGame}>
                    <h2 className={styles.create}>Create new game &rarr;</h2>
                </button>
            </div>
        );
    }

    renderJoinGame() {
        return (
            <div className={styles.column_el}>
                <div className={styles.card} type="button">
                    <button type="button" onClick={this.handleJoinGame}><h2>Join existing game &rarr;</h2></button>
                    <input className={styles.input} type="text" value={this.state.roomName} onChange={this.handleRoomNameChange} placeholder="12345" />
                </div>
            </div>
        );
    }

    renderActiveRoomNumber() {
        return (
            <>
                Current active games: {this.state.rooms}
            </>
        );
    }

    renderGrid() {
        return (
            <div className={styles.grid}>
                {this.renderUsername()}
                <div className={styles.columns}>
                    {this.renderCreateGame()}
                    {this.renderJoinGame()}
                </div>
            </div>
        );
    }

    render() {
        return (
            <Layout>
                {this.renderWelcome()}
                {this.renderGrid()}
                {this.renderActiveRoomNumber()}
            </Layout>
        );
    }
}

export default withRouter(Home);
