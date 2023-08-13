

export const GridConstants = {
    AreFiltersApplicable: 'areFiltersApplicable',
    PageSize: 'pageSize',
    CurrentPage: 'currentPage',
    SortColumn: 'sortColumn',
    GlobalSearch: 'globalSearch',
    StartDate: 'startDate',
    EndDate: 'endDate',
    True: 'true',
};

export const NotificationConstants = {
    DayLimit: 30,
};

export enum ExperienceLevelEnum {
    Fresher,
    Experienced,

}

export const personalAccountDomains = ['@gmail.', '@hotmail.', '@live.', '@outlook.'];

export const getEmailDomainWithDot = (email: string ) =>{
    let indexOfAt = email.lastIndexOf('@');
    let indexOfDot = email.lastIndexOf('.');
    return email.slice(indexOfAt, indexOfDot+1);
};

