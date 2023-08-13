import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PageLoader from '../../components/loader';
import Table from '../../components/table';
import { invitationsService } from '../../lib/api/invitations';
import { InviteStatusEnum, InviteType } from '../../types/invitations';
import { getInviteStatusText } from '../../lib/utils/dictionary';
import CreateInvite from './modals/create-candidate';
import imgNoResult from '../../assets/icons/offer-no-result.svg';
import { toast } from 'react-toastify';
import { Messages } from '../../lib/utils/messages';

const CandidateInvitations = () => {
    const [data, setData] = useState<InviteType[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingResendStatus, setLoadingResendStatus] = useState<'loading' | 'success' | 'error' | null>(null);
    const [activeResendId, setActiveResendId] = useState('');

    const columns = useMemo(
        () => [
            {
                dataIndex: 'fullName',
                title: 'Candidate name',
                render: (item: any) => (
                    <div className="text-nowrap text-ellipsis text-capitalize" title={item.fullName}>
                        {item.fullName}
                    </div>
                ),
            },
            {
                dataIndex: 'email',
                title: 'Email',
                render: (item: any) => (
                    <div className="text-nowrap text-ellipsis" title={item.email}>
                        {item.email}
                    </div>
                ),
            },
            {
                dataIndex: 'invitedDate',
                title: 'Date invited',
                inputFilter: (value: any) => {
                    return new Date(value).toLocaleString('en-in', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    });
                },
                render: (item: any) =>
                    new Date(item.invitedDate).toLocaleString('en-in', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    }),
            },
            {
                dataIndex: 'inviteStatus',
                title: 'Status',
                inputFilter: (value: any) => {
                    return getInviteStatusText(value);
                },
                render: (item: any) => (
                    <span style={{ color: `${getStatusColor(item.inviteStatus)}` }}>
                        {getInviteStatusText(item.inviteStatus)}
                    </span>
                ),
            },
            {
                dataIndex: '',
                title: 'Actions',
                width: '120px',
                render: (item: any) =>
                    item.inviteStatus === InviteStatusEnum.invited && (
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
            } = await invitationsService.getList();
            const mapItems = items.map((item) => ({
                ...item,
                fullName: `${item.firstName} ${item.middleName && item.middleName + ' '}${item.lastName}`,
            }));
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
                await invitationsService.resend(activeResendId);
                toast.success(Messages.InvitationResend);
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
                <div className="d-flex my-4 align-items-center">
                    <div className="flex-grow-1 text-start">
                        <h1 className="fw-700 fs-20 page-header-title mb-0 lt-text-secondary">
                            Candidate invitations
                        </h1>
                        <label className="fw-400 fs-14">Invitations expire after 30 days</label>
                    </div>
                    <div className="flex-shrink-1 text-sm-end">
                        <button
                            className="btn btn-primary"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#AddInvitePage"
                        >
                            Invite a candidate
                        </button>
                    </div>
                </div>

                {loading ? (
                    <PageLoader />
                ) : (
                    <>
                        <div className="card lt-invitation-table">
                            <Table columns={columns} data={data} />
                        </div>
                    </>
                )}

                <CreateInvite id="AddInvitePage" getList={getList} />
            </div>
        </>
    );
};

export default CandidateInvitations;

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
