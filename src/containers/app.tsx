import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux';
import Routes from './routes/routes';
import { appVersion } from '../config/constants';

// Css deps
import 'normalize.css/normalize.css';
import 'bootstrap/scss/bootstrap.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../assets/styles/styles.css';
import '../assets/styles/colors.css';
import '../assets/styles/fonts.css';
import '../assets/styles/typography.css';
import '../assets/styles/elements.css';
import '../assets/styles/aos.css';
import '../assets/styles/app/app.sass';

// import "primeflex/primeflex.scss";
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css'; //core css
import 'primereact/resources/primereact.css';
import CookiesError from '../components/modal/CoookiesError';
//import 'primereact/resources/themes/md-light-indigo/theme.css'; //theme

const App = () => {
    const cookieEnabled = navigator.cookieEnabled;

    // useEffect(() => {
    //     console.log(`Version: ${appVersion}`);
    // }, []);

    if (!cookieEnabled) {
        return <CookiesError />;
    } else {
        return (
            <div>
                <Provider store={store}>
                    <Routes />
                </Provider>
            </div>
        );
    }
};

export default App;
