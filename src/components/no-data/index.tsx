import React from 'react';

type Props = {
    icon: string;
    title?: string;
    text: string;
    style: React.CSSProperties;
};

const Nodata: React.FC<Props> = ({ icon, title, text, style }) => {
    return (
        <>
            <div style={style} className="notifiy-li d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <i className={`bi ${icon} fs-68 lt-text-disabled me-0`}></i>
                    {title && <h2 className="fs-18 fw-700 lt-text-secondary">{title}</h2>}
                    <p className="lt-text-disabled">{text}</p>
                </div>
            </div>
        </>
    );
};

export default Nodata;
