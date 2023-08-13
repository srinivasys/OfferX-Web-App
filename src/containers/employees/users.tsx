import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { employeeService } from '../../lib/api/employee';
import { EmployeeJoinStatusEnum, EmployeeType } from '../../types/employee';
import { getJoinStatusText, getPermissionText } from '../../lib/utils/dictionary';
import Table from '../../components/table';
import DeleteEmployee from './modals/delete';
import { ManagerPermissionEnum } from '../../types/auth';
import PageLoader from '../../components/loader';
// import imgNoResult from '../../assets/icons/offer-no-result.svg';
import CreateUserInvitation from './modals/create-user';

const Users = () => {
    const [data, setData] = useState<EmployeeType[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingResend, setLoadingResend] = useState('');
    const [activeEmployee, setActiveEmployee] = useState<EmployeeType | null>(null);

    async function resend(id: string) {
        try {
            setLoadingResend(id);
            await employeeService.resend(id);
            toast.success('Invitation resent successfully');
        } catch (err) {
            
        } finally {
            setLoadingResend('');
        }
    }

    const onInviteUserComplete = () => {};

    const columns = useMemo(
        () => [
            {
                dataIndex: 'fullName',
                title: 'Employee name',
                render: (item: any) => (
                    <div className="text-nowrap text-ellipsis text-capitalize" title={item.fullName}>
                        {item.fullName}
                    </div>
                ),
            },
            {
                dataIndex: 'email',
                title: 'Email',
                width: '260px',
                render: (item: any) => (
                    <div className="text-nowrap text-ellipsis" title={item.email}>
                        {item.email}
                    </div>
                ),
            },
            {
                dataIndex: 'permissionTypeList',
                title: 'Role',
                width: '160px',
                inputFilter: (value: any) => {
                    return value
                        .map((permissionItem: ManagerPermissionEnum) => getPermissionText(permissionItem))
                        .join(', ');
                },
                render: (item: any) =>
                    item.permissionTypeList
                        .map((permissionItem: ManagerPermissionEnum) => getPermissionText(permissionItem))
                        .join(', '),
            },
            {
                dataIndex: 'dateAdded',
                title: 'Date added',
                width: '128px',
                inputFilter: (value: any) => {
                    return new Date(value).toLocaleString('en-in', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    });
                },
                render: (item: any) =>
                    new Date(item.dateAdded).toLocaleString('en-in', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    }),
            },
            {
                dataIndex: 'joinStatus',
                title: 'Status',
                width: '128px',
                inputFilter: (value: any) => {
                    return getJoinStatusText(value);
                },
                render: (item: any) => (
                    <span style={{ color: `${getStatusColor(item.joinStatus)}` }}>
                        {getJoinStatusText(item.joinStatus)}
                    </span>
                ),
            },
            {
                dataIndex: '',
                title: 'Actions',
                width: '136px',
                render: (item: any) => (
                    <div className="lt-action-btn-holder">
                        <div className="lt-action-btn-child">
                            {item.joinStatus === EmployeeJoinStatusEnum.pending && (
                                <span
                                    onClick={() => resend(item.id)}
                                    className={`lt-action-btn ${loadingResend ? 'table-btn-disabled' : ''}`}
                                    title="Resend"
                                >
                                    {loadingResend === item.id ? (
                                        <span className="spinner-border spinner-border-sm lt-text-primary-alt ms-1" />
                                    ) : (
                                        <i className="bi bi-arrow-clockwise" />
                                    )}
                                </span>
                            )}
                        </div>
                        {(item.joinStatus === EmployeeJoinStatusEnum.pending ||
                            item.joinStatus === EmployeeJoinStatusEnum.joined) && (
                            <>
                                <div className="lt-action-btn-child">
                                    <span
                                        onClick={() => setActiveEmployee(item)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#AddEmployee"
                                        className="lt-action-btn"
                                        title="Edit"
                                    >
                                        <i className="bi bi-pencil text-success" />
                                    </span>
                                </div>
                                <div className="lt-action-btn-child">
                                    <span
                                        onClick={() => setActiveEmployee(item)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteOffer"
                                        className="lt-action-btn lt-del"
                                        title="Delete"
                                    >
                                        <i className="bi bi-trash text-danger" />
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                ),
            },
        ],
        [loadingResend]
    );

    const getList = useCallback(async () => {
        try {
            !loading && setLoading(true);
            const {
                resultObject: { items },
            } = await employeeService.getList();
            var mapItems = items.map((item) => ({
                ...item,
                fullName: `${item.firstName} ${item.middleName} ${item.lastName}`,
            }));
            mapItems = mapItems.filter((ui) => ui.joinStatus == EmployeeJoinStatusEnum.joined);
            setData(mapItems);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }, [loading]);

    useEffect(() => {
        (async function () {
            await getList();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="company-page-contener">
                {loading ? (
                    <PageLoader />
                ) : (
                    <>
                        <div className="card py-0 px-0 lt-usermanagement-table">
                            <Table columns={columns} data={data} />
                        </div>
                    </>
                )}
                <CreateUserInvitation id="AddEmployee" activeEmployee={activeEmployee} getList={getList} />
                <DeleteEmployee activeEmployee={activeEmployee} getList={getList} />
            </div>
        </>
    );
};

export default Users;

const getStatusColor = (value: EmployeeJoinStatusEnum) => {
    switch (value) {
        case EmployeeJoinStatusEnum.pending:
            return '#AE8701';
        case EmployeeJoinStatusEnum.joined:
            return '#107C10';
        case EmployeeJoinStatusEnum.deleted:
            return '#D83B01';
        default:
            return '';
    }
};
