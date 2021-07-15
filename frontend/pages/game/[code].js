import { PureComponent } from 'react';
import { withRouter } from 'next/router';

class Game extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            players: []
        };
    }

    componentDidMount() {
        this.getPlayers();
        window.addEventListener('storage', this.getPlayers);
    }

    getPlayers = () => {
        const players = JSON.parse(localStorage.getItem('players') || []);
        if (players.length !== 0) {
            this.setState({ players });
        }
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
                <div>Players:</div>
                {this.renderPlayers()}
            </>
        );
    }
}

export default withRouter(Game);
