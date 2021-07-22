import Head from 'next/head';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import styles from '../../styles/Layout.module.scss';
import { idAdded as sessionIdAdded, userIdAdded } from '../../store/session/session';

const mapStateToProps = (state) => ({ session: state.session });
const actionCreators = {
    sessionIdAdded,
    userIdAdded
};

class Layout extends PureComponent {
    renderHead() {
        return (
            <Head>
                <title>Welcome to Quiz Mafia</title>
                <meta name="description" content="Try to beat your friends!" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
        );
    }

    render() {
        const { children } = this.props;
        return (
            <div className={styles.container}>
                {this.renderHead()}
                {children}
            </div>
        );
    }
}

export default Layout;

// export async function getServerSideProps() {

//     return {
//         props: {
//             test: 1
//         }
//     };
// }
