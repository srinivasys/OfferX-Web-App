import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Table from '../../../components/table';
import avatar from '../../../assets/img/avatars.svg';
import { OfferCreationEnum, OfferDataType, OfferReviewStateEnum, OfferStateEnum } from '../../../types/offer';
import EmptyOffers from './empty';
import RetractOffer from './modals/retract';
import { routes } from '../../routes/routes-names';
import imgNoResult from '../../../assets/icons/offer-no-result.svg';
import { getOfferStateText } from '../../../lib/utils/dictionary';
import queryString from 'query-string';
import ReviewModal from '../../../components/review/modal';
import { getColumnByOfferState } from '../utils';
import { ReactComponent as IconRepeat } from '../../../assets/icons/arrow-repeat-color.svg';
import moment from 'moment';
import RetractOfferModal from '../../../components/modal/retract-offer';
import OfferLetterView from '../../../components/offer-letter';
import { ReviewType } from '../../../types/review';
import { isExitReviewEnabled, isProgressReviewEnabled } from '../../../lib/utils/reviews-config';
import history from '../../../../src/history';
import { GridConstants } from '../../../lib/constants/constants';
import { CategoryType } from '../../../components/profile/utils/suspension';
import { convertUTCtoLocal } from '../../../lib/utils/common-functions';
import { Calendar } from 'primereact/calendar';
import Grid from '../../../components/grid';
import {
    TableLazyParamsType,
    TableConfigType,
    defaultPaginationParams,
    fieldName,
    columnHeader,
    FilterElementEnum,
    placeholder,
    GridSortEnum,
} from '../../../types/grid';
import PageLoader from '../../../components/loader';

type Props = {
    offers: OfferDataType[];
    offersCount: number;
    offerState: OfferStateEnum;
    isTableLoading: boolean;
    onLazyParamChange: (lazyParams: TableLazyParamsType) => void;
    PendingOfferCount: number | null | undefined;
    AcceptedOfferCount: number | null | undefined;
    OnboardedOfferCount: number | null | undefined;
    GhostedOfferCount: number | null | undefined;
    DeclinedOfferCount: number | null | undefined;
    RetractedOfferCount: number | null | undefined;
    ExpiredOfferCount: number | null | undefined;
};

const ManagerTableOffers: React.FC<Props> = ({
    offers,
    offersCount,
    offerState,
    isTableLoading,
    onLazyParamChange,
    PendingOfferCount,
    AcceptedOfferCount,
    OnboardedOfferCount,
    GhostedOfferCount,
    DeclinedOfferCount,
    RetractedOfferCount,
    ExpiredOfferCount,
}) => {
    const [activeOffer, setActiveOffer] = useState<OfferDataType | null>(null);
    const stateColumn = useMemo(() => getColumnByOfferState(offerState), [offerState]);
    const [retractModal, setRetractModal] = useState<boolean>(false);
    const data = offers.map((offer) => ({
        ...offer,
        offerDate: convertUTCtoLocal(offer.offerDate),
        offerExpiryDate: offer.offerExpiryDate && convertUTCtoLocal(offer.offerExpiryDate),
        expiredDate: offer.expiredDate && convertUTCtoLocal(offer.expiredDate),
        acceptedDate: offer.acceptedDate && convertUTCtoLocal(offer.acceptedDate),
        jobStartDate: offer.jobStartDate && convertUTCtoLocal(offer.jobStartDate),
        rejectedDate: offer.rejectedDate && convertUTCtoLocal(offer.rejectedDate),
        retractedDate: offer.retractedDate && convertUTCtoLocal(offer.retractedDate),
        candidateFirstName: offer.candidateFirstName && offer.candidateFirstName,
    }));

    const offersTableConfig: TableConfigType = {
        isCandidateGrid: false,
        setRetractModal: setRetractModal,
        isTableLoading: isTableLoading,
        setActiveOffer: setActiveOffer,
        defaultFilterFields: [],
        totalRecords: offersCount,
        onLazyParamChange: onLazyParamChange,
        defaultPageSize: defaultPaginationParams.pageSize,
        columnConfig: [
            {
                columnName: fieldName.candidateName,
                columnHeader: columnHeader.candidateName,
                isSortable: true,
                isFilterable: true,
                filterType: FilterElementEnum.InputText,
                filterPlaceholder: placeholder.searchCandidateName,
            },
            {
                columnName: fieldName.jobTitle,
                columnHeader: columnHeader.jobTitle,
                isSortable: true,
                isFilterable: true,
                filterType: FilterElementEnum.InputText,
                filterPlaceholder: placeholder.searchJobTitle,
            },
            {
                columnName: fieldName.offerDate,
                columnHeader: columnHeader.offerDate,
                isSortable: true,
                isFilterable: true,
                filterType: FilterElementEnum.Calendar,
            },
            {
                columnName: stateColumn.dataIndex,
                columnHeader: stateColumn.title,
                isSortable: true,
                isFilterable: true,
                filterType: FilterElementEnum.Calendar,
            },
            {
                columnName: fieldName.jobStartDate,
                columnHeader: columnHeader.jobStartDate,
                isSortable: true,
                isFilterable: true,
                filterType: FilterElementEnum.Calendar,
            },
            {
                columnName: fieldName.actions,
                columnHeader: columnHeader.actions,
                isSortable: false,
                isFilterable: true,
                isActions: true,
            },
        ],
    };
    const ResetSessionState = () => {
        sessionStorage.setItem('Page_number', '0');
        sessionStorage.setItem('Page_size', '10');
        sessionStorage.setItem('Sort_order', String(GridSortEnum.Desc));
        sessionStorage.removeItem('Filter_value');
    };
    return offers ? (
        <>
            <div className="card lt-job-offer-table company-job-offer">
                <nav>
                    <div className="d-flex bd-highlight lt-nav-bar">
                        <div className="w-100 bd-highlight d-flex justify-content-between">
                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                <button
                                    onClick={() => {
                                        ResetSessionState();
                                        history.push(routes.pendingOffers);
                                    }}
                                    className={`nav-link fs-16 
                                        ${offerState === OfferStateEnum.pending ? 'active' : ''}`}
                                    type="button"
                                >
                                    Pending{' '}
                                    {PendingOfferCount == 0 ? (
                                        <span className="count-tabs">{PendingOfferCount}</span>
                                    ) : (
                                        <span className="count-tabs">{PendingOfferCount}</span>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        ResetSessionState();
                                        history.push(routes.acceptedOffers);
                                    }}
                                    className={`nav-link fs-16 
                                        ${offerState === OfferStateEnum.accepted ? 'active' : ''}`}
                                    type="button"
                                >
                                    Accepted{' '}
                                    {AcceptedOfferCount == 0 ? (
                                        <span className="count-tabs">{AcceptedOfferCount}</span>
                                    ) : (
                                        <span className="count-tabs">{AcceptedOfferCount}</span>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        ResetSessionState();
                                        history.push(routes.onboardedOffers);
                                    }}
                                    className={`nav-link fs-16 
                                        ${offerState === OfferStateEnum.onboarded ? 'active' : ''}`}
                                    type="button"
                                >
                                    Onboarded{' '}
                                    {OnboardedOfferCount == 0 ? (
                                        <span className="count-tabs">{OnboardedOfferCount}</span>
                                    ) : (
                                        <span className="count-tabs">{OnboardedOfferCount}</span>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        ResetSessionState();
                                        history.push(routes.ghostedOffers);
                                    }}
                                    className={`nav-link fs-16 
                                        ${offerState === OfferStateEnum.ghosted ? 'active' : ''}`}
                                    type="button"
                                >
                                    Ghosted{' '}
                                    {GhostedOfferCount == 0 ? (
                                        <span className="count-tabs">{GhostedOfferCount}</span>
                                    ) : (
                                        <span className="count-tabs">{GhostedOfferCount}</span>
                                    )}
                                </button>
                                <button
                                    className="col-4 col-sm-2 d-sm-none"
                                    type="button"
                                    id="NavMenu"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <div
                                        className={`nav-link fs-16 
                                            ${
                                                offerState === OfferStateEnum.rejected ||
                                                offerState === OfferStateEnum.retracted ||
                                                offerState === OfferStateEnum.expired
                                                    ? 'active'
                                                    : ''
                                            }`}
                                    >
                                        {offerState === OfferStateEnum.rejected
                                            ? 'Declined'
                                            : offerState === OfferStateEnum.retracted
                                            ? 'Retracted'
                                            : offerState === OfferStateEnum.expired
                                            ? 'Expired'
                                            : 'More'}{' '}
                                        <i className="bi bi-chevron-down"></i>
                                    </div>
                                </button>
                                <ul className="dropdown-menu p-0" aria-labelledby="NavMenu">
                                    <li>
                                        <button
                                            onClick={() => {
                                                ResetSessionState();
                                                history.push(routes.declinedOffers);
                                            }}
                                            className={`nav-link fs-16 w-100 text-start 
                                                ${offerState === OfferStateEnum.rejected ? 'active' : ''}`}
                                            type="button"
                                        >
                                            Declined{' '}
                                            {DeclinedOfferCount == 0 ? (
                                                <span className="count-tabs">{DeclinedOfferCount}</span>
                                            ) : (
                                                <span className="count-tabs">{DeclinedOfferCount}</span>
                                            )}
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                ResetSessionState();
                                                history.push(routes.retractedOffers);
                                            }}
                                            className={`nav-link fs-16 w-100 text-start 
                                                ${offerState === OfferStateEnum.retracted ? 'active' : ''}`}
                                            type="button"
                                        >
                                            Retracted{' '}
                                            {RetractedOfferCount == 0 ? (
                                                <span className="count-tabs">{RetractedOfferCount}</span>
                                            ) : (
                                                <span className="count-tabs">{RetractedOfferCount}</span>
                                            )}
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                ResetSessionState();
                                                history.push(routes.expiredOffers);
                                            }}
                                            className={`nav-link fs-16 w-100 text-start 
                                                ${offerState === OfferStateEnum.expired ? 'active' : ''}`}
                                            type="button"
                                        >
                                            Expired{' '}
                                            {ExpiredOfferCount == 0 ? (
                                                <span className="count-tabs">{ExpiredOfferCount}</span>
                                            ) : (
                                                <span className="count-tabs">{ExpiredOfferCount}</span>
                                            )}
                                        </button>
                                    </li>
                                </ul>
                                <button
                                    onClick={() => {
                                        ResetSessionState();
                                        history.push(routes.declinedOffers);
                                    }}
                                    className={`nav-link fs-16 d-none d-sm-block 
                                        ${offerState === OfferStateEnum.rejected ? 'active' : ''}`}
                                    type="button"
                                >
                                    Declined{' '}
                                    {DeclinedOfferCount == 0 ? (
                                        <span className="count-tabs">{DeclinedOfferCount}</span>
                                    ) : (
                                        <span className="count-tabs">{DeclinedOfferCount}</span>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        ResetSessionState();
                                        history.push(routes.retractedOffers);
                                    }}
                                    className={`nav-link fs-16  d-none d-sm-block 
                                        ${offerState === OfferStateEnum.retracted ? 'active' : ''}`}
                                    type="button"
                                >
                                    Retracted{' '}
                                    {RetractedOfferCount == 0 ? (
                                        <span className="count-tabs">{RetractedOfferCount}</span>
                                    ) : (
                                        <span className="count-tabs">{RetractedOfferCount}</span>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        ResetSessionState();
                                        history.push(routes.expiredOffers);
                                    }}
                                    className={`nav-link fs-16  d-none d-sm-block 
                                        ${offerState === OfferStateEnum.expired ? 'active' : ''}`}
                                    type="button"
                                >
                                    Expired{' '}
                                    {ExpiredOfferCount == 0 ? (
                                        <span className="count-tabs">{ExpiredOfferCount}</span>
                                    ) : (
                                        <span className="count-tabs">{ExpiredOfferCount}</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="mt-1" />
                <div className="offer-table-container">
                    <div className="offer-table-scroll table-responsive w-100">
                        <Grid data={data} inputTableConfig={offersTableConfig} offerState={offerState} />
                    </div>
                </div>
            </div>
            <RetractOffer activeOffer={activeOffer} />
            <ReviewModal
                offerId={activeOffer?.id || ''}
                reviewTypeList={activeOffer?.reviewType}
                reviewTypeProfile={
                    !isProgressReviewEnabled && !isExitReviewEnabled ? ReviewType.OnboardingReview : undefined
                }
                reviewId={activeOffer?.reviewId || null}
                isJobOfferdisabled={true}
                jobRole={activeOffer?.jobTitle}
                jobStartDate={activeOffer != null ? activeOffer?.jobStartDate : undefined}
            />
            <RetractOfferModal
                type="retract"
                setRetractModal={setRetractModal}
                id={activeOffer?.id || ''}
                retractModal={retractModal}
            />
            <OfferLetterView id={activeOffer?.id || ''} />
        </>
    ) : (
        <EmptyOffers />
    );
};

export default ManagerTableOffers;
