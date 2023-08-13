import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../routes/routes-names';

const DocumentSuccess = () => {
    return (
        <div className="my-5">
            <div className="col-5 m-auto">
                <div className="card">
                    <div className="card-body text-center">
                        <i className="bi bi-check-circle lt-text-success-alt fs-68" />
                        <h1 className="fw-700 fs-20">Finished Signing!</h1>
                        <p className="mb-3">
                            Your signed document has been sent to the employer. The copy of this document has been saved
                            on this platform.
                        </p>
                        <Link to={routes.pendingOffers} type="button" className="btn btn-primary">
                            Return to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentSuccess;
