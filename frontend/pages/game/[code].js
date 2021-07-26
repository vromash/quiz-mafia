import { PureComponent } from 'react';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import withSocket from '../../hoc/withSocket';
import { addPlayer, removePlayer, removeAllPlayers } from '../../store/game';

const mapStateToProps = (state) => ({ game: state.game });
const actionCreators = {
    addPlayer,
    removePlayer,
    removeAllPlayers
};

class Game extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            roomId: ''
        };
    }

    componentDidMount() {
        const { socket } = this.props;

        socket.on('playerLeft', this.leaveGame);
        socket.on('PlayerJoined', this.handlePlayerJoined);
        socket.on('PlayerLeft', this.handlePlayerLeft);
    }

    componentDidUpdate() {
        this.setState({ roomId: this.props.router.query.code });
    }

    componentWillUnmount() {
        const { socket } = this.props;

        socket.off('playerLeft');
        socket.off('PlayerJoined');
        socket.off('PlayerLeft');
    }

    handlePlayerJoined = (player) => {
        this.props.addPlayer(player);
    }

    handlePlayerLeft = (id) => {
        this.props.removePlayer(id);
    }

    leaveGame = () => {
        this.props.removeAllPlayers();
        this.props.router.push('/');
    }

    handleLeaveGame = () => {
        this.props.socket.emit('leaveGame', { gameId: this.props.game.id, userId: this.props.session.userId });
    }

    renderPlayers() {
        const { players } = this.props.game;
        if (players.length === 0) {
            return <div>No players connected</div>;
        }

        return Object.values(players).map(({ id, username }) => <div key={id}>{username}</div>);
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

export default connect(mapStateToProps, actionCreators)(withRouter(withSocket(Game)));
