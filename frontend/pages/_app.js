import { PureComponent } from 'react';
import { Provider } from 'react-redux';

import '../styles/globals.scss';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/index';

class App extends PureComponent {
    render() {
        const { Component: CurrentComponent, pageProps } = this.props;
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <CurrentComponent {...pageProps} />
                </PersistGate>
            </Provider>
        );
    }
}

export default App;
