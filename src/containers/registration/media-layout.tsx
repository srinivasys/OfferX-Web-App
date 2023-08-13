import React, { ReactNode } from 'react';
import websitelogo from '../../assets/img/offerx-logo.png';

type Props = {
    children: ReactNode[] | ReactNode;
};

const MediaLayout: React.FC<Props> = ({ children }) => {
    return (
        <div className="modal-body lt-modal-body py-5">
            <div className="row">
                <div className="col-lg-7 col col-xl">
                    <div className="signin-popup-col px-4 py-4">
                        <img src={websitelogo} className="site-logo" alt="OfferX Logo" />
                        <h1 className="fw-600 fs-28 hashtag my-sm-5">
                            # <span className="me-1">No</span> <span className="me-1">More</span>{' '}
                            <span className="me-1">Ghosting</span>
                        </h1>
                        <h2 className="fw-600 fs-28">With OfferX, it's easy!</h2>
                        <div className="check-points">
                            <i className="bi bi-check-circle-fill" />
                            To release and sign job offers
                        </div>
                        <div className="check-points">
                            <i className="bi bi-check-circle-fill" />
                            Securely access and manage the job offers
                        </div>
                        <div className="check-points">
                            <i className="bi bi-check-circle-fill" />
                            Two-way reviewing platform
                        </div>
                        <div className="check-points">
                            <i className="bi bi-check-circle-fill" />
                            Increase the committal rate with the accepted job offers
                        </div>
                    </div>
                </div>
                <div className="col-lg-5 col col-xl align-items-center d-flex">
                    <div className="px-4 py-5 w-100">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default MediaLayout;
