import { ApexOptions } from 'apexcharts';
import React from 'react';
import { Rating } from 'react-simple-star-rating';
import { getAvgReviewValue, reducer } from '../utils/getReviews';

const Options: ApexOptions = {
    chart: {
        type: 'radialBar',
    },
    plotOptions: {
        radialBar: {
            hollow: {
                size: '70%',
            },
            dataLabels: {
                value: {
                    show: false,
                },
            },
        },
    },
    labels: [''],
    colors: ['#2BC04C'],
};

type Props = {
    title: string;
    reviewList?: any;
    ReviewTypeEnum: number;
};

const ReviewChart: React.FC<Props> = ({ title, reviewList, ReviewTypeEnum }) => {
    let reviewsCount = reviewList?.filter((x: any) => x.reviewType === ReviewTypeEnum).length;

    return (
        <div className="mb-3">
            <p className="fs-12 fw-600 mb-1">{title}</p>
            {reviewList?.length > 0 ? (
                <div className="d-flex align-items-center mb-3">
                    {getAvgReviewValue(reviewList, ReviewTypeEnum)! ? (
                        <div className="lt-text-primary-alt fs-18 fw-600 me-1 ox-review-value">
                            {Number(
                                (Math.round(Number(getAvgReviewValue(reviewList, ReviewTypeEnum)) * 100) / 100).toFixed(
                                    1
                                )
                            )}
                        </div>
                    ) : (
                        <span className="fs-12 fw-400 me-1">No Review</span>
                    )}
                    <Rating
                        size={14}
                        allowFraction={true}
                        fillColor="#4EB6FF"
                        readonly={true}
                        allowTitleTag={false}
                        initialValue={Number(
                            (Math.round(Number(getAvgReviewValue(reviewList, ReviewTypeEnum)) * 100) / 100).toFixed(1)
                        )}
                        transition={true}
                        emptyColor="transparent"
                        SVGstrokeColor="#4EB6FF"
                        SVGstorkeWidth="1"
                    />
                    <div className="fs-10 ms-1 mt-1">
                        {reviewsCount} {reviewsCount == 1 ? 'review' : 'reviews'}
                    </div>
                </div>
            ) : (
                <span className="fs-12 fw-400 me-1">No reviews</span>
            )}
        </div>
    );
};

export default ReviewChart;
