import { PureComponent } from 'react';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import Layout from '../components/Layout/Layout';
import styles from '../styles/Home.module.scss';
import { getActiveGames } from '../lib/fetch';
import withSocket from '../hoc/withSocket';
import { addId, addPlayers } from '../store/game';

const mapStateToProps = (state) => ({ game: state.game });
const actionCreators = {
    addId,
    addPlayers
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
                Current active games: {this.state.activeGames}
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

export default connect(mapStateToProps, actionCreators)(withRouter(withSocket(Home)));

export async function getServerSideProps() {
    const { activeGames } = await getActiveGames();

    return {
        props: {
            activeGames
        }
    };
}
