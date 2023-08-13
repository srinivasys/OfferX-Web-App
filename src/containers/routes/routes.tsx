import { ConnectedRouter } from 'connected-react-router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LinkedInCallback } from 'react-linkedin-login-oauth2';
import history from '../../history';
import { routes } from './routes-names';
import Main from '../main';
import { getUser } from '../../redux/user';
import ProtectedRoute from './protected';
import Room from '../room';
import About from '../main/about';
import Contact from '../main/contact';
import Legal from '../main/legal/index';
import ScrollToTop from './scroll-to-top';

const Routes = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        (async function () {
            await dispatch(getUser());
        })();
    }, [dispatch]);

    return (
        <ConnectedRouter history={history}>
            <ScrollToTop />
            <Switch>
                <Route exact path={routes.main} component={Main} />
                <Route exact path={routes.about} component={About} />
                <Route exact path={routes.contact} component={Contact} />
                <Route path={routes.legal} component={Legal} />
                <Route exact path={routes.linkedin} component={LinkedInCallback} />
                <ProtectedRoute path={routes.main} component={Room} />
            </Switch>
            <ToastContainer autoClose={5000} transition={Zoom} theme="colored" hideProgressBar />
        </ConnectedRouter>
    );
};

export default Routes;
