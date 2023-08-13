import React from 'react';
import { ProgressBar } from 'react-bootstrap';

type Props = {
    count: number;
    stars5Percentage?: number;
    stars5Count?: number;
};

const StartReviewRating: React.FC<Props> = ({ count, stars5Count, stars5Percentage }) => {
    const starCount = () => {
        let rows = [];
        for (let i = 1; i <= count; i++) {
            rows.push(<i className="bi bi-star-fill lt-text-yellow" key={i} />);
        }
        return rows;
    };

    return (
        <>
            <div className="mb-3">
                <div className="d-flex align-items-end my-1">
                    <div className="d-flex align-items-center">
                        <div className="fs-16 fw-700 me-1">{Math.round(Number(stars5Percentage))}%</div>
                        {stars5Count == 1 ? <div className="fs-12 text-muted">({stars5Count} Review)</div> : <div className="fs-12 text-muted">({stars5Count} Reviews)</div>}
                        
                    </div>
                    <div className="ms-auto fw-700">{starCount()}</div>
                </div>
                {/* <div>
                    <ProgressBar now={stars5Percentage} />
                </div> */}
            </div>
        </>
    );
};

export default StartReviewRating;
