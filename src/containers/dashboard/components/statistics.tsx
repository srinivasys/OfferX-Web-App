import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PageLoader from '../../../components/loader';
import { dashboardServices } from '../../../lib/api/dashboard';
import { RootState } from '../../../redux';
import { getAllOffersCountType } from '../../../types/dashboard';
import expiredFileIcon from "../../../assets/img/file-earmark-expired.svg";

type Props = {
    selectedYear: number;
};

const Statistics: React.FC<Props> = ({ selectedYear }) => {
    const { loading, user } = useSelector((state: RootState) => state.user);
    const [data, setData] = useState<getAllOffersCountType>();
    const [graphLoading, setGraphLoading] = useState<boolean>();

    useEffect(() => {
        (async () => {
            try {
                setGraphLoading(true);
                const { resultObject } = await dashboardServices.getAllOffersCount(
                    String(user?.companyId),
                    selectedYear
                );
                setData(resultObject);
            } catch (error) {
            } finally {
                setGraphLoading(false);
            }
        })();
    }, [selectedYear]);

    return (
        <>
            {' '}
            <div className="row mt-4 row-deck">
                {loading || graphLoading ? (
                    <PageLoader />
                ) : (
                    <>
                        {' '}
                        <div className="col-xl-3 col-lg-6 col-md-6">
                            <div className="card p-3 mb-4 lt-shape-card border-1">
                                <div className="fw-600 fs-14">
                                    <span className="lt-dashboard-text">Total released</span>{' '}
                                    <i className="bi bi-info-circle lt-tooltip">
                                        <span className="lt-tooltiptext lt-shadow-md fw-400 fs-14 bottom-tip">
                                            Total number of offers released till date
                                        </span>
                                    </i>{' '}
                                    <span className="float-end fs-32 lt-dashboard-icon">
                                        <i className="lt-dashboard-text bi bi-file-earmark-text m-0"></i>
                                    </span>
                                </div>
                                <div className="fw-600 fs-42 lt-text-link-primary my-2">
                                    {data?.totalOffersReleased}
                                </div>
                                <div className="fs-12">
                                    <span
                                        className={
                                            getColorStatus(Number(data?.offersReleasedGrowth))
                                                ? 'lt-text-success fw-600'
                                                : 'lt-text-error fw-600'
                                        }
                                    >
                                        <i
                                            className={
                                                getColorStatus(Number(data?.offersReleasedGrowth))
                                                    ? 'bi bi-caret-up-fill'
                                                    : 'bi bi-caret-down-fill'
                                            }
                                        />{' '}
                                        {Math.round(Number(data?.offersReleasedGrowth))}%
                                    </span>
                                    <span className="ms-1"> than last month</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-6">
                            <div className="card p-3 mb-4 lt-shape-card border-1">
                                <div className="fw-600 fs-14">
                                    <span className="lt-dashboard-text">Total accepted</span>{' '}
                                    <i className="bi bi-info-circle lt-tooltip">
                                        <span className="lt-tooltiptext lt-shadow-md fw-400 fs-14 bottom-tip">
                                            Total number of offers accepted till date
                                        </span>
                                    </i>{' '}
                                    <span className="float-end fs-32 lt-dashboard-icon">
                                        <i className="lt-dashboard-text bi bi-file-earmark-check m-0"></i>
                                    </span>
                                </div>
                                <div className="fw-600 fs-42 lt-text-link-primary my-2">
                                    {data?.totalOffersAccepted}
                                </div>
                                <div className="fs-12">
                                    <span
                                        className={
                                            getColorStatus(Number(data?.offersAcceptedGrowth))
                                                ? 'lt-text-success fw-600'
                                                : 'lt-text-error fw-600'
                                        }
                                    >
                                        <i
                                            className={
                                                getColorStatus(Number(data?.offersAcceptedGrowth))
                                                    ? 'bi bi-caret-up-fill'
                                                    : 'bi bi-caret-down-fill'
                                            }
                                        />{' '}
                                        {Math.round(Number(data?.offersAcceptedGrowth))}%
                                    </span>{' '}
                                    <span className="ms-1"> than last month</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-6">
                            <div className="card p-3 mb-4 lt-shape-card border-1">
                                <div className="fw-600 fs-14">
                                    <span className="lt-dashboard-text">Total declined</span>{' '}
                                    <i className="bi bi-info-circle lt-tooltip">
                                        <span className="lt-tooltiptext lt-shadow-md fw-400 fs-14 bottom-tip">
                                            Total number of offers declined till date
                                        </span>
                                    </i>{' '}
                                    <span className="float-end fs-32 lt-dashboard-icon">
                                        <i className="lt-dashboard-text bi bi-file-earmark-x m-0"></i>
                                    </span>
                                </div>
                                <div className="fw-600 fs-42 lt-text-link-primary my-2">
                                    {data?.totalOffersRejected}
                                </div>
                                <div className="fs-12">
                                    <span
                                        className={
                                            getColorStatus(Number(data?.offersRejectedGrowth))
                                                ? 'lt-text-success fw-600'
                                                : 'lt-text-error fw-600'
                                        }
                                    >
                                        <i
                                            className={
                                                getColorStatus(Number(data?.offersRejectedGrowth))
                                                    ? 'bi bi-caret-up-fill'
                                                    : 'bi bi-caret-down-fill'
                                            }
                                        />{' '}
                                        {Math.round(Number(data?.offersRejectedGrowth))}%
                                    </span>{' '}
                                    <span className="ms-1"> than last month</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-6">
                            <div className="card p-3 mb-4 lt-shape-card border-1">
                                <div className="fw-600 fs-14">
                                    <span className="lt-dashboard-text">Total expired</span>{' '}
                                    <i className="bi bi-info-circle lt-tooltip">
                                        <span className="lt-tooltiptext lt-shadow-md fw-400 fs-14">
                                            Total number of offers expired till date
                                        </span>
                                    </i>{' '}
                                    <span className="float-end fs-32 lt-dashboard-icon">
                                        <img src={expiredFileIcon} width={28} className='expired-icon-mt' />
                                    </span>
                                </div>
                                <div className="fw-600 fs-42 lt-text-link-primary my-2">{data?.totalOffersExpired}</div>
                                <div className="fs-12">
                                    <span
                                        className={
                                            getColorStatus(Number(data?.offersExpiredGrowth))
                                                ? 'lt-text-success fw-600'
                                                : 'lt-text-error fw-600'
                                        }
                                    >
                                        <i
                                            className={
                                                getColorStatus(Number(data?.offersExpiredGrowth))
                                                    ? 'bi bi-caret-up-fill'
                                                    : 'bi bi-caret-down-fill'
                                            }
                                        />{' '}
                                        {Math.round(Number(data?.offersExpiredGrowth))}%
                                    </span>{' '}
                                    <span className="ms-1"> than last month</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Statistics;

export const getColorStatus = (companyCountType: number) => companyCountType >= 0;
