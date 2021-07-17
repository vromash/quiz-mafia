import { PureComponent } from 'react';
import { withRouter } from 'next/router';
import socket from '../../lib/socket';

class Game extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            players: [],
            roomName: ''
        };
    }

    componentDidMount() {
        this.getPlayers();
        window.addEventListener('storage', this.getPlayers);

        console.log(1);

        socket.on('gameLeft', this.leaveGame);
        socket.on('playerJoined', this.handlePlayerJoined);
        socket.on('playerLeft', this.handlePlayerLeft);

        console.log(socket);
    }

    componentDidUpdate() {
        this.setState({ roomName: this.props.router.query.code });
    }

    // handlePlayerJoined = (user) => {
    //     let players = JSON.parse(localStorage.getItem('players'));
    //     if (!players) players = [];
    //     console.log(players);
    //     players.push(user);
    //     localStorage.setItem('players', JSON.stringify(players));
    //     window.dispatchEvent(new Event('storage'));
    // }

    // handlePlayerLeft = (userId) => {
    //     let players = JSON.parse(localStorage.getItem('players'));
    //     if (!players) players = [];
    //     players = players.filter(({ id }) => id !== userId);
    //     localStorage.setItem('players', JSON.stringify(players));
    //     window.dispatchEvent(new Event('storage'));
    // }

    leaveGame = () => {
        localStorage.removeItem('players');
        this.props.router.push('/');
    }

    getPlayers = () => {
        const players = JSON.parse(localStorage.getItem('players') || []);
        if (players.length !== 0) {
            this.setState({ players });
        }
    }

    handleLeaveGame = () => {
        socket.emit('leaveGame', { roomName: this.state.roomName });
    }

    renderPlayers() {
        const { players } = this.state;
        if (players.length === 0) {
            return <div>No players connected</div>;
        }

        return players.map(({ id, username }) => <div key={id}>{username}</div>);
    }

    render() {
        const { code } = this.props.router.query;
        return (
            <>
                <p>Game: {code}</p>
                <button type="button" onClick={this.handleLeaveGame}>
                    Leave game
                </button>
                <div>Players:</div>
                {this.renderPlayers()}
            </>
        );
    }
}

export default withRouter(Game);
