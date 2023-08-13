import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HubConnection } from '@microsoft/signalr';
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import { NotificationStateEnum, NotificationType, NotificationTypeEnum } from '../../../types/notification';
import { notificationService } from '../../../lib/api/notification';
import candidateAvatar from '../../../assets/img/avatars.svg';
import companyLogo from '../../../assets/img/logo.svg';
import { routes } from '../../routes/routes-names';
import { generateLink } from '../../../lib/utils/generate-link';
import { signalrConnect } from '../../../lib/utils/signalr';
import Nodata from '../../../components/no-data';
import { NotificationConstants } from '../../../lib/constants/constants';

const HeaderNotify = () => {
    const [signalrConnection, setSignalrConnection] = useState<HubConnection | null>(null);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const notificationsRef = useRef<NotificationType[]>([]);
    const [page, setPage] = useState<number>(1);
    const [unread, setUnread] = useState<number>();
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>();
    const history = useHistory();
    notificationsRef.current = notifications;

    async function markRead(id: string) {
        try {
            await notificationService.markRead(id);
            const readNotifications = notifications.map((item) =>
                item.notificationId === id ? { ...item, state: NotificationStateEnum.read } : item
            );
            setNotifications(readNotifications);
        } catch (err: any) {
        }
    }

    useEffect(() => {
        setSignalrConnection(signalrConnect());
    }, []);

    useEffect(() => {
        if (!signalrConnection) return;
        (async function () {
            try {
                await signalrConnection.start();
                signalrConnection.on('SendNotification', (message: NotificationType) => {
                    const updatedNotifications = [...notificationsRef.current];
                    updatedNotifications.unshift(message);
                    const uniqueNotify = Array.from(new Set(updatedNotifications));
                    setNotifications(uniqueNotify);
                });
            } catch (err) {
            }
        })();
    }, [signalrConnection]);

    useEffect(() => {
        (async function () {
            try {
                setLoading(true);
                const {
                    resultObject: { items, count },
                } = await notificationService.getList(page,NotificationConstants.DayLimit);
                setNotifications((pre) => [...pre, ...items]);
                setCount(count);
            } catch (err: any) {
            } finally {
                setLoading(false);
            }
        })();
    }, [page]);

    const onScrollChange = (event: React.UIEvent<HTMLElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
        const height = Math.round(scrollTop) + clientHeight + 2;
        if (height > scrollHeight && notifications.length <= count) {
            setPage((pre) => pre + 1);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const { resultObject } = await notificationService.getUnreadCount(NotificationConstants.DayLimit);
                setUnread(resultObject);
            } catch (error) {
            }
        })();
    }, [notifications]);

    return (
        <div className="dropdown lt-dropdown-menu px-md-2">
            <a
                href="_"
                className="btn btn-secondary dropdown-toggle"
                role="button"
                id="Notifications"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Notifications"
            >
                <i className="bi bi-bell me-0" />
                {unread !== 0 && (
                    <span className="position-absolute translate-middle badge rounded-pill bg-danger notify-badge">
                        {unread}
                    </span>
                )}
                <span className="d-none">Notifications</span>
            </a>
            <div className="dropdown-menu lt-shadow-sm lt-notify-dropdown" aria-labelledby="Notifications">
                <h1 className="fw-700 fs-16 mb-0 px-2">Notifications </h1>

                <div className="scrolls-area" onScroll={onScrollChange}>
                    {notifications.length ? (
                        notifications
                            .sort((a, b) => (a.date < b.date ? 1 : -1))
                            .map((item) => {
                                const read = item.state === NotificationStateEnum.read;
                                return (
                                    <div
                                        key={item.notificationId}
                                        role="button"
                                        onClick={(ev) => {
                                            if (!read) markRead(item.notificationId);
                                            const navLink = getNavigationLink(item);
                                            if (navLink != undefined) history.push(navLink);
                                        }}
                                        className={`d-flex bd-highlight px-2 ${read ? 'lt-bg-transparent notification-highlight-read' : 'lt-bg-faq-light-alt notification-highlight-unread'} ${getNavigationLink(item)==undefined ? 'cursor-default lt-bg-transparent notification-highlight-undefined' : ''}`}
                                    >
                                        <div className="bd-highlight align-self-center text-center">
                                            {item.avatarUrl ? (
                                                <img src={item.avatarUrl} className="avatar avatar--xs" alt="" />
                                            ) : (
                                                <img
                                                    src={getUserIcon(item.notificationType)}
                                                    alt=""
                                                    className="avatar avatar--xs"
                                                />
                                            )}
                                        </div>
                                        <div className="p-2 bd-highlight flex-grow-1">
                                            <p className="fs-12 lt-text-primary">{item.message}</p>
                                            <span className="fs-10">{moment(item.date).fromNow()}</span>
                                            <span
                                                role="button"
                                                onClick={() => {
                                                    const closeButton = document.getElementById(
                                                        'Notifications'
                                                    ) as HTMLAnchorElement;
                                                    closeButton.click();
                                                }}
                                            >
                                                {getLink(item)}
                                            </span>
                                        </div>
                                        <div className="bd-highlight flex-shrink-1 align-self-center text-center">
                                            <i
                                                className={`bi bi-circle-fill fs-10 ${
                                                    read ? 'lt-text-disabled' : 'lt-text-primary-alt'
                                                }`}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        <Nodata text="No notifications received yet." icon="bi-bell" style={{ height: 400 }} />
                    )}
                </div>
                {loading && (
                    <div className="spinner-grow text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeaderNotify;

const getUserIcon = (value: NotificationTypeEnum) => {
    switch (value) {
        case NotificationTypeEnum.offerAccepted:
        case NotificationTypeEnum.offerRejected:
        case NotificationTypeEnum.companyReviewAdded:
        case NotificationTypeEnum.candidateSignedUpByInvitation:
        case NotificationTypeEnum.reportEmployerForCandidate:
        case NotificationTypeEnum.reportEmployerForAdmin:
        case NotificationTypeEnum.reportCandidateForEmployer:
        case NotificationTypeEnum.suspendCandidateForAdmin:
        case NotificationTypeEnum.suspendCandidateForCandidate:
        case NotificationTypeEnum.suspendCandidateForEmployer:
        case NotificationTypeEnum.unsuspendCandidateForAdmin:
        case NotificationTypeEnum.unsuspendCandidateForCandidate:
        case NotificationTypeEnum.unsuspendCandidateForCompany:
        case NotificationTypeEnum.ReplyByCandidate:
            return candidateAvatar;
        case NotificationTypeEnum.offerCreated:
        case NotificationTypeEnum.offerRetracted:
        case NotificationTypeEnum.managerSignedUpByEmployeeManagement:
        case NotificationTypeEnum.candidateReviewAdded:
        case NotificationTypeEnum.suspendEmployerForAdmin:
        case NotificationTypeEnum.suspendEmployerForCompany:
        case NotificationTypeEnum.suspendEmployerForCandidate:
        case NotificationTypeEnum.unsuspendEmployerForAdmin:
        case NotificationTypeEnum.unsuspendEmployerForCandidate:
        case NotificationTypeEnum.unsuspendEmployerForCompany:
        case NotificationTypeEnum.ReplyByCompany:
        return companyLogo;
    }
};

const getLink = (item: NotificationType) => {
    switch (item.notificationType) {
        case NotificationTypeEnum.offerAccepted:
        case NotificationTypeEnum.offerRejected:
        case NotificationTypeEnum.offerCreated:
        case NotificationTypeEnum.offerRetracted:
            return (
                item.offerId && (
                    <Link
                        to={generateLink(routes.document, { id: item.offerId })}
                        className="ms-2 fs-10 position-relative lt-text-primary"
                    >
                        Open offer document
                    </Link>
                )
            );
        case NotificationTypeEnum.companyReviewAdded:
            return (
                <Link to={routes.myCompany} className="ms-2 fs-10 position-relative lt-text-primary">
                    Open company profile
                </Link>
            );
            case NotificationTypeEnum.ReplyByCompany:
                return (
                    item.companyId && (
                        <Link
                            to={generateLink(routes.company, { id: item.companyId })}
                            className="ms-2 fs-10 position-relative lt-text-primary"
                        >
                            Open company profile
                        </Link>
                    )
                );
                case NotificationTypeEnum.ReplyByCandidate:
                    return (
                        item.candidateId && (
                            <Link
                                to={generateLink(routes.candidate, { id: item.candidateId })}
                                className="ms-2 fs-10 position-relative lt-text-primary"
                            >
                                Open candidate profile
                            </Link>
                        )
                    );
        case NotificationTypeEnum.candidateReviewAdded:
            return (
            
                <Link to={routes.myProfile} className="ms-2 fs-10 position-relative lt-text-primary">
                    Open my profile
                </Link>
            );
        case NotificationTypeEnum.candidateSignedUpByInvitation:
            return (
                item.candidateId && (
                    <Link
                        to={generateLink(routes.candidate, { id: item.candidateId })}
                        className="ms-2 fs-10 position-relative lt-text-primary"
                    >
                        Open candidate profile
                    </Link>
                )
            );
    }
};

const getNavigationLink = (item: NotificationType) => {
    switch (item.notificationType) {
        case NotificationTypeEnum.offerAccepted:
        case NotificationTypeEnum.offerRejected:
        case NotificationTypeEnum.offerCreated:
        case NotificationTypeEnum.offerRetracted:
            if (item.offerId != undefined) return generateLink(routes.document, { id: item.offerId });
            break;
        case NotificationTypeEnum.companyReviewAdded:
            return routes.myCompany;
        case NotificationTypeEnum.candidateReviewAdded:
            return routes.myProfile;
        case NotificationTypeEnum.candidateSignedUpByInvitation:
            if (item.candidateId != undefined) return generateLink(routes.candidate, { id: item.candidateId });
            break;
        case NotificationTypeEnum.ReplyByCompany:
            if (item.companyId != undefined) return generateLink(routes.company, { id: item.companyId });
            break;
        case NotificationTypeEnum.ReplyByCandidate:
            if (item.candidateId != undefined) return generateLink(routes.candidate, { id: item.candidateId });
            
    }
};
