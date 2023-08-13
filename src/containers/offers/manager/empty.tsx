import React from 'react';
import image from '../../../assets/img/frame.png';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';

const EmptyOffers = () => {
    const { user } = useSelector((state: RootState) => state.user);

    return (
        <div className="d-flex justify-content-center">
            <div className="home-frame-box">
                <div className="align-self-center text-center">
                    <img src={image} alt="" />
                    <h1 className="fw-700 fs-32">Welcome, {user?.firstName}!</h1>
                    <p>
                        Please add your first job offer using the "Release an offer" button or search for a candidate.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmptyOffers;
