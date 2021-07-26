import { PureComponent } from 'react';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import Layout from '../components/Layout/Layout';
import styles from '../styles/Home.module.scss';
import { getActiveGames, isUserInGame } from '../lib/fetch';
import withSocket from '../hoc/withSocket';
import {
    addId,
    addPlayers,
    updateInGameStatus,
    updateGameData,
    resetGameData,
    removeAllPlayers
} from '../store/game';
import CardButton from '../components/CardButton/CardButton';

const mapStateToProps = (state) => ({ game: state.game });
const actionCreators = {
    addId,
    addPlayers,
    updateInGameStatus,
    updateGameData,
    resetGameData,
    removeAllPlayers
};

class Home extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            activeGames: 0,
            roomId: ''
        };
    }

    componentDidMount() {
        const { socket, activeGames } = this.props;

        this.setState({ activeGames });
        this.getIsUserInGame();

        socket.on('gameCreated', this.redirectToGamePage);
        socket.on('playerJoined', this.redirectToGamePage);

        socket.on('GameCreated', () => {
            this.setState((prevState) => ({
                activeGames: prevState.activeGames + 1
            }));
        });
        socket.on('GameEnded', () => {
            this.setState((prevState) => ({
                activeGames: prevState.activeGames - 1
            }));
        });
    }

    componentWillUnmount() {
        const { socket } = this.props;

        socket.off('gameCreated');
        socket.off('playerJoined');
        socket.off('GameCreated');
        socket.off('GameEnded');
    }

    getIsUserInGame = async () => {
        if (!this.props.session.userId) {
            return;
        }

        const game = await isUserInGame(this.props.session.userId);
        this.props.updateGameData(game);
    }

    handleUsernameChange = (event) => {
        this.setState(() => ({
            username: event.target.value
        }));
    };

    handleCreateGame = () => {
        const { socket, session: { userId } } = this.props;
        socket.emit('createGame', { id: userId, username: this.state.username });
    }

    handleRoomNameChange = (event) => {
        this.setState(() => ({
            roomId: event.target.value
        }));
    }

    handleJoinGame = () => {
        const { socket, session: { userId } } = this.props;
        const { username, roomId } = this.state;
        socket.emit('joinGame', { id: userId, username, roomId });
    }

    handleRejoinGame = () => {
        const { socket, session: { userId }, game: { roomId } } = this.props;
        const { username } = this.state;
        socket.emit('joinGame', { id: userId, username, roomId });
    }

    handleLeaveGame = () => {
        this.props.removeAllPlayers();
        this.props.resetGameData();
        this.props.socket.emit('leaveGame', { gameId: this.props.game.id, userId: this.props.session.userId });
    }

    redirectToGamePage = ({ gameId, roomId, allPlayers }) => {
        this.props.addId(gameId);
        this.props.addPlayers(allPlayers);
        this.props.router.push(`/game/${roomId}`);
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
                <CardButton labelStyles={styles.create} label="Create new game &rarr;" handleButtonClick={this.handleCreateGame} />
            </div>
        );
    }

    renderJoinGame() {
        return (
            <div className={styles.column_el}>
                <CardButton
                    label="Join existing game &rarr;"
                    handleButtonClick={this.handleJoinGame}
                >
                    <input
                        className={styles.input}
                        type="text"
                        value={this.state.roomId}
                        onChange={this.handleRoomNameChange}
                        placeholder="12345"
                    />
                </CardButton>
            </div>
        );
    }

    renderRejoinGame() {
        return (
            <div className={styles.column_el}>
                <CardButton label="Rejoin game &rarr;" handleButtonClick={this.handleRejoinGame} />
            </div>
        );
    }

    renderLeaveGame() {
        return (
            <div className={styles.column_el}>
                <CardButton label="Leave game &rarr;" handleButtonClick={this.handleLeaveGame} />
            </div>
        );
    }

    renderActiveRoomNumber() {
        return (
            <>
                Current active games: {this.state.activeGames}
            </>
        );
    }

    renderGrid() {
        return (
            <div className={styles.grid}>
                {this.renderUsername()}
                <div className={styles.columns}>
                    { this.props.game.inGame ? this.renderRejoinGame() : this.renderCreateGame() }
                    { this.props.game.inGame ? this.renderLeaveGame() : this.renderJoinGame() }
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

export default connect(mapStateToProps, actionCreators)(withRouter(withSocket(Home)));

export async function getServerSideProps() {
    const { activeGames } = await getActiveGames();

    return {
        props: {
            activeGames: activeGames || 0
        }
    };
}
