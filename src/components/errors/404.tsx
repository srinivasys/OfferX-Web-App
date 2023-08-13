import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Icon404 } from '../../assets/icons/404.svg';
import { routes } from '../../containers/routes/routes-names';

const Error404 = () => {
    return (
        <div className="full-height-container">
            <Icon404 />
            <div className="mt-4 fs-16 fw-600">Sorry, the page you requested could not be found.</div>
            <Link to={routes.pendingOffers} className="btn btn-lg btn-primary mt-4">
                Back to Home
            </Link>
        </div>
    );
};

export default Error404;
