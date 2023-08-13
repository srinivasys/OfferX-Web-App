import React, { useEffect, useState } from 'react';
import moment from 'moment';
import DateRange from './components/date-range';
import Statistics from './components/statistics';
import PageLoader from '../../components/loader';
import TotalOffers from './components/total-offers';
import CandidateRating from './components/candidate-rating';
import CompanyRating from './components/company-rating';
import RateOfferAccepted from './components/rate-offer-accepted';
import RateOnboarding from './components/rate-onboarding';
import TodayReviewScore from './components/today-review-score';
import RecruiterOffers from './components/recruiter-offers';
import RecentActivity from './components/recent-activity';

const Dashboard: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [time, setTime] = useState<string | null>(moment().format('LT'));
    useEffect(() => {
        const subscribe = setInterval(() => {
            setTime(moment().format('LT'));
        }, 1000);
        return () => clearInterval(subscribe);
    }, []);

    return (
        <div className="ox-hidden company-page-contener">
            <div className="d-flex mt-4 pb-3 ox-dashboard-title align-items-center">
                <div className="flex-grow-1">
                    <h1 className="fw-700 fs-20 mb-3 lt-text-secondary">Dashboard</h1>
                    <div className="col-4">
                        <DateRange setSelectedYear={setSelectedYear} />
                    </div>
                </div>
                <div className="flex-shrink-1">
                    <div className="lt-today-date d-flex align-items-center">
                        <i className="bi bi-calendar3 fs-32 lt-text-primary-alt me-3" />
                        <div>
                            <div className="fs-20 fw-700">{time && time}</div>
                            <div className="fs-12 border-sm-start mt-3 mt-sm-0">{moment().format('Do MMMM YYYY')}</div>
                        </div>
                    </div>
                </div>
            </div>
            <Statistics selectedYear={selectedYear} />
            <div className="row row-deck">
                <div className="col-lg-12 col-xl-6">
                    <div className="card mb-4 border">
                        <div className="card-body p-4 lt-card-body">
                            <nav className="d-none">
                                <div className="d-flex bd-highlight lt-nav-bar">
                                    <div className="w-100 bd-highlight">
                                        <div className="nav nav-tabs nav-justified" id="nav-tab" role="tablist">
                                            <div
                                                className="nav-link col-2 fs-16 active"
                                                data-bs-target="#pills-offers"
                                                data-bs-toggle="pill"
                                                id="pills-offers-tab"
                                                role="tab"
                                            >
                                                Offers
                                            </div>
                                            <div
                                                className="nav-link col-2 fs-16"
                                                data-bs-target="#pills-registartions"
                                                data-bs-toggle="pill"
                                                id="pills-registartions-tab"
                                                role="tab"
                                            >
                                                Registrations
                                            </div>
                                            <div
                                                className="nav-link fs-16"
                                                data-bs-target="#pills-revenue"
                                                data-bs-toggle="pill"
                                                id="pills-revenue-tab"
                                                role="tab"
                                            >
                                                Subscriptions {'&'} Revenue
                                            </div>
                                            <div className="dropdown nav-link col-2 fs-16 d-none">
                                                <a
                                                    className="dropdown-toggle"
                                                    href="#"
                                                    role="button"
                                                    id="dropdownMenuLink"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    <i className="bi bi-three-dots"></i>
                                                </a>
                                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                                    <li>
                                                        <a
                                                            className="dropdown-item"
                                                            href="#"
                                                            data-bs-target="#pills-additional"
                                                            data-bs-toggle="pill"
                                                            id="pills-additional-tab"
                                                            role="tab"
                                                        >
                                                            Action
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-item" href="#">
                                                            Another action
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-item" href="#">
                                                            Something else here
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                            <div className="tab-content p-0" id="pills-tabContent">
                                <TotalOffers selectedYear={selectedYear} />
                                <div
                                    aria-labelledby="pills-registartions-tab"
                                    className="tab-pane fade"
                                    id="pills-registartions"
                                    role="tabpanel"
                                >
                                    <div className="d-flex mb-4">
                                        <div className="card-title fs-16 fw-600">Total Registrations</div>
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
                                                        Year of 2022
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" className="dropdown-item">
                                                        Year of 2021
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" className="dropdown-item">
                                                        Year of 2020
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" className="dropdown-item">
                                                        Year of 2019
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" className="dropdown-item">
                                                        Year of 2018
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div id="Registrations" style={{ width: '100%' }}></div>
                                    <div className="pt-4 border-top">
                                        <div className="row">
                                            <div className="col text-center">
                                                <h6 className="fs-14 mb-1">Total Registrations (YTD)</h6>
                                                <div className="fs-20 fw-700">4,562</div>
                                            </div>
                                            <div className="col text-center">
                                                <h6 className="fs-14 mb-1">Candidate Registrations (YTD)</h6>
                                                <div className="fs-20 fw-700">4,562</div>
                                            </div>
                                            <div className="col text-center">
                                                <h6 className="fs-14 mb-1">Employer Registrations (YTD)</h6>
                                                <div className="fs-20 fw-700">4,562</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    aria-labelledby="pills-revenue-tab"
                                    className="tab-pane fade"
                                    id="pills-revenue"
                                    role="tabpanel"
                                >
                                    <div className="d-flex mb-4">
                                        <div className="card-title fs-16 fw-600">Total Revenue</div>
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
                                                        Year of 2022
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" className="dropdown-item">
                                                        Year of 2021
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" className="dropdown-item">
                                                        Year of 2020
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" className="dropdown-item">
                                                        Year of 2019
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" className="dropdown-item">
                                                        Year of 2018
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div id="Revenue" style={{ width: '100%' }}></div>
                                    <div className="pt-4 border-top">
                                        <div className="row">
                                            <div className="col text-center">
                                                <h6 className="fs-14 mb-1">Revenue (YTD)</h6>
                                                <div className="fs-20 fw-700">4,562</div>
                                            </div>
                                            <div className="col text-center">
                                                <h6 className="fs-14 mb-1">Subscribed Accounts (YTD)</h6>
                                                <div className="fs-20 fw-700">4,562</div>
                                            </div>
                                            <div className="col text-center">
                                                <h6 className="fs-14 mb-1">Unsubscribed Accounts (YTD)</h6>
                                                <div className="fs-20 fw-700">4,562</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 col-xl-6">
                    <div className="card mb-4 lt-star-review-card border">
                        <div className="row no-gutters">
                            <CompanyRating selectedYear={selectedYear} />
                            <CandidateRating selectedYear={selectedYear} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
