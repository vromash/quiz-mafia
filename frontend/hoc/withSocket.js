import { PureComponent } from 'react';
import { connect } from 'react-redux';

import socket from '../lib/socket';
import { addId as addSessionId, addUserId } from '../store/session/session';

function withSocket(WrappedComponent) {
    const mapStateToProps = (state) => ({ session: state.session });
    const actionCreators = {
        addSessionId,
        addUserId
    };

    class ComponentWithSocket extends PureComponent {
        componentDidMount() {
            const { id: sessionIdLocal, userId: userIdLocal } = this.props.session;

            if (sessionIdLocal && userIdLocal) {
                socket.auth = { sessionId: sessionIdLocal };
                socket.userId = userIdLocal;
            }

            socket.connect();
            socket.on('session', ({ sessionId, userId }) => {
                // save session data to the next reconnection attempts
                socket.auth = { sessionId };
                socket.userId = userId;

                this.props.addSessionId(sessionId);
                this.props.addUserId(userId);
            });
        }

        componentWillUnmount() {
            socket.off('connect_error');
            socket.off('session');
        }

        render() {
            return <WrappedComponent socket={socket} {...this.props} />;
        }
    }

    return connect(mapStateToProps, actionCreators)(ComponentWithSocket);
}

export default withSocket;
