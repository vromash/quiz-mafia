import Head from 'next/head';
import { PureComponent } from 'react';
import styles from '../../styles/Layout.module.scss';

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
