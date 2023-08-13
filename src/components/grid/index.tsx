import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMetaData, DataTableProps } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import avatar from '../../assets/img/avatars.svg';
import { useContext, useEffect, useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import queryString from 'query-string';
import './index.scss';
import { OfferCreationEnum, OfferDataType, OfferReviewStateEnum, OfferStateEnum } from '../../types/offer';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { Link } from 'react-router-dom';
import { routes } from '../../containers/routes/routes-names';
import { generateLink } from '../../lib/utils/generate-link';
import { isExitReviewEnabled, isProgressReviewEnabled } from '../../lib/utils/reviews-config';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import history from '../../history';
import { offerService } from '../../lib/api/offer';
import Context from '../../context/update';
import { digioAckEmail, digioUrl } from '../../config/constants';
import imgNoResult from '../../assets/icons/offer-no-result.svg';
import _ from 'lodash';
import { digioSign } from '../../lib/utils/digio-sign';
import {
    columnHeader,
    defaultPaginationParams,
    fieldName,
    FilterElementEnum,
    GridProps,
    GridSortEnum,
    TableColumnConfigType,
    TableConfigType,
    TableFilterType,
    TableLazyParamsType,
} from '../../types/grid';
import PageLoader from '../loader';
import companyLogo from '../../assets/img/logo.svg';
import { number, string } from 'yup';
import { Row } from 'react-bootstrap';
const getCandidateName = (row: any) => {
    return (
        <div className="d-flex">
            <div className="offer-table-reoffered me-3">
                <img src={row.candidateAvatarUrl || avatar} alt="" className="avatar avatar--xs" />
                {row.offerCreationType === OfferCreationEnum.reOffer && (
                    <div className="offer-table-reoffered__icon" title="Re-offered"></div>
                )}
            </div>
            <Link
                to={generateLink(routes.candidate, { id: row.candidateId })}
                className="text-crop"
                title={row.candidateName}
            >
                <span className="big-text text-underline">{row.candidateName}</span>
            </Link>
        </div>
    );
};

const getCompanyName = (row: any) => {
    return (
        <div className="d-flex">
            <div className="offer-table-reoffered me-3">
                <img src={row.companyAvatarUrl || companyLogo} alt="" className="avatar avatar--xs" />
                {row.offerCreationType === OfferCreationEnum.reOffer && (
                    <div className="offer-table-reoffered__icon" title="Re-offered"></div>
                )}
            </div>
            <Link
                to={generateLink(routes.company, { id: row.companyId })}
                className="offer-table-link d-flex text-nowrap text-ellipsis"
                title={row.companyName}
            >
                <span className="text-ellipsis">{row.companyName}</span>
            </Link>
        </div>
    );
};

const getJobTitleTemplte = (row: any) => {
    return (
        <div className="text-crop d-flex align-items-center" title={`${row.jobTitle}`}>
            <span className="big-text">{row.jobTitle}</span>
        </div>
    );
};

const Grid: React.FC<GridProps> = ({ data, inputTableConfig, offerState }) => {
    const [tableData, setTableData] = useState(data);
    const [sortField, setSortField] = useState<string>(
        sessionStorage.getItem('Sort_field') ? String(sessionStorage.getItem('Sort_field')) : fieldName.offerDate
    );
    const [sortOrder, setSortOrder] = useState<GridSortEnum>(
        sessionStorage.getItem('Sort_order') ? Number(sessionStorage.getItem('Sort_order')) : GridSortEnum.Desc
    );
    const [areFiltersReseting, setAreFiltersReseting] = useState<boolean>(true);
    const [candidateFilter, setCandidateFilter] = useState<string>('');
    const [isCandidateFilterLoading, setIsCandidateFilterLoading] = useState<Boolean>(false);
    const location = useLocation();

    const initialCompanyGridFilters = {
        candidateName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        jobTitle: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        jobStartDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        offerDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        expiredDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        acceptedDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        rejectedDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        retractedDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        offerExpiryDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    };
    const initialCandidateGridFilters = {
        companyName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        jobTitle: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        jobStartDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        offerDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        expiredDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        acceptedDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        rejectedDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        retractedDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        offerExpiryDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    };

    const [filters, setFilters] = useState(
        inputTableConfig.isCandidateGrid ? { ...initialCandidateGridFilters } : { ...initialCompanyGridFilters }
    );

    const [pageSize, setPageSize] = useState<number>(10);

    const [areFiltersApplicable, setAreFiltersApplicable] = useState<boolean>(true);
    const { updateOffersList, updateOffersCount } = useContext(Context);
    const [lazyParams, setLazyParams] = useState<TableLazyParamsType>({
        filters: inputTableConfig.defaultFilterFields ? inputTableConfig.defaultFilterFields : [],
        sort: {
            sortField: sessionStorage.getItem('Sort_field')
                ? String(sessionStorage.getItem('Sort_field'))
                : fieldName.offerDate,
            sortOrder: sessionStorage.getItem('Sort_order')
                ? Number(sessionStorage.getItem('Sort_order'))
                : GridSortEnum.Desc,
        },
        pageSize: inputTableConfig.defaultPageSize,
        pageNumber: sessionStorage.getItem('Page_number')
            ? Number(sessionStorage.getItem('Page_number'))
            : defaultPaginationParams.pageNumber,
    } as TableLazyParamsType);

    async function accept(id: string) {
        try {
            await offerService.accept(id);
            updateOffersList && (await updateOffersList());
            updateOffersCount && (await updateOffersCount());
        } catch (err: any) {
        } finally {
            setLoadingSign('');
        }
    }

    const getCompanyActions = (offer: any) => {
        return (
            <div className="d-flex justify-content-center">
              <Link
                    className="lt-action-btn text-black absolute-area-link--candidate"
                    to={generateLink(routes.document, { id: offer.id })}
                    title="Open offer letter"
                >
                    <i className="bi bi-file-earmark-text" />
                </Link>
                    {offerState === OfferStateEnum.pending &&
                    (
                        <Link
                            title={'Revise offer'}
                            to={queryString.stringifyUrl({
                                url: routes.releaseOffer,
                                query: { candidate: offer.candidateId, offerId: offer.id },
                            })}
                            className="lt-action-btn text-black"
                        >
                            <i className="bi bi-pencil text-success" />
                        </Link>
                    )}
                {offer.offerReviewState === OfferReviewStateEnum.availableForReview && (
                    <button
                        type="button"
                        data-bs-toggle="modal"
                        onClick={() => setActiveOffer(offer)}
                        data-bs-target="#WriteReview"
                        title={`${
                            !isProgressReviewEnabled && !isExitReviewEnabled ? 'Write a' : ''
                        } review for this candidate`}
                        className="lt-action-btn"
                    >
                        <i className="bi bi-chat-left-text" />
                    </button>
                )}
                {offer.offerReviewState === OfferReviewStateEnum.startDateNotReached && (
                    <button
                        title="Please wait until the start date to write a review for this candidate"
                        className="lt-action-btn lt-action-btn--disabled table-review-btn-disabled"
                        disabled
                    >
                        <i className="bi bi-chat-left-text" />
                    </button>
                )}
                {offer.offerReviewState === OfferReviewStateEnum.reviewAlreadyExists && (
                    <span
                        title="Review cannot be edited and deleted once published."
                        className="lt-action-btn lt-action-btn--disabled table-review-btn-disabled"
                    >
                        <i className="bi bi-chat-left-text" />
                    </span>
                )}
                {(offerState === OfferStateEnum.pending || offerState === OfferStateEnum.accepted) && (
                    <>
                        {moment(moment().format('YYYY-MM-DD')).isAfter(
                            moment(offer.jobStartDate).format('YYYY-MM-DD')
                        ) && offerState === OfferStateEnum.accepted ? (
                            <button
                                title="Offers cannot be retracted when job start dates are past"
                                style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                className="lt-action-btn lt-del"
                                disabled
                            >
                                <i className="bi bi-x-circle text-danger" />
                            </button>
                        ) : (
                            <button
                                title="Retract offer"
                                onClick={() => (setActiveOffer(offer), setRetractModal(true))}
                                className="lt-action-btn lt-del"
                            >
                                <i className="bi bi-x-circle text-danger" />
                            </button>
                        )}
                    </>
                )}
            </div>
        );
    };

    const getCandidateActions = (offer: any) => {
        return (
            <div className="d-flex justify-content-center">
                {
                   (offer.offerState === OfferStateEnum.accepted 
                   || offer.offerState === OfferStateEnum.onboarded 
                   || offer.offerState === OfferStateEnum.ghosted) && 
                   (
                    <a
                        className="lt-action-btn text-black"
                        href={offer.offerDocumentUrl}
                        download={`${offer.offerDocumentUrl}`}
                        title="Download offer letter"
                    >
                        <i className="bi bi-download" />
                    </a>
                   )

                }
                <Link
                    className="lt-action-btn text-black absolute-area-link--candidate d-flex"
                    to={generateLink(routes.document, { id: offer.id })}
                    title={'View offer letter'}
                    style={{ textDecoration: 'none' }}
                >
                    <i className="bi bi-file-earmark-text" />
                </Link>
               
                {offer.offerState === OfferStateEnum.pending && (
                    <>
                        {(inputTableConfig as TableConfigType).loadingSign === offer.id && (
                            <div className="new-spinner p-fixed">
                                <div>
                                    <span className="spinner-border spinner-border-sm custom-spinner-border" />
                                </div>
                                <p className="fs-14 custom-loading-text">Loading</p>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                if (!inputTableConfig.digioReady) return;
                                setLoadingSign(offer.id);
                                digioSign(
                                    offer.id,
                                    offer.externalForSignatureDocId,
                                    digioAckEmail,
                                    accept.bind(null, offer.id),
                                    setLoadingSign.bind(null, '')
                                );
                            }}
                            title="Accept offer"
                            className={`lt-action-btn text-black ${
                                (inputTableConfig as TableConfigType).loadingSign ? 'table-btn-disabled' : ''
                            }`}
                        >
                            <i className="bi bi-check-circle lt-text-success-alt" />
                        </button>
                        <button
                            type="button"
                            data-bs-toggle="modal"
                            onClick={() => setActiveOffer(offer)}
                            data-bs-target="#RejectPreview"
                            title="Decline offer"
                            className="lt-action-btn lt-del"
                        >
                            <i className="bi bi-x-circle text-danger" />
                        </button>
                    </>
                )}
                {offer.offerReviewState === OfferReviewStateEnum.availableForReview && (
                    <button
                        type="button"
                        data-bs-toggle="modal"
                        onClick={() => setActiveOffer(offer)}
                        data-bs-target="#WriteReview"
                        title={`${
                            !isProgressReviewEnabled && !isExitReviewEnabled ? 'Write a review for this employer' : ''
                        }`}
                        className="lt-action-btn"
                    >
                        <i className="bi bi-chat-left-text" />
                    </button>
                )}
                {offer.offerReviewState === OfferReviewStateEnum.startDateNotReached && (
                    <button
                        title="Please wait until the start date to write a review for this company"
                        className="lt-action-btn lt-action-btn--disabled table-review-btn-disabled"
                        disabled
                    >
                        <i className="bi bi-chat-left-text" />
                    </button>
                )}
                {offer.offerReviewState === OfferReviewStateEnum.reviewAlreadyExists && (
                    <span
                        title="You cannot edit a review."
                        className="lt-action-btn lt-action-btn--disabled table-review-btn-disabled"
                    >
                        <i className="bi bi-chat-left-text" />
                    </span>
                )}
            </div>
        );
    };

    useEffect(() => {
        setTableData(data);
        sessionStorage.setItem('Table_value', JSON.stringify(data));
    }, [data]);

    useEffect(() => {
        initializeGrid();
        resetFilters();
        resetSorting();
        resetPagination();
    }, [offerState]);

    const initializeGrid = () => {
        initialFilters();
        initializeParams();
    };

    const initialFilters = () => {
        setFilters(
            inputTableConfig.isCandidateGrid ? { ...initialCandidateGridFilters } : { ...initialCompanyGridFilters }
        );
    };

    const resetFilters = () => {
        setAreFiltersReseting(true);
        setAreFiltersApplicable(false);
        setTimeout(() => {
            setAreFiltersApplicable(true);
            setAreFiltersReseting(false);
        }, 100);
    };

    const resetSorting = () => {
        setSortField(
            sessionStorage.getItem('Sort_field') ? String(sessionStorage.getItem('Sort_field')) : fieldName.offerDate
        );
        setSortOrder(
            sessionStorage.getItem('Sort_order') ? Number(sessionStorage.getItem('Sort_order')) : GridSortEnum.Desc
        );
    };

    const resetPagination = () => {
        setPageNumber(sessionStorage.getItem('Page_number') ? Number(sessionStorage.getItem('Page_number')) : 0);
        setPageSize(sessionStorage.getItem('Page_size') ? Number(sessionStorage.getItem('Page_size')) : 10);
    };

    const initializeParams = () => {
        if (JSON.stringify(sessionStorage.getItem('Filter_value')) != '') {
            var storedArray = JSON.parse(sessionStorage.getItem('Filter_value') || '0');
            var i;
            let filters: any = [];
            for (i = 0; i < storedArray.length; i++) {
                filters.push({
                    columnName: storedArray[i].columnName,
                    value: storedArray[i].value ? storedArray[i].value : null,
                } as TableFilterType);
            }
            lazyParams.filters = filters;
        } else {
            lazyParams.filters = inputTableConfig.defaultFilterFields ? inputTableConfig.defaultFilterFields : [];
        }

        if (JSON.stringify(sessionStorage.getItem('Sort_field')) == '') {
            if (offerState === OfferStateEnum.accepted) {
                sessionStorage.setItem('Sort_field', fieldName.acceptedDate);
            } else if (offerState === OfferStateEnum.expired) {
                sessionStorage.setItem('Sort_field', fieldName.offerExpiryDate);
            } else if (offerState === OfferStateEnum.retracted) {
                sessionStorage.setItem('Sort_field', fieldName.retractedDate);
            } else if (offerState === OfferStateEnum.rejected) {
                sessionStorage.setItem('Sort_field', fieldName.rejectedDate);
            } else if (offerState === OfferStateEnum.onboarded || offerState == OfferStateEnum.ghosted) {
                sessionStorage.setItem('Sort_field', fieldName.jobStartDate);
            } else {
                sessionStorage.setItem('Sort_field', fieldName.offerDate);
            }
        }

        lazyParams.sort = {
            sortField: sessionStorage.getItem('Sort_field')
                ? String(sessionStorage.getItem('Sort_field'))
                : fieldName.offerDate,
            sortOrder: sessionStorage.getItem('Sort_order')
                ? Number(sessionStorage.getItem('Sort_order'))
                : GridSortEnum.Desc,
        };
        lazyParams.pageSize = inputTableConfig.defaultPageSize;
        lazyParams.pageNumber = sessionStorage.getItem('Page_number')
            ? Number(sessionStorage.getItem('Page_number'))
            : defaultPaginationParams.pageNumber;
        setLazyParams(lazyParams);
        onLazyParamChange(lazyParams);
    };
    const setActiveOffer = (offer: OfferDataType | null) => {
        (inputTableConfig as TableConfigType).setActiveOffer?.(offer);
    };

    const setLoadingSign = (value: any) => {
        (inputTableConfig as TableConfigType).setLoadingSign?.(value);
    };

    const setRetractModal = (isOfferRetracted: boolean) => {
        (inputTableConfig as TableConfigType).setRetractModal?.(isOfferRetracted);
    };

    const onLazyParamChange = (lazyParams: TableLazyParamsType) => {
        (inputTableConfig as TableConfigType).onLazyParamChange(lazyParams);
    };

    const onPageChange = (event: any) => {
        lazyParams.pageNumber = event.first as number;
        lazyParams.pageSize = event.rows as number;
        setLazyParams(lazyParams);
        onLazyParamChange(lazyParams);
        setPageSize(event.rows as number);
        setPageNumber(event.first as number);
        sessionStorage.setItem('Page_number', event.rows);
    };

    const onSort = (event: any) => {
        if (event.sortField && event.sortOrder) {
            lazyParams.sort.sortField = event.sortField;
            lazyParams.sort.sortOrder = event.sortOrder;
            setSortField(event.sortField);
            setSortOrder(event.sortOrder);
            sessionStorage.setItem('Sort_field', event.sortField);
            sessionStorage.setItem('Sort_order', event.sortOrder);
        }
        setLazyParams(lazyParams);
        onLazyParamChange(lazyParams);
    };
    const onRowSelect = (offer: any) => {
        history.push(generateLink(routes.document, { id: offer.id }));
    };

    const onFilter = (event: any) => {
        setFilters(event.filters);
        if (event.filters) {
            let filters: any = [];
            Object.keys(event.filters as object).forEach((key: string) => {
                let filterValue = event.filters[key].value;
                if (filterValue instanceof Date) {
                    filterValue = moment(filterValue as Date).format('yyyy-MM-DD');
                }
                filters.push({
                    columnName: key,
                    value: filterValue ? filterValue : null,
                } as TableFilterType);

                // key: the name of the object key
                // index: the ordinal position of the key within the object
            });
            sessionStorage.setItem('Filter_value', JSON.stringify(filters));
            lazyParams.filters = filters;
            setLazyParams(lazyParams);
            onLazyParamChange(lazyParams);
        }
    };

    var item_value = 0;
    if (sessionStorage.getItem('Page_number') != null) {
        var value = sessionStorage.getItem('Page_number');
        item_value = Number(value);
    }

    const [pageNumber, setPageNumber] = useState(item_value);

    useEffect(() => {
        sessionStorage.setItem('Page_number', String(pageNumber));

        sessionStorage.setItem('Page_size', String(pageSize));
    }, [pageNumber, pageSize]);

    const paginatorRight =
        Math.ceil(inputTableConfig.totalRecords / pageSize) > 0 ? (
            <div>
                Page {Math.round(pageNumber / pageSize) + 1} of {Math.ceil(inputTableConfig.totalRecords / pageSize)}
            </div>
        ) : (
            <div></div>
        );

    const paginatorLeft = <div></div>;

    const valueCheck = (val: string, colConfig: TableColumnConfigType) => {
        if (JSON.stringify(sessionStorage.getItem('Filter_value')) != null) {
            if (val == null) {
                var storedArray = JSON.parse(sessionStorage.getItem('Filter_value') || '0');
                var i;
                for (i = 0; i < storedArray.length; i++) {
                    if (storedArray[i].columnName === colConfig.columnName) {
                        if (
                            storedArray[i].value !== null
                                ? storedArray[i].value === 'candidateName' ||
                                  'jobTitle' ||
                                  'rejectedDate' ||
                                  'offerDate' ||
                                  'acceptedDate' ||
                                  'expiredDate' ||
                                  'jobStartDate' ||
                                  'offerExpiryDate'
                                : null
                        ) {
                            if (
                                storedArray[i].value !== null ? storedArray[i].columnName === 'offerExpiryDate' : null
                            ) {
                                return storedArray[i].value;
                            } else if (
                                storedArray[i].value !== null ? storedArray[i].columnName === 'retractedDate' : null
                            ) {
                                return new Date(storedArray[i].value);
                            } else if (
                                storedArray[i].value !== null ? storedArray[i].columnName === 'jobStartDate' : null
                            ) {
                                return new Date(storedArray[i].value);
                            } else if (
                                storedArray[i].value !== null ? storedArray[i].columnName === 'expiredDate' : null
                            ) {
                                return new Date(storedArray[i].value);
                            } else if (
                                storedArray[i].value !== null ? storedArray[i].columnName === 'acceptedDate' : null
                            ) {
                                return new Date(storedArray[i].value);
                            } else if (
                                storedArray[i].value !== null ? storedArray[i].columnName === 'rejectedDate' : null
                            ) {
                                return new Date(storedArray[i].value);
                            } else if (
                                storedArray[i].value !== null ? storedArray[i].columnName === 'jobTitle' : null
                            ) {
                                return storedArray[i].value;
                            } else if (
                                storedArray[i].value !== null ? storedArray[i].columnName === 'candidateName' : null
                            ) {
                                return storedArray[i].value;
                            } else if (
                                storedArray[i].value !== null ? storedArray[i].columnName === 'offerDate' : null
                            ) {
                                const date = [];

                                let startDate = new Date(storedArray[i].value[0]);
                                let endDate = new Date(storedArray[i].value[1]);

                                if (storedArray[i].value[1] == null) {
                                    endDate = new Date(storedArray[i].value[0]);
                                } else {
                                    endDate = new Date(storedArray[i].value[1]);
                                }

                                date.push(startDate);
                                date.push(endDate);

                                return date;
                            }
                        }
                        return storedArray[i].value;
                        break;
                    }
                }
            } else {
                return val;
            }
        }
    };

    const columnFilter = (event: any, colConfig: TableColumnConfigType) => {
        if (colConfig.filterType === FilterElementEnum.Calendar) {
            if (colConfig.columnName === fieldName.offerDate) {
                return (
                    <Calendar
                        value={valueCheck(event?.value, colConfig)}
                        onChange={(e) => {
                            let dates = e.value as Date[];
                            dates?.map((date) => moment(date).format('DD-MM-YYYY'));
                            event.filterApplyCallback(dates);
                        }}
                        placeholder="Select date range"
                        showButtonBar
                        dateFormat="dd/mm/yy"
                        selectionMode="range"
                        readOnlyInput
                    />
                );
            }
            return (
                <Calendar
                    value={valueCheck(event.value, colConfig)}
                    id="cal"
                    onChange={(e: CalendarChangeEvent) => event.filterApplyCallback(e?.value, colConfig)}
                    placeholder="Select date"
                    dateFormat="dd/mm/yy"
                    showButtonBar
                    readOnlyInput
                />
            );
        } else {
            return (
                <InputText
                    value={valueCheck(event.value, colConfig)}
                    onChange={(e) => event.filterApplyCallback(valueCheck(e.target.value, colConfig))}
                    placeholder={colConfig.filterPlaceholder}
                    className="p-column-filter filter-input"
                />
            );
        }
    };

    const noData = () => {
        return (
            <div>
                <div className="nodataRow">
                    <div>
                        <div className="offer-container">
                            <img src={imgNoResult} alt="" className="offer-no-result-img" />
                            <div className="mt-2">No results</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const dynamicColumns = inputTableConfig.columnConfig.map((colConfig: TableColumnConfigType) => {
        switch (colConfig.columnHeader) {
            case columnHeader.actions:
                return (
                    <Column
                        key={colConfig.columnName}
                        field={colConfig.columnName}
                        header={colConfig.columnHeader}
                        className="columnActionTemplate"
                        body={(rowData) =>
                            inputTableConfig.isCandidateGrid ? getCandidateActions(rowData) : getCompanyActions(rowData)
                        }
                    />
                );

            case columnHeader.candidateName:
                return (
                    <Column
                        key={colConfig.columnName}
                        field={colConfig.columnName}
                        header={colConfig.columnHeader}
                        sortable={colConfig.isSortable}
                        filter={areFiltersApplicable}
                        className="columnTemplate w-450"
                        showFilterMenu={false}
                        showClearButton={false}
                        filterElement={(e) => columnFilter(e, colConfig)}
                        body={(rowData) => getCandidateName(rowData)}
                    />
                );

            case columnHeader.companyName:
                return (
                    <Column
                        key={colConfig.columnName}
                        field={colConfig.columnName}
                        header={colConfig.columnHeader}
                        sortable={colConfig.isSortable}
                        filter={areFiltersApplicable}
                        className="columnTemplate w-450"
                        showFilterMenu={false}
                        showClearButton={false}
                        filterElement={(e) => columnFilter(e, colConfig)}
                        body={(rowData) => getCompanyName(rowData)}
                    />
                );

            case columnHeader.jobTitle:
                return (
                    <Column
                        key={colConfig.columnName}
                        field={colConfig.columnName}
                        header={colConfig.columnHeader}
                        sortable
                        filter={areFiltersApplicable}
                        className="columnTemplate w-450"
                        showFilterMenu={false}
                        showClearButton={false}
                        filterElement={(e) => columnFilter(e, colConfig)}
                        body={(rowData) => getJobTitleTemplte(rowData)}
                    />
                );

            default:
                return (
                    <Column
                        key={colConfig.columnName}
                        field={colConfig.columnName}
                        header={colConfig.columnHeader}
                        filter={areFiltersApplicable}
                        className="columnTemplate column-width"
                        sortable={colConfig.isSortable}
                        showFilterMenu={false}
                        showClearButton={false}
                        filterElement={(e: any) => columnFilter(e, colConfig)}
                    />
                );
        }
    });
    return (
        <div>
            <DataTable
                className="offer-table table table-hover mb-0"
                value={tableData}
                loading={inputTableConfig.isTableLoading}
                responsiveLayout="scroll"
                lazy={true}
                dataKey="data-table"
                onSelectionChange={(e) => onRowSelect(e.value)}
                emptyMessage={noData()}
                selectionMode="single"
                filterDisplay="row"
                removableSort={false}
                sortMode="single"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={(event: any) => {
                    onSort(event);
                }}
                filters={filters}
                onFilter={(e: any) => {
                    onFilter(e);
                }}
                paginator={true}
                totalRecords={inputTableConfig.totalRecords}
                first={pageNumber}
                rows={pageSize}
                rowsPerPageOptions={[10, 15, 25]}
                onPage={(e: any) => {
                    onPageChange(e);
                }}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                paginatorRight={paginatorRight}
                paginatorLeft={paginatorLeft}
                paginatorClassName="offers-grid"
            >
                {dynamicColumns}
            </DataTable>
        </div>
    );
};

export default Grid;
