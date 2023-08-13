import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const TodayReviewScore = () => {
    const CandidatesSeriesArray = [70];
    const CandidatesOptions: ApexOptions = {
        chart: {
            height: 180,
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                hollow: {
                    size: '50%',
                },
                track: {
                    show: true,
                    startAngle: undefined,
                    endAngle: undefined,
                    background: 'rgba(0, 150, 255, 0.2)',
                    strokeWidth: '100%',
                    opacity: 1,
                    margin: 5,
                },
                dataLabels: {
                    name: {
                        show: false,
                        fontSize: '16px',
                        fontWeight: '500',
                        color: undefined,
                        offsetY: 20,
                    },
                    value: {
                        offsetY: 8,
                        fontSize: '16px',
                        fontWeight: '700',
                        color: undefined,
                        formatter: function (val) {
                            return val + '%';
                        },
                    },
                },
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                shadeIntensity: 0.1,
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 65, 91],
            },
        },
        stroke: {
            dashArray: 4,
        },
        labels: ['Candidate Review Score'],
        colors: ['#0096ff'],
    };

    return (
        <div className="col-md-6 col-lg-6 col-xl-3 col-xxl-3">
            <div className="p-4 card mb-4 grayscale">
                <div className="block-element">
                    <span>Coming Soon</span>
                </div>
                <div className="d-flex mb-4">
                    <div className="card-title fs-16 fw-600">Today Review Score</div>
                    <div className="dropdown lt-dropdown-menu ms-auto">
                        <button
                            className="dropdown-toggle p-0"
                            id="MoreOption"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="bi bi-three-dots-vertical" />
                        </button>
                        <ul className="dropdown-menu lt-shadow-tin py-0" aria-labelledby="MoreOption">
                            <li className="dropdown-item">Year of 2022</li>
                            <li className="dropdown-item">Year of 2021</li>
                            <li className="dropdown-item">Year of 2020</li>
                            <li className="dropdown-item">Year of 2019</li>
                            <li className="dropdown-item">Year of 2018</li>
                        </ul>
                    </div>
                </div>
                <div className="border-bottom">
                    <div className="d-flex align-items-center">
                        <div>
                            <h6 className="fs-14 mb-1 fw-600">Candidates</h6>
                            <div className="fs-20 fw-700">4,562</div>
                            <div className="lt-score-review-text">
                                <span className="lt-text-success fw-600">
                                    <i className="bi bi-caret-up-fill" /> 2.5%
                                </span>
                                than last year
                            </div>
                        </div>
                        <div className="w-160 ms-auto text-end">
                            <ReactApexChart
                                options={CandidatesOptions}
                                series={CandidatesSeriesArray}
                                type="radialBar"
                                height={180}
                            />
                        </div>
                    </div>
                </div>
                <div className="border-bottom">
                    <div className="d-flex align-items-center">
                        <div>
                            <h6 className="fs-14 mb-1 fw-600">Employers</h6>
                            <div className="fs-20 fw-700">4,562</div>
                            <div className="lt-score-review-text">
                                <span className="lt-text-success fw-600">
                                    <i className="bi bi-caret-up-fill" /> 2.5%
                                </span>
                                than last year
                            </div>
                        </div>
                        <div className="w-160 ms-auto text-end">
                            <ReactApexChart
                                options={CandidatesOptions}
                                series={CandidatesSeriesArray}
                                type="radialBar"
                                height={180}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="d-flex align-items-center">
                        <div>
                            <h6 className="fs-14 mb-1 fw-600">Platform</h6>
                            <div className="fs-20 fw-700">4,562</div>
                            <div className="lt-score-review-text">
                                <span className="lt-text-success fw-600">
                                    <i className="bi bi-caret-up-fill" /> 2.5%
                                </span>
                                than last year
                            </div>
                        </div>
                        <div className="w-160 ms-auto text-end">
                            <ReactApexChart
                                options={CandidatesOptions}
                                series={CandidatesSeriesArray}
                                type="radialBar"
                                height={180}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodayReviewScore;
