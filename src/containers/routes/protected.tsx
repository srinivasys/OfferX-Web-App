import React, { useEffect } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import history from '../../history';
import { routes } from './routes-names';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';

type Props = RouteProps;

const ProtectedRoute = (props: Props) => {
    const { loading, user } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (loading || user) return;
        history.push(routes.main);
    }, [loading, user]);

    return user ? <Route {...props} /> : null;
};

export default ProtectedRoute;
