import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import ProgressBar from 'react-bootstrap/ProgressBar';
import YearsDropdown from '../../../components/dropdown';
import { dashboardServices } from '../../../lib/api/dashboard';
import { RootState } from '../../../redux';
import { getCompanyRatingsType } from '../../../types/dashboard';
import ReactApexChart from 'react-apexcharts';
import { Options } from '../utils/candidate-company-options';
import PageLoader from '../../../components/loader';
import StartReviewRating from '../utils/star-review-rating';
import Nodata from '../../../components/no-data';

type Props = {
    selectedYear: number;
};

const CompanyRating: React.FC<Props> = ({ selectedYear }) => {
    const { loading, user } = useSelector((state: RootState) => state.user);
    const [graphLoading, setGraphLoading] = useState<boolean>();
    const [data, setData] = useState<getCompanyRatingsType>();
    const [dropdownYear, setDropdownYear] = useState<number>(selectedYear);
    const [seriesArray, setSeriesArray] = useState<number[]>([]);

    useMemo(() => {
        setDropdownYear(selectedYear);
    }, [selectedYear]);

    useEffect(() => {
        (async () => {
            try {
                setGraphLoading(true);
                const { resultObject } = await dashboardServices.getCompanyRatings(user?.companyId || '', dropdownYear);
                const value = resultObject;
                setData(resultObject);
                const complianceCount = value.companyComplianceViolationCounts.complianceCount;
                const violationCount = value.companyComplianceViolationCounts.violationCount;
                //if (complianceCount != 0 || violationCount != 0) 
                setSeriesArray([complianceCount, violationCount]);
            } catch (error) {
            } finally {
                setGraphLoading(false);
            }
        })();
    }, [dropdownYear]);

    return (
        <>
            <div className="col-md-6">
                <div className="p-4 pe-3 label-alignment">
                    <div className="d-flex justify-content-between mb-3">
                        <div className="card-title fs-16 fw-600">
                            Company ratings{' '}
                            <i className="bi bi-info-circle lt-tooltip">
                                <span className="lt-tooltiptext lt-shadow-md fw-400 fs-14 bottom-tip">
                                    Ratings given by candidates to company{' '}
                                </span>
                            </i>
                        </div>
                        <YearsDropdown setDropdownYear={setDropdownYear} />
                    </div>
                    {loading || graphLoading ? (
                        <PageLoader />
                    ) : (
                        <>
                            {seriesArray[0]  == 0 && seriesArray[1] ==0 ? (
                               
                                <Nodata
                                    title="No data"
                                    text="Please check again in future"
                                    icon="bi-graph-up"
                                    style={{ height: 215 }}
                                />
                            ) : (
                                <ReactApexChart options={Options} series={seriesArray} type="donut" height={250} />
                            )}
                            <StartReviewRating
                                stars5Count={Number(data?.companyStarRatingCounts.stars5Count)}
                                stars5Percentage={Math.round(Number(data?.companyStarRatingCounts.stars5Percentage))}
                                count={5}
                            />
                            <StartReviewRating
                                stars5Count={Number(data?.companyStarRatingCounts.stars4Count)}
                                stars5Percentage={Math.round(Number(data?.companyStarRatingCounts.stars4Percentage))}
                                count={4}
                            />
                            <StartReviewRating
                                stars5Count={Number(data?.companyStarRatingCounts.stars3Count)}
                                stars5Percentage={Math.round(Number(data?.companyStarRatingCounts.stars3Percentage))}
                                count={3}
                            />
                            <StartReviewRating
                                stars5Count={Number(data?.companyStarRatingCounts.stars2Count)}
                                stars5Percentage={Math.round(Number(data?.companyStarRatingCounts.stars2Percentage))}
                                count={2}
                            />
                            <StartReviewRating
                                stars5Count={Number(data?.companyStarRatingCounts.stars1Count)}
                                stars5Percentage={Math.round(Number(data?.companyStarRatingCounts.stars1Percentage))}
                                count={1}
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CompanyRating;
