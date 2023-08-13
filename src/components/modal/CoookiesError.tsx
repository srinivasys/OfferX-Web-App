import React from 'react';
import '../../assets/styles/styles.css';
import OfferxLogo from '../../assets/img/offerx-logo.png';

const CookiesError = () => {
    return (
        <div className="cookie-box d-flex justify-content-center align-items-center">
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-md-5">
                    <div className="cookie-card lt-shadow-sm">
                        <div className="cookie-card-body p-4">
                            <img src={OfferxLogo} className="site-logo mb-3" title="OfferX" alt="OfferX Logo" />

                            <h5>We can't sign you in</h5>
                            <p className="fs-14 lt-text-secondary mt-2">
                                Your browser is currently set to block cookies. You need to allow cookies to use this
                                service.
                            </p>

                            <p className="fs-14 lt-text-secondary mt-3">
                                Cookies are small text files stored on your computer that tell us when you're signed in.
                                To learn how to allow cookies, check the online help in your web browser.
                            </p>

                            <p className="fs-14 mt-3 lt-text-secondary">Follow the steps:</p>

                            <ol className="mb-0 lt-text-secondary">
                                <li className="fs-12 fw-400">
                                    Click the three dots in the upper-right corner of the browser.
                                </li>
                                <li className="fs-12 fw-400">Select "Settings" from the drop-down menu.</li>
                                <li className="fs-12 fw-400">Scroll down and click "Advanced."</li>
                                <li className="fs-12 fw-400">
                                    Under "Privacy and security," click "Content settings."
                                </li>
                                <li className="fs-12 fw-400">Click "Cookies."</li>
                                <li className="fs-12 fw-400">Make sure "Block third-party cookies" is turned on.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookiesError;
