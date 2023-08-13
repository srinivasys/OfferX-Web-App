import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { OptionsOffer } from '../utils/candidate-company-options';

const RateOnboarding = () => {
    return (
        <>
            <div className="col-xl-12 col-xxl-12 col-12">
                <div className="card p-4 mb-4 lt-star-review-card grayscale">
                    <div className="block-element">
                        <span>Coming Soon</span>
                    </div>
                    <div className="d-flex mb-3">
                        <div className="card-title fs-16 fw-600">
                            Conversion rate of Onboarding{' '}
                            <i className="bi bi-info-circle lt-tooltip">
                                <span className="lt-tooltiptext lt-shadow-md fw-400 fs-14">
                                    Offer Accepted After onboarding
                                </span>
                            </i>{' '}
                        </div>
                        <div className="dropdown lt-dropdown-menu ms-auto">
                            <a
                                className="dropdown-toggle p-0"
                                href="#"
                                role="button"
                                id="MoreOption"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="bi bi-three-dots-vertical"></i>
                            </a>
                            <ul
                                className="dropdown-menu lt-shadow-tin py-0"
                                aria-labelledby="MoreOption"
                                role="tablist"
                            >
                                <li>
                                    <a href="#" className="dropdown-item">
                                        Current Month
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="dropdown-item">
                                        Last week
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="dropdown-item">
                                        Last Month
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <ReactApexChart options={OptionsOffer} series={[75]} type="radialBar" height={255} />

                    <div className="lt-avg">
                        <div className="row">
                            <div className="col">
                                <p className="fw-600 fs-14">1</p>
                            </div>
                            <div className="col">
                                <p className="fw-600 fs-14">7</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-2">
                        <p className="fw-600 fs-16">
                            Days Average of Onboarding: <span className="fs-14 fw-400">5days</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RateOnboarding;
