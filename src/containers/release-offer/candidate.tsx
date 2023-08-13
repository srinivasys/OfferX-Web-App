import React from 'react';
import queryString from 'query-string';
import CandidateSelect from '../../components/user-select/candidate';
import { CandidateListType } from '../../types/candidate';
import history from '../../history';
import { ReleaseOfferReviewsType } from './index';
import searchcandidate from '../../assets/img/search-candidate.png';

type Props = {
    candidate?: CandidateListType | null;
    setCandidate: (options: CandidateListType) => void;
    goNext: () => void;
    candidateReviews: ReleaseOfferReviewsType | null;
    disabledSelect: boolean;
};

const ReleaseOfferCandidate: React.FC<Props> = ({ candidate, setCandidate, goNext, disabledSelect }) => {
    const btnControls = (
        <button type="button" onClick={goNext} className="btn btn-primary" disabled={!candidate}>
            Next
        </button>
    );

    return (
        <>
            {/* <div className="release-offer-controls">
                <div className="d-flex align-items-center justify-content-end">
                   
                    {btnControls}
                </div>
            </div> */}
            {/* <div className="release-offer-controls-bottom">
                <div className="d-flex align-items-center justify-content-end">{btnControls}</div>
            </div> */}
            {/* <h1 className="fw-700 fs-18 mb-4">Search candidate</h1> */}
            <div className="mb-3">
                <div className="hide-recent-items">
                    <CandidateSelect
                        value={
                            candidate
                                ? {
                                      ...candidate,
                                      value: candidate.id,
                                  }
                                : null
                        }
                        onChange={(option) => {
                            const selectOption = option as CandidateListType;

                            history.replace({
                                search: queryString.stringify(selectOption ? { candidate: selectOption.id } : {}),
                            });
                            setCandidate(selectOption);
                            if (selectOption) {
                                goNext();
                            }
                        }}
                        disabled={disabledSelect}
                        candidateSearch={true}
                    />
                </div>
            </div>
            <div className="offer-container">
                <img src={searchcandidate} alt="Select candidate placeholder" />
                <div className="ox-search-candi-text">
                    <div className="fs-14 fw-400">Select candidate to go to next step</div>
                </div>
            </div>
        </>
    );
};

export default ReleaseOfferCandidate;
