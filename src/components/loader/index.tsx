import React from 'react';

type Props = {
    text?: string;
};

const PageLoader: React.FC<Props> = ({ text }) => {
    return (
        <div className="d-flex justify-content-center m-5">
            <div className="align-self-center text-center">
                <div className="spinner-border text-primary d-inline-block" />
                <p>{text || 'Loading'}</p>
            </div>
        </div>
    );
};

export default PageLoader;
