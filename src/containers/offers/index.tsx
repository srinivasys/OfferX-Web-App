import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { routes } from '../routes/routes-names';
import ManagerTableOffers from './manager/table';
import { RootState } from '../../redux';
import { UserResponseType, UserRoleEnum, UserType } from '../../types/auth';
import { offerService } from '../../lib/api/offer';
import { OfferDataType, OfferListRquestType, OfferStateEnum } from '../../types/offer';
import CandidateTableOffers from './candidate/table';
import DatePickerComponent from '../../components/date-picker';
import Context from '../../context/update';
import { GridConstants } from '../../lib/constants/constants';
import _ from 'lodash';
import { defaultPaginationParams, fieldName, TableFilterType, TableLazyParamsType } from '../../types/grid';
import moment from 'moment';
import { getUser } from '../../redux/user';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../../lib/api/auth';

const Offers = () => {
  
    const [isTableLoading, setTableLoading] = useState(true);
    const [data, setData] = useState<OfferDataType[]>([]);
    const [userData, setUserData] = useState<UserResponseType>();
    const [offersCount, setOffersCount] = useState<number>(0);
    const location = useLocation();
    const { user } = useSelector((state: RootState) => state.user);
    const hasUser = user as UserType;
   

    const getCurrentState = (path: any) => {
        switch (path) {
            case 'pending':
                return OfferStateEnum.pending;
            case 'accepted':
                return OfferStateEnum.accepted;
            case 'rejected':
            case 'declined':
                return OfferStateEnum.rejected;
            case 'retracted':
                return OfferStateEnum.retracted;
            case 'expired':
                return OfferStateEnum.expired;
            case 'onboarded':
                return OfferStateEnum.onboarded;
            case 'ghosted':
                return OfferStateEnum.ghosted;
            default:
                return OfferStateEnum.pending;
        }
    };

    const [offerState, setOfferState] = useState<OfferStateEnum>(getCurrentState(location.pathname.split('/').pop()));
    const queryParams: any = {
        state: offerState,
        start:sessionStorage.getItem("Page_number") ? Number(sessionStorage.getItem("Page_number"))+1 : defaultPaginationParams.pageNumber,
        limit: defaultPaginationParams.pageSize,
        sortField: sessionStorage.getItem("Sort_field")? String(sessionStorage.getItem("Sort_field")) : 'offerDate',
        sortOrder: sessionStorage.getItem("Sort_order")? Number(sessionStorage.getItem("Sort_order")) : -1,
        filters: sessionStorage.getItem("Filter_value")?JSON.parse(sessionStorage.getItem("Filter_value")||"0"):''
        
    };

    const onLazyParamChange = (lazyParams: TableLazyParamsType) => {
        let prevQueryParams = {};
        Object.assign(queryParams, prevQueryParams);
        queryParams.state = offerState;
        queryParams.start = lazyParams.pageNumber + 1;
        queryParams.limit = lazyParams.pageSize;
        queryParams.sortField = lazyParams.sort.sortField;
        queryParams.sortOrder = lazyParams.sort.sortOrder;
        
        lazyParams.filters?.forEach((filter: TableFilterType) => {
            if (filter.columnName == fieldName.offerDate) {
                if (filter?.value?.length > 1) {
                    queryParams.offerStartDate = moment(filter?.value[0]).format('YYYY-MM-DD')
                    if (filter?.value[1] == null)
                    {
                        queryParams.offerEndDate = moment(filter?.value[0]).format('YYYY-MM-DD')

                    }
                    else{
                        queryParams.offerEndDate = moment(filter?.value[1]).format('YYYY-MM-DD');

                    }
                    
                } else if (filter?.value) queryParams[filter.columnName] = filter?.value[0];
            } 
            else queryParams[filter.columnName] = filter?.value;
        });
        if (!_.isEqual(queryParams, prevQueryParams)) {
            getOffersList();
            getUserOfferCount();
        }
    };
    const getOffersList = async () => {
        setTableLoading(true);
        try {
            const {
                resultObject: { items, count },
            } = await offerService.getList(queryParams);
            setOffersCount(count);
            setData(items);
        } catch (err) {
        } finally {
            setTimeout(() => {
                setTableLoading(false);
            }, 800);
        }
    };

    const  getUserOfferCount = async() =>
     {
            try {
                const resultObject= await authService.getUser();
               
            setUserData(resultObject)
            } catch (err) {
            } finally {

            }
;
    }

    useEffect(() => {
        getOffersList();
        getUserOfferCount();
    }, [offerState]);

    useEffect(() => {
        setOfferState(getCurrentState(location.pathname.split('/').pop()));
    }, [location]);


    

   

    return (
        <Context.Provider value={{ updateOffersList: getOffersList, updateOffersCount: getUserOfferCount }}>
          
            <div
                className={
                    hasUser.role === UserRoleEnum.manager
                        ? 'my-3 d-flex align-items-center company-job-offer'
                        : 'my-3 d-flex align-items-center'
                }
            >
                <div className="flex-grow-1 text-start">
                    <h1 className="fw-700 fs-20 mb-0 lt-text-secondary">Job offers</h1>
                </div>
                <div className="border-bottom"></div>

                {hasUser.role === UserRoleEnum.manager && (
                    <div className="text-end ps-2">
                        <Link to={routes.releaseOffer} className="btn btn-primary">
                            <i className='bi bi-file-earmark-text me-1'></i> Release an offer
                        </Link>
                    </div>
                )}
            </div>
            <>
                {hasUser.role === UserRoleEnum.manager ? (
                    <ManagerTableOffers
                        offers={data}
                        isTableLoading={isTableLoading}
                        offersCount={offersCount}
                        offerState={offerState}
                        onLazyParamChange={onLazyParamChange}
                        PendingOfferCount = {userData?.resultObject.pendingOfferCount}
                        AcceptedOfferCount = {userData?.resultObject.acceptedOfferCount}
                        OnboardedOfferCount = {userData?.resultObject.onboardedOfferCount}
                        GhostedOfferCount = {userData?.resultObject.ghostedOfferCount}
                        DeclinedOfferCount = {userData?.resultObject.declinedOfferCount}
                        RetractedOfferCount = {userData?.resultObject.retractedOfferCount}
                        ExpiredOfferCount = {userData?.resultObject.expiredOfferCount}
                    />
                ) : (
                    <CandidateTableOffers
                        offers={data}
                        isTableLoading={isTableLoading}
                        offersCount={offersCount}
                        offerState={offerState}
                        onLazyParamChange={onLazyParamChange}
                        PendingOfferCount = {userData?.resultObject.pendingOfferCount}
                        AcceptedOfferCount = {userData?.resultObject.acceptedOfferCount}
                        OnboardedOfferCount = {userData?.resultObject.onboardedOfferCount}
                        GhostedOfferCount = {userData?.resultObject.ghostedOfferCount}
                        DeclinedOfferCount = {userData?.resultObject.declinedOfferCount}
                        RetractedOfferCount = {userData?.resultObject.retractedOfferCount}
                        ExpiredOfferCount = {userData?.resultObject.expiredOfferCount}
                    />
                )}
            </>
        </Context.Provider>
    );
};

export default Offers;
