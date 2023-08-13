import { useState } from 'react';
import { EmployeeType } from '../../types/employee';
import { InviteStatusEnum } from '../../types/invitations';
import CreateUserInvitation from './modals/create-user';
import UserInvitations from './userInvitations';
import Users from './users';

const UserManagement = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'user-invitations'>('users');
    // const [activeEmployeeId, setActiveEmployeeId] = useState<EmployeeType | null | string>('');

    var isUserInvitedSucces: boolean = false;

    const onInviteUserComplete = () => {
        if (activeTab === 'user-invitations') {
            isUserInvitedSucces = true;
        } else {
            setActiveTab('user-invitations');
        }
    };

    return (
        <>
            <div className="company-page-contener">
                <div className="d-flex my-4 align-items-center">
                    <div className="flex-grow-1 text-start">
                        <h1 className="fw-700 fs-20 page-header-title mb-0 lt-text-secondary">Manage employees</h1>
                    </div>

                    <div className="flex-shrink-1 text-sm-end">
                        <button
                            className="btn btn-primary"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#AddNewEmployee"
                        >
                            Invite an employee
                        </button>
                    </div>
                </div>

                <div className="card">
                    <div>
                        <nav>
                            <div className="d-flex bd-highlight lt-nav-bar">
                                <div className="w-100 bd-highlight">
                                    <div className="nav nav-tabs nav-justified" id="nav-tab">
                                        <button
                                            className={`nav-link col-2 fs-16 ${activeTab === 'users' ? 'active' : ''}`}
                                            type="button"
                                            onClick={() => setActiveTab('users')}
                                        >
                                            Employees
                                        </button>
                                        <button
                                            className={`nav-link col-2 fs-16 ${
                                                activeTab === 'user-invitations' ? 'active' : ''
                                            }`}
                                            type="button"
                                            onClick={() => setActiveTab('user-invitations')}
                                        >
                                            Employee Invitations
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </nav>
                        {activeTab === 'users' && <Users />}
                        {activeTab === 'user-invitations' && (
                            <UserInvitations isUserInvitedSucces={isUserInvitedSucces} />
                        )}
                    </div>
                </div>
                <CreateUserInvitation id="AddNewEmployee" activeEmployee={null} onInviteUserComplete={onInviteUserComplete} />
            </div>
        </>
    );
};

export default UserManagement;

const getStatusColor = (value: InviteStatusEnum) => {
    switch (value) {
        case InviteStatusEnum.invited:
            return '#AE8701';
        case InviteStatusEnum.joined:
            return '#107C10';
        case InviteStatusEnum.deleted:
            return '#D83B01';
        default:
            return '';
    }
};
