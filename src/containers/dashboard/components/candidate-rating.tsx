import { ApexOptions } from 'apexcharts';
import React, { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useSelector } from 'react-redux';
import YearsDropdown from '../../../components/dropdown';
import PageLoader from '../../../components/loader';
import Nodata from '../../../components/no-data';
import { dashboardServices } from '../../../lib/api/dashboard';
import { RootState } from '../../../redux';
import { getCandidateRatingsType } from '../../../types/dashboard';
import { CandidateOptions } from '../utils/candidate-company-options';
import { percentage } from '../utils/percentage';
import StartReviewRating from '../utils/star-review-rating';

type Props = {
    selectedYear: number;
};

const CandidateRating: React.FC<Props> = ({ selectedYear }) => {
    const { loading, user } = useSelector((state: RootState) => state.user);
    const [graphLoading, setGraphLoading] = useState<boolean>();
    const [data, setData] = useState<getCandidateRatingsType>();
    const [dropdownYear, setDropdownYear] = useState<number>(selectedYear);
    const [seriesArray, setSeriesArray] = useState<number[]>([]);

    useMemo(() => {
        setDropdownYear(selectedYear);
    }, [selectedYear]);

    useEffect(() => {
        (async () => {
            try {
                setGraphLoading(true);
                const { resultObject } = await dashboardServices.getCandidateRatings(
                    user?.companyId || '',
                    dropdownYear
                );
                const value = resultObject;
                setData(resultObject);
                const complianceCount = value.candidateComplianceViolationCounts.complianceCount;
                const violationCount = value.candidateComplianceViolationCounts.violationCount;
                //if (complianceCount != 0 || violationCount != 0) 
                setSeriesArray([complianceCount, violationCount]);
            } catch (error) {
            } finally {
                setGraphLoading(false);
            }
        })();
    }, [dropdownYear]);

    return (
        <div className="col-md-6 border-start">
            <div className="p-4 label-alignment ox-candidate-rating">
                <div className="d-flex justify-content-between mb-3">
                    <div className="card-title fs-16 fw-600">
                        Candidate ratings{' '}
                        <i className="bi bi-info-circle lt-tooltip">
                            <span className="lt-tooltiptext lt-shadow-md fw-400 fs-14">
                                Ratings given by company to candidates
                            </span>
                        </i>
                    </div>

                    <YearsDropdown setDropdownYear={setDropdownYear} />
                </div>
                {loading || graphLoading ? (
                    <PageLoader />
                ) : (
                    <>
                        {seriesArray[0]  == 0 && seriesArray[1] ==0  ? (
                                
                                <Nodata
                                title="No data"
                                text="Please check again in future"
                                icon="bi-graph-up"
                                style={{ height: 215 }}
                            />
                        ) : (
                            <ReactApexChart options={CandidateOptions} series={seriesArray} type="donut" height={250} />
                        )}
                        <StartReviewRating
                            stars5Count={Number(data?.candidateStarRatingCounts.stars5Count)}
                            stars5Percentage={Math.round(Number(data?.candidateStarRatingCounts.stars5Percentage))}
                            count={5}
                        />
                        <StartReviewRating
                            stars5Count={Number(data?.candidateStarRatingCounts.stars4Count)}
                            stars5Percentage={Math.round(Number(data?.candidateStarRatingCounts.stars4Percentage))}
                            count={4}
                        />
                        <StartReviewRating
                            stars5Count={Number(data?.candidateStarRatingCounts.stars3Count)}
                            stars5Percentage={Math.round(Number(data?.candidateStarRatingCounts.stars3Percentage))}
                            count={3}
                        />
                        <StartReviewRating
                            stars5Count={Number(data?.candidateStarRatingCounts.stars2Count)}
                            stars5Percentage={Math.round(Number(data?.candidateStarRatingCounts.stars2Percentage))}
                            count={2}
                        />
                        <StartReviewRating
                            stars5Count={Number(data?.candidateStarRatingCounts.stars1Count)}
                            stars5Percentage={Math.round(Number(data?.candidateStarRatingCounts.stars1Percentage))}
                            count={1}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default CandidateRating;
