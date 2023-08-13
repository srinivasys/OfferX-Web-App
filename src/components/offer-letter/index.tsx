import React from 'react';
import DocumentContent from '../../containers/document/inner-content';

type Props = {
    id: string;
};

const OfferLetterView: React.FC<Props> = ({ id }) => {
    return (
        <div className="modal fade" id="offerLetterView" aria-labelledby="OfferLetterLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content lt-modal-content">
                    <div className="modal-header lt-modal-header">
                        <button
                            type="button"
                            className="btn-close"
                            title="Close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body lt-modal-body">
                        {id && <DocumentContent id={id} offerLetter={true} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfferLetterView;
