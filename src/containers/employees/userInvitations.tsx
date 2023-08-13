import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { employeeService } from '../../lib/api/employee';
import { EmployeeJoinStatusEnum, EmployeeType } from '../../types/employee';
import { getJoinStatusText, getPermissionText } from '../../lib/utils/dictionary';
import Table from '../../components/table';
import { ManagerPermissionEnum } from '../../types/auth';
import PageLoader from '../../components/loader';
import imgNoResult from '../../assets/icons/offer-no-result.svg';

type Props = {
    isUserInvitedSucces: boolean;
};

const UserInvitations: React.FC<Props> = ({ isUserInvitedSucces }) => {
    const [data, setData] = useState<EmployeeType[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingResend, setLoadingResend] = useState('');
    const [loadingResendStatus, setLoadingResendStatus] = useState<'loading' | 'success' | 'error' | null>(null);
    const [activeResendId, setActiveResendId] = useState('');

    useEffect(() => {
        if (isUserInvitedSucces) {
            isUserInvitedSucces = false;
            getList();
        }

    }, [isUserInvitedSucces])


    async function resend(id: string) {
        try {
            setLoadingResend(activeResendId);
            await employeeService.resend(id);
            toast.success('Invitation resent successfully');
        } catch (err) {
            
        } finally {
            setLoadingResend('');
        }
    }

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
                title: 'Date invited',
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
                render: (item: any) =>
                    item.joinStatus === EmployeeJoinStatusEnum.pending && (
                        <div className="d-flex justify-content-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveResendId(item.id);
                                }}
                                className="btn-link"
                            >
                                {loadingResendStatus === 'error' && activeResendId === item.id && (
                                    <span className="google-icon">
                                        <i className="bi bi-x-circle text-danger" />
                                    </span>
                                )}
                                {loadingResendStatus === 'loading' && activeResendId === item.id && (
                                    <div className='new-spinner p-fixed'><div><span className="spinner-border spinner-border-sm custom-spinner-border" /></div><p className='fs-14 custom-loading-text'>Loading</p></div>
                                )}
                                Resend
                            </button>
                        </div>
                    ),
            },
        ],
        [loadingResendStatus, activeResendId]
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
            mapItems = mapItems.filter(ui => ui.joinStatus != EmployeeJoinStatusEnum.joined);
            setData(mapItems);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }, [loading]);

    useEffect(() => {
        if (!activeResendId) return;
        (async function () {
            try {
                setLoadingResendStatus('loading');
                await employeeService.resend(activeResendId);
                toast.success('Invitation resent successfully');
                setLoadingResendStatus('success');
            } catch (err) {
                
                setLoadingResendStatus('error');
            }
        })();
    }, [activeResendId]);
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
                        <Table columns={columns} data={data} />
                    </>
                )}
            </div>
        </>
    );
};

export default UserInvitations;

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
