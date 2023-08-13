import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AuthSocial from './social';
import RegChoice from './reg-choice';
import ManagerForm from './manager-form';
import CandidateForm from './candidate-form';

type Props = {
    candidateId?: string;
    managerId?: string;
};

const AuthModal: React.FC<Props> = ({ candidateId, managerId }) => {
    const [activeTab, setActiveTab] = useState('auth-social');
    const [rerenderKey, setRerenderKey] = useState(0);

    const tabs = useMemo(
        () => [
            {
                key: 'auth-social',
                component: (
                    <AuthSocial
                        key={rerenderKey}
                        goToRegistration={() => {
                            if (candidateId) {
                                setActiveTab('candidates-form');
                            } else if (managerId) {
                                setActiveTab('manager-form');
                            } else {
                                setActiveTab('reg-choice');
                            }
                        }}
                    />
                ),
            },
            {
                key: 'reg-choice',
                component: <RegChoice handleSelect={(key: string) => setActiveTab(key)} />,
            },
            {
                key: 'manager-form',
                component: <ManagerForm managerId={managerId} />,
            },
            {
                key: 'candidates-form',
                component: <CandidateForm candidateId={candidateId} />,
            },
        ],
        [candidateId, managerId, rerenderKey]
    );

    const modalShow = useCallback(() => {
        const button = document.querySelector('[data-bs-target="#SignInSignUp"]') as HTMLAnchorElement;
        button?.click();
    }, []);

    useEffect(() => {
        if (!candidateId && !managerId) return;
        document.addEventListener('DOMContentLoaded', modalShow);
    }, [modalShow, candidateId, managerId]);

    return (
        <div
            className="modal fade"
            id="SignInSignUp"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby="SignInSignUpLabel"
            aria-hidden="true"
        >
            <div
                className={`modal-dialog modal-dialog-centered ${
                    activeTab === 'auth-social' || activeTab === 'reg-choice' ? 'modal-xl' : 'modal-lg'
                }`}
            >
                <div className="modal-content">
                    <div className="lt-modal-header lt-modal-login-header">
                        <button
                            type="button"
                            data-close
                            className="btn-close login-close"
                            data-bs-dismiss="modal"
                            title="Close"
                            aria-label="Close"
                            onClick={() => {
                                setActiveTab('auth-social');
                                setRerenderKey(Date.now());
                            }}
                        />
                    </div>
                    {tabs.find((item) => item.key === activeTab)?.component}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
