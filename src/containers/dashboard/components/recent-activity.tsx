import React from 'react';

const RecentActivity = () => {
    return (
        <div className="col-xl-3 col-lg-3 col-xxl-3 col-12">
            <div className="card p-4 mb-4 grayscale">
                <div className="block-element">
                    <span>Coming Soon..</span>
                </div>
                <div className="d-flex mb-3">
                    <div className="card-title fs-16 fw-600">Recent Activity</div>
                    <div className="dropdown lt-dropdown-menu ms-auto">
                        <div
                            className="dropdown-toggle p-0"
                            role="button"
                            id="MoreOption"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="bi bi-three-dots-vertical" />
                        </div>
                        <ul className="dropdown-menu lt-shadow-tin py-0" aria-labelledby="MoreOption" role="tablist">
                            <li className="dropdown-item">Recently Updated</li>
                            <li className="dropdown-item">Last week</li>
                            <li className="dropdown-item">Last Month</li>
                            <li className="dropdown-item">Last Year</li>
                        </ul>
                    </div>
                </div>
                <ul className="lt-time-line p-0 mb-0">
                    <li className="d-flex">
                        <div className="lt-timeline-step">
                            <div className="lt-step-number lt-bg-primary">22</div>
                        </div>
                        <div className="lt-timeline-message ms-4">
                            <div className="fs-14 fw-600">New Jobs Updated</div>
                            <p className="fs-14">It is a long established fact that a layout....</p>
                            <span className="text-muted fs-12"> 42 mins ago</span>
                        </div>
                    </li>
                    <li className="d-flex">
                        <div className="lt-timeline-step">
                            <div className="lt-step-number lt-alert-bg-warning-fill">16</div>
                        </div>
                        <div className="lt-timeline-message ms-4">
                            <div className="fs-14 fw-600">New Jobs Updated</div>
                            <p className="fs-14">It is a long established fact that a layout....</p>
                            <span className="text-muted fs-12"> 2 hours ago</span>
                        </div>
                    </li>
                    <li className="d-flex">
                        <div className="lt-timeline-step">
                            <div className="lt-step-number lt-alert-bg-error">10</div>
                        </div>
                        <div className="lt-timeline-message ms-4">
                            <div className="fs-14 fw-600">New Jobs Updated</div>
                            <p className="fs-14">It is a long established fact that a layout....</p>
                            <span className="text-muted fs-12"> 1 day ago</span>
                        </div>
                    </li>
                    <li className="d-flex">
                        <div className="lt-timeline-step">
                            <div className="lt-step-number lt-alert-bg-green">01</div>
                        </div>
                        <div className="lt-timeline-message ms-4">
                            <div className="fs-14 fw-600">New Jobs Updated</div>
                            <p className="fs-14">It is a long established fact that a layout....</p>
                            <span className="text-muted fs-12"> 22 Jul 2022, 12.31am</span>
                        </div>
                    </li>
                    <li className="d-flex d-none">
                        <div className="lt-timeline-step">
                            <div className="lt-step-number lt-alert-bg-error">22</div>
                        </div>
                        <div className="lt-timeline-message ms-4">
                            <div className="fs-14 fw-600">New Jobs Updated</div>
                            <p className="fs-14">It is a long established fact that a layout....</p>
                            <span className="text-muted fs-12"> 22 Jul 2022, 12.31am</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default RecentActivity;
