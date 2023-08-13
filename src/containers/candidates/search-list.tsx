import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { Link, RouteComponentProps } from 'react-router-dom';
import { candidateService } from '../../lib/api/candidate';
import {
    CandidateAdvancedRequestType,
    CandidateGlobalRequestType,
    CandidateListType,
    OfferNextActionEnum,
} from '../../types/candidate';
import history from '../../history';
import { routes } from '../routes/routes-names';
import avatar from '../../assets/img/avatars.svg';
import { generateLink } from '../../lib/utils/generate-link';
import PageLoader from '../../components/loader';
import FAQImg from '../../assets/img/faq-search-icon.png';
import { SuspendEnum } from '../../types/suspension';
import { Rating } from 'react-simple-star-rating';
import { ExperienceLevelEnum } from '../../lib/constants/constants';

type Props = RouteComponentProps;

type ParamsType = {
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    cityDistrict?: string;
    state?: string;
    institutionName?: string;
    phone?: string;
    email?: string;
    start?: number;
    limit?: number;
    searchParam?: string;
};

type FormDataType = {
    firstName: string;
    lastName: string;
    jobTitle: string;
    cityDistrict: string;
    state: string;
    institutionName: string;
    phone: string;
    email: string;
    start: number;
    limit: number;
};

const defaultFormData = {
    firstName: '',
    lastName: '',
    jobTitle: '',
    cityDistrict: '',
    state: '',
    institutionName: '',
    phone: '',
    email: '',
    start: 1,
    limit: 10,
};

const CandidatesSearchList: React.FC<Props> = ({ location }) => {
    const queryParams: ParamsType = queryString.parse(location.search);
    const {
        searchParam,
        firstName,
        lastName,
        jobTitle,
        cityDistrict,
        state,
        institutionName,
        phone,
        email,
        start,
        limit,
    } = queryParams;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<{
        items: CandidateListType[];
        count: number;
    }>({ items: [], count: 0 });

    const [formData, setFormData] = useState<FormDataType>(defaultFormData);

    useEffect(() => {
        (async function () {
            setFormData(createFormData(queryParams));
            try {
                setLoading(true);
                const {
                    resultObject: { items, count },
                } = searchParam
                    ? await candidateService.getList(createGlobalSearchParams(queryParams))
                    : await candidateService.getListWithAnd(createAdvancedSearchParams(queryParams));
                setData({ items, count });
            } catch (err) {
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParam, firstName, lastName, jobTitle, cityDistrict, state, institutionName, phone, email, start, limit]);

    return (
        <div className="company-page-contener">
            <div className="container-fluid">
                <div className="row my-4">
                    <div className="col text-start">
                        <h1 className="fw-700 fs-20 mb-0">Advanced search</h1>
                    </div>
                </div>
                <div className="border-bottom mb-4 "></div>
                <div className="row">
                    <div className="col-md-4 col-12 position-relative border-right">
                        <div className="card sticky">
                            <div className="card-body ps-0 pt-0">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h1 className="fs-18 fw-700 mb-0">Search filter</h1>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-6 col-md-12 col-lg">
                                        <label htmlFor="firstName" className="fw-700 mb-1 fs-13">
                                            First name
                                        </label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(ev) =>
                                                setFormData({
                                                    ...formData,
                                                    firstName: ev.target.value,
                                                })
                                            }
                                            className="form-control form-control-sm"
                                            placeholder='Enter First name'
                                        />
                                    </div>
                                    <div className="col-6 col-md-12 col-lg">
                                        <label htmlFor="lastName" className="fw-700 mb-1 fs-13">
                                            Last name
                                        </label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(ev) =>
                                                setFormData({
                                                    ...formData,
                                                    lastName: ev.target.value,
                                                })
                                            }
                                            className="form-control form-control-sm"
                                            placeholder='Enter Last name'
                                        />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col">
                                        <label htmlFor="jobTitle" className="fw-700 mb-1 fs-13">
                                            Job title
                                        </label>
                                        <input
                                            id="jobTitle"
                                            type="text"
                                            value={formData.jobTitle}
                                            onChange={(ev) =>
                                                setFormData({
                                                    ...formData,
                                                    jobTitle: ev.target.value,
                                                })
                                            }
                                            className="form-control form-control-sm"
                                            placeholder='Enter Job title'
                                        />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col">
                                        <label htmlFor="phone" className="fw-700 mb-1 fs-13">
                                            Phone number
                                        </label>
                                        <input
                                            id="phone"
                                            type="text"
                                            value={formData.phone}
                                            onChange={(ev) =>
                                                setFormData({
                                                    ...formData,
                                                    phone: ev.target.value,
                                                })
                                            }
                                            className="form-control form-control-sm"
                                            placeholder='Enter Phone number'
                                        />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col">
                                        <label htmlFor="email" className="fw-700 mb-1 fs-13">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="text"
                                            value={formData.email}
                                            onChange={(ev) =>
                                                setFormData({
                                                    ...formData,
                                                    email: ev.target.value,
                                                })
                                            }
                                            className="form-control form-control-sm"
                                            placeholder='Enter Email'
                                        />
                                    </div>
                                </div>
                                {/*<div className="row mb-0">
                                    <div className="col">
                                        <label htmlFor="Location" className="fw-700 mb-0 fs-13">
                                            Location
                                        </label>
                                        <input id="Location" type="text" className="form-control form-control-sm" />
                                    </div>
                                </div>*/}
                                <div className="row mb-2">
                                    <div className="col">
                                        <label htmlFor="cityDistrict" className="fw-700 mb-1 fs-13">
                                            City/District
                                        </label>
                                        <input
                                            id="cityDistrict"
                                            type="text"
                                            value={formData.cityDistrict}
                                            onChange={(ev) =>
                                                setFormData({
                                                    ...formData,
                                                    cityDistrict: ev.target.value,
                                                })
                                            }
                                            className="form-control form-control-sm"
                                            placeholder='Enter City/District'
                                        />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="state" className="fw-700 mb-1 fs-13">
                                            State
                                        </label>
                                        <input
                                            id="state"
                                            type="text"
                                            value={formData.state.toString().toLowerCase()}
                                            onChange={(ev) =>
                                                setFormData({
                                                    ...formData,
                                                    state: ev.target.value,
                                                })
                                            }
                                            className="form-control form-control-sm text-camel-case"
                                            placeholder='Enter State'
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="institutionName" className="fw-700 mb-1 fs-13">
                                            Institution name
                                        </label>
                                        <input
                                            id="institutionName"
                                            type="text"
                                            value={formData.institutionName}
                                            onChange={(ev) =>
                                                setFormData({
                                                    ...formData,
                                                    institutionName: ev.target.value,
                                                })
                                            }
                                            className="form-control form-control-sm"
                                            placeholder='Enter Institution name '
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        {firstName ||
                                        lastName ||
                                        jobTitle ||
                                        cityDistrict ||
                                        state ||
                                        institutionName ||
                                        phone ||
                                        email ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setParams(defaultFormData);
                                                }}
                                                className="btn btn-outline-primary outline-p-hover w-100"
                                            >
                                                Reset
                                            </button>
                                        ) : (
                                            <button type="button" disabled className="btn btn-outline-primary w-100">
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                    <div className="col">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newOptions = {
                                                    ...formData,
                                                    start: defaultFormData.start,
                                                    limit: defaultFormData.limit,
                                                };
                                                setParams(newOptions);
                                            }}
                                            className="btn btn-primary w-100"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 col-12 mt-4 mt-md-0">
                        <div className="card mb-3">
                            <div className="card-body pe-0 pt-0">
                                <h1 className="fs-18 fw-700 mb-3">Candidates</h1>

                                {loading ? (
                                    <PageLoader />
                                ) : data.items.length !== 0 ? (
                                    <>
                                        {data.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="d-sm-flex align-items-center li-review position-relative search-record"
                                            >
                                                <div className="d-flex align-items-center flex-grow-1">
                                                    <Link
                                                        to={generateLink(routes.candidate, { id: item.id })}
                                                        className="absolute-link"
                                                    />
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={item.avatarUrl || avatar}
                                                            alt=""
                                                            className="avatar avatar--sm"
                                                        />
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h1 className="fs-14 fw-700 text-capitalize mb-0">
                                                            {item.firstName.toLowerCase()} {item.lastName.toLowerCase()}
                                                        </h1>
                                                        <div className="">
                                                            <Rating
                                                                allowFraction={true}
                                                                size={15}
                                                                fillColor="#4EB6FF"
                                                                initialValue={item.rating}
                                                                transition={true}
                                                                emptyColor="transparent"
                                                                SVGstrokeColor="#4EB6FF"
                                                                SVGstorkeWidth="1"
                                                                readonly={true}
                                                                allowTitleTag={false}
                                                            />
                                                            <span className="fs-12 ms-1">
                                                                {item.reviewsCount} review
                                                                {item.reviewsCount != 1 && 's'}
                                                            </span>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <div className="fs-12 text-capitalize">{item.experienceLevel == ExperienceLevelEnum.Experienced ? item.jobTitle : ExperienceLevelEnum[ExperienceLevelEnum.Fresher] }</div>
                                                            <i className="bi bi-dot fs-14 mx-1"></i>
                                                            <div className="fs-12 text-capitalize">
                                                                {item.cityDistrict} {item.state.toLowerCase()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="flex-shrink-0 position-relative text-center  lt-search-results"
                                                    style={{ zIndex: 2 }}
                                                >
                                                    {item.suspendedStatus === SuspendEnum.active &&
                                                        (!!item.allCompaniesAcceptedOffersCount ||
                                                            item.currentCompanyLastEventShortText) && (
                                                            <div className="py-2">
                                                                {!!item.allCompaniesAcceptedOffersCount && (
                                                                    <span className="fw-600 fs-12 d-block">
                                                                        <span className="lt-tooltip">
                                                                            <span className="lt-tooltiptext fw-400 fs-12">
                                                                                It displays the total number of accepted
                                                                                offers of this candidate in OfferX.
                                                                            </span>
                                                                            <i className="bi bi-info-circle lt-text-warning" />
                                                                        </span>
                                                                        <span className="lt-text-warning">
                                                                            {item.allCompaniesAcceptedOffersCount}{' '}
                                                                            accepted offer
                                                                            {item.allCompaniesAcceptedOffersCount > 1 &&
                                                                                's'}
                                                                        </span>
                                                                    </span>
                                                                )}
                                                                {item.currentCompanyLastEventShortText && (
                                                                    <span className="fw-600 fs-12 d-block">
                                                                        {item.currentCompanyLastEventDetailedText && (
                                                                            <span className="lt-tooltip">
                                                                                <span className="lt-tooltiptext fw-400 fs-12">
                                                                                    {item.currentCompanyLastEventDetailedText.substring(
                                                                                        0,
                                                                                        60
                                                                                    )}
                                                                                </span>
                                                                                <i className="bi bi-info-circle text-primary" />
                                                                            </span>
                                                                        )}
                                                                        <span className="text-primary text-capitalize">
                                                                            {item.currentCompanyLastEventShortText}
                                                                        </span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    {item.suspendedStatus === SuspendEnum.active ? (
                                                        <div className="lt-tooltip">
                                                            {item.currentCompanyOfferNextAvailableAction ===
                                                                OfferNextActionEnum.noActionAvailable && (
                                                                <span className="lt-tooltiptext lt-tooltiptext--bottom fs-12">
                                                                    There is already an accepted offer for this
                                                                    candidate and your company.
                                                                </span>
                                                            )}
                                                            <Link
                                                                to={queryString.stringifyUrl({
                                                                    url: routes.releaseOffer,
                                                                    query: {
                                                                        candidate: item.id,
                                                                        ...(item.reOfferId && {
                                                                            offerId: item.reOfferId,
                                                                        }),
                                                                    },
                                                                })}
                                                                className={`btn btn-sm btn-outline-primary ox-offer-btn ${
                                                                    item.currentCompanyOfferNextAvailableAction ===
                                                                    OfferNextActionEnum.noActionAvailable
                                                                        ? 'btn-disabled disabled'
                                                                        : ''
                                                                }`}
                                                            >
                                                                {item.currentCompanyOfferNextAvailableAction ===
                                                                OfferNextActionEnum.reOffer
                                                                    ? <span><i className='bi bi-pencil'></i> Revise offer</span>
                                                                    : <span><i className='bi bi-file-earmark-text'></i> Release an offer</span>}
                                                            </Link>
                                                        </div>
                                                    ) : (
                                                        <div className="text-danger fs-12">Account suspended</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="row mt-3">
                                            <div className="col-12 col-sm">
                                                <label>Items per page:</label>
                                                <select
                                                    value={String(formData.limit)}
                                                    onChange={(ev) => {
                                                        const newOptions = {
                                                            ...formData,
                                                            limit: Number(ev.target.value),
                                                            start: 1,
                                                        };
                                                        setParams(newOptions, searchParam);
                                                    }}
                                                    className="items-selecter"
                                                >
                                                    <option value="10">10</option>
                                                    <option value="15">15</option>
                                                    <option value="25">25</option>
                                                </select>
                                            </div>
                                            <div className="col-12 col-sm text-sm-end mt-2 mt-sm-0">
                                                <label htmlFor="">
                                                    Page {Math.ceil(formData.start / formData.limit)} of{' '}
                                                    {Math.ceil(data.count / formData.limit)}
                                                </label>
                                                {Math.ceil(formData.start / formData.limit) > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newOptions = {
                                                                ...formData,
                                                                start: formData.start - formData.limit,
                                                            };
                                                            setParams(newOptions, searchParam);
                                                        }}
                                                        className="lt-action-btn"
                                                    >
                                                        <i className="bi bi-chevron-left" />
                                                    </button>
                                                )}
                                                {formData.start + formData.limit <= data.count && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newOptions = {
                                                                ...formData,
                                                                start: formData.start + formData.limit,
                                                            };
                                                            setParams(newOptions, searchParam);
                                                        }}
                                                        className="lt-action-btn"
                                                    >
                                                        <i className="bi bi-chevron-right" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center my-5 py-5">
                                        <div className="text-center">
                                            <img
                                                src={FAQImg}
                                                alt="We could not find results for your search"
                                                className="ox-no-search-img"
                                            />
                                            <p className="fs-14">
                                                We could not find results for your search. Please try another search.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidatesSearchList;

function createFormData(params: ParamsType): FormDataType {
    return {
        ...defaultFormData,
        ...(params.firstName && { firstName: params.firstName }),
        ...(params.lastName && { lastName: params.lastName }),
        ...(params.jobTitle && { jobTitle: params.jobTitle }),
        ...(params.cityDistrict && { cityDistrict: params.cityDistrict }),
        ...(params.state && { state: params.state }),
        ...(params.institutionName && { institutionName: params.institutionName }),
        ...(params.phone && { phone: params.phone }),
        ...(params.email && { email: params.email }),
        ...(params.start && { start: Number(params.start) }),
        ...(params.limit && { limit: Number(params.limit) }),
    };
}

function createGlobalSearchParams(params: ParamsType): CandidateGlobalRequestType {
    return {
        Start: Number(params.start) || defaultFormData.start,
        Limit: Number(params.limit) || defaultFormData.limit,
        'SearchParam.FilterValue': params.searchParam as string,
    };
}

function createAdvancedSearchParams(params: ParamsType): CandidateAdvancedRequestType {
    return {
        Start: Number(params.start) || defaultFormData.start,
        Limit: Number(params.limit) || defaultFormData.limit,
        ...(params.firstName && { 'FirstName.FilterValue': params.firstName }),
        ...(params.lastName && { 'LastName.FilterValue': params.lastName }),
        ...(params.jobTitle && { 'JobTitle.FilterValue': params.jobTitle }),
        ...(params.cityDistrict && { 'CityDistrict.FilterValue': params.cityDistrict }),
        ...(params.state && { 'State.FilterValue': params.state }),
        ...(params.institutionName && { 'InstitutionName.FilterValue': params.institutionName }),
        ...(params.phone && { 'Phone.FilterValue': params.phone }),
        ...(params.email && { 'Email.FilterValue': params.email }),
    };
}

function setParams(options: FormDataType, searchParam?: string) {
    const search = {
        start: options.start,
        limit: options.limit,
        ...(searchParam
            ? {
                  searchParam,
              }
            : {
                  ...(options.firstName && { firstName: options.firstName }),
                  ...(options.lastName && { lastName: options.lastName }),
                  ...(options.jobTitle && { jobTitle: options.jobTitle }),
                  ...(options.cityDistrict && { cityDistrict: options.cityDistrict }),
                  ...(options.state && { state: options.state }),
                  ...(options.institutionName && { institutionName: options.institutionName }),
                  ...(options.phone && { phone: options.phone }),
                  ...(options.email && { email: options.email }),
              }),
    };
    history.push({ search: queryString.stringify(search) });
}
