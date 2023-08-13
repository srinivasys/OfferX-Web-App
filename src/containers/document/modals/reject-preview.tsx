import React from 'react';
import DocumentContent from '../inner-content';

type Props = {
    id: string;
};

const RejectPreview: React.FC<Props> = ({ id }) => {
    return (
        <div
            className="modal fade"
            id="RejectPreview"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content lt-modal-content">
                    <div className="modal-header lt-modal-header">
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            title="Close"
                        />
                    </div>
                    <div className="modal-body lt-modal-body reject-preview">{id && <DocumentContent id={id} modal />}</div>
                </div>
            </div>
        </div>
    );
};

export default RejectPreview;
