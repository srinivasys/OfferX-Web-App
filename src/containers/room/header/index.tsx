import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useIdleTimer } from 'react-idle-timer';
import { Link } from 'react-router-dom';
import { routes } from '../../routes/routes-names';
import HeaderInvite from './invite';
import HeaderUser from './user';
import HeaderNotify from './notify';
import CandidateSelect from '../../../components/user-select/candidate';
import { UserRoleEnum, UserType } from '../../../types/auth';
import CompanySelect from '../../../components/user-select/company';
import { signOut } from '../../../redux/user';
import { HubConnection } from '@microsoft/signalr';
import { signalrConnect } from '../../../lib/utils/signalr';
import OfferxLogo from '../../../assets/img/offerx-logo.png';
import ApplicationFeedBackModal from '../components/AppFeedbackModal';
import AppFeedbackImg from "../../../assets/img/app-feedback.svg";

type Props = {
    user: UserType;
};

const Header: React.FC<Props> = ({ user }) => {
    const dispatch = useDispatch();
    const timeout = 900000; // 15 Minutes session timeout
    const [isIdle, setIsIdle] = useState(false);
    const handleOnActive = () => setIsIdle(false);
    const handleOnIdle = () => setIsIdle(true);
    const [signalrConnection, setSignalrConnection] = useState<HubConnection | null>(null);
    const [feedbackOpen, setFeedbackOPen] = useState<boolean>();
    const backdrop = document.querySelector('.modal-backdrop');

    useEffect(() => {
        setSignalrConnection(signalrConnect());
    }, []);

    useIdleTimer({
        timeout,
        onActive: handleOnActive,
        onIdle: handleOnIdle,
    });

    useEffect(() => {
        if (!isIdle) return;
        if (isIdle) {
            signalrConnection?.stop();
            dispatch(signOut());
            backdrop && backdrop.remove();
            document.body.style.overflow = 'scroll';
        }
    }, [isIdle]);

    const hasManager = user.role === UserRoleEnum.manager;
    const hasCandidate = user.role === UserRoleEnum.candidate;

    return user ? (
        <>
       
            <header className={`${hasCandidate ? 'candidate-header' : ''}`}>
                <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light internal-header">
                    <div className={`${hasCandidate ? 'container' : 'd-flex w-100'}`}>
                        <div className="flex-grow-1 d-flex align-items-center">
                            <Link to={routes.pendingOffers} className="navbar-brand fs-20 fw-700">
                                <img src={OfferxLogo} className="site-logo" title="OfferX" alt="OfferX Logo" />
                            </Link>
                        </div>
                        <div className="ox-search-col">
                            <a
                                className="seacrh-icon d-lg-none"
                                data-bs-toggle="collapse"
                                href="#globalSearchExample"
                                aria-expanded="false"
                                aria-controls="globalSearchExample"
                            >
                                <i className="bi bi-search"></i>
                                <span>Search</span>
                            </a>
                            <div className="collapse d-lg-none" id="globalSearchExample">
                                <div className="card p-4 border-0 shadow">
                                    <div className="input-group input-group-sm">
                                        {hasManager && <CandidateSelect header />}
                                        {hasCandidate && <CompanySelect />}
                                    </div>
                                </div>
                                <a
                                    className="global-search-background"
                                    data-bs-toggle="collapse"
                                    href="#globalSearchExample"
                                    aria-expanded="false"
                                    aria-controls="globalSearchExample"
                                >
                                    <span className="d-none">background</span>
                                </a>
                            </div>
                            <div className="input-group input-group-sm d-none d-lg-block">
                                {hasManager && <CandidateSelect header />}
                                {hasCandidate && <CompanySelect />}
                            </div>
                        </div>
                        <div>
                            <div className="navbar-collapse collapse d-sm-inline-flex flex-row-reverse">
                                <HeaderUser user={user} />
                                <HeaderNotify />
                                <button
                                    type="button"
                                    className="cursor-pointer feedback-icon"
                                    onClick={() => setFeedbackOPen(true)}
                                    data-bs-toggle="modal"
                                    data-bs-target="#appFeedback"
                                >
                                    <img src={AppFeedbackImg} width="28" className='app-feedback-img' title='Give us feedback' />
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            {feedbackOpen ? <ApplicationFeedBackModal /> : <ApplicationFeedBackModal />}
        </>
    ) : null;
};

export default Header;
