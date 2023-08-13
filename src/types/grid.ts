import { OfferStateEnum } from './offer';

export const placeholder = {
    searchCandidateName: 'Search candidate name',
    searchCompanyName: 'Search company name',
    searchJobTitle: 'Search job title',
};

export const actionsIcons = {
    file: 'bi bi-file-earmark-text',
    pencil: 'bi bi-pencil text-success',
    chatText: 'bi bi-chat-left-text',
    circleDanger: 'bi bi-x-circle text-danger',
};

export const fieldName = {
    offerDate: 'offerDate',
    jobTitle: 'jobTitle',
    jobStartDate: 'jobStartDate',
    candidateName: 'candidateName',
    companyName: 'companyName',
    actions: 'actions',
    acceptedDate: 'acceptedDate',
    offerExpiryDate: 'offerExpiryDate',
    rejectedDate: 'rejectedDate',
    retractedDate: 'retractedDate',
};

export enum TableActionEnum {
    OpenOfferLetter = 'Open offer letter',
    ReleaseOffer = 'release offer',
    ReOffer = 'Reoffer',
    RetractOffer = 'Retract offer',
    WriteReview = 'Write a review',
}

export enum TableActionVisbilityEnum {
    Visibile,
    Hidden,
    Disabled,
}

export type TableActionType = {
    tooltip?: string;
    action: TableActionEnum;
    actionMethod: (rowData: any) => void;
    actionIcon: string;
    onCheckActionVisibility?: (action: TableActionEnum, rowData: any) => TableActionVisbilityEnum;
};

export enum FilterElementEnum {
    InputText,
    Calendar,
}

export enum GridSortEnum {
    Asc = 1,
    Desc = -1,
}

export type TableSortType = {
    sortField: string;
    sortOrder: GridSortEnum;
};

export type TableFilterType = {
    columnName: string;
    value: string;
};

export type TableColumnConfigType = {
    columnName: string;
    columnHeader: string;
    isSortable: boolean;
    isFilterable: boolean;
    sortField?: string;
    sortOrder?: number;
    filterType?: FilterElementEnum;
    filterPlaceholder?: string;
    isActions?: true;
    actions?: TableActionType[];
    transformColumnData?: (columnName: string, rowData: any) => string;
    getColumnClassName?: (columnName: string, rowData: any) => string;
};

export type ApiSortType = {
    columnName: string;
    isDesc: boolean;
};

export type TableLazyParamsType = {
    filters: TableFilterType[];
    sort: TableSortType;
    pageNumber: number;
    pageSize: number;
};

export type TableConfigType = {
    defaultPageSize: number;
    columnConfig: TableColumnConfigType[];
    defaultFilterFields?: TableFilterType[] | null;
    totalRecords: number;
    isTableLoading: boolean;
    isCandidateGrid: boolean;
    digioReady?: boolean;
    loadingSign?: any;
    onLazyParamChange: (lazyParams: TableLazyParamsType) => void;
    setActiveOffer?: (offer: any) => void;
    setLoadingSign?: (id: any) => void;
    setRetractModal?: (offer: any) => void;
};

export type GridProps = {
    data: any[];
    inputTableConfig: TableConfigType;
    offerState: OfferStateEnum;
};

export const columnHeader = {
    candidateName: 'Candidate name',
    companyName: 'Company name',
    jobTitle: 'Job title',
    offerDate: 'Offer date',
    acceptedDate: 'Accepted date',
    declinedDate: 'Declined date',
    retractedDate: 'Retracted date',
    jobStartDate: 'Job start date',
    actions: 'Actions',
};

export const defaultPaginationParams = {
    pageSize: 10,
    rowsPerPage: [10, 15, 25],
    pageNumber: 0,
};
