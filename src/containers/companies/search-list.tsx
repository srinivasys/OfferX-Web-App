import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { Link, RouteComponentProps } from 'react-router-dom';
import history from '../../history';
import logo from '../../assets/img/logo.svg';
import { CompanyListRequestType, CompanyProfileType } from '../../types/company';
import { companyService } from '../../lib/api/company';
import { routes } from '../routes/routes-names';
import { generateLink } from '../../lib/utils/generate-link';
import PageLoader from '../../components/loader';
import FAQImg from '../../assets/img/faq-search-icon.png';
import { Rating } from 'react-simple-star-rating';

type Props = RouteComponentProps;

type ParamsType = {
    start?: number;
    limit?: number;
    searchParam?: string;
};

type FormDataType = {
    start: number;
    limit: number;
};

const defaultFormData = {
    start: 1,
    limit: 10,
};

const CompaniesSearchList: React.FC<Props> = ({ location }) => {
    const queryParams: ParamsType = queryString.parse(location.search);
    const { searchParam, start, limit } = queryParams;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<{
        items: CompanyProfileType[];
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
                } = await companyService.getList(createGlobalSearchParams(queryParams));
                setData({ items, count });
            } catch (err) {
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParam, start, limit]);

    return (
        <div>
            <div className="container">
                <div className="row my-3">
                    <div className="col offset-lg-2 text-start">
                        <h1 className="fw-700 fs-28">Company search</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-8 offset-lg-2">
                        <div className="card">
                            <div className="card-body">
                                <h1 className="fs-18 fw-700 mb-3">Companies</h1>

                                {loading ? (
                                    <PageLoader />
                                ) : data.items.length ? (
                                    <>
                                        {data.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="d-flex align-items-center li-review position-relative search-record"
                                            >
                                                <Link
                                                    to={generateLink(routes.company, { id: item.id })}
                                                    className="absolute-link"
                                                />
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.avatarUrl || logo}
                                                        alt=""
                                                        className="avatar avatar--sm"
                                                    />
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h1 className="fs-14 fw-700">{item.name}</h1>
                                                    <div className="fs-16">
                                                        <Rating
                                                            allowFraction={true}
                                                            size={15}
                                                            fillColor="#4EB6FF"
                                                            initialValue={item.rating.value}
                                                            transition={true}
                                                            emptyColor="transparent"
                                                            SVGstrokeColor="#4EB6FF"
                                                            SVGstorkeWidth="1"
                                                            readonly={true}
                                                            allowTitleTag={false}
                                                        />
                                                        <span className="fs-12">{item.reviewsCount} reviews</span>
                                                    </div>
                                                    <div className="fs-12">{item.industry}</div>
                                                    <div className="fs-10 text-capitalize">
                                                        {item.cityDistrict}, {item.state.toLowerCase()}
                                                    </div>
                                                </div>
                                                {item.suspendStatus == 1 && (
                                                    <div className="badge rounded-pill alert-info py-1 px-2 fs-12 fw-600 bd-highlight text-danger">
                                                        Account Suspended
                                                    </div>
                                                )}
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

export default CompaniesSearchList;

function createFormData(params: ParamsType): FormDataType {
    return {
        ...defaultFormData,
        ...(params.start && { start: Number(params.start) }),
        ...(params.limit && { limit: Number(params.limit) }),
    };
}

function createGlobalSearchParams(params: ParamsType): CompanyListRequestType {
    return {
        Start: Number(params.start) || defaultFormData.start,
        Limit: Number(params.limit) || defaultFormData.limit,
        'SearchParam.FilterValue': params.searchParam as string,
    };
}

function setParams(options: FormDataType, searchParam?: string) {
    const search = {
        start: options.start,
        limit: options.limit,
        searchParam,
    };
    history.push({ search: queryString.stringify(search) });
}
