import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { components, OptionProps, SingleValueProps, SingleValue, MultiValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { routes } from '../../containers/routes/routes-names';
import history from '../../history';
import { generateLink } from '../../lib/utils/generate-link';
import { companyService } from '../../lib/api/company';
import { CompanyListRequestType, CompanyProfileType } from '../../types/company';
import { LsCompanyType } from '../../types/local-storage';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { UserType } from '../../types/auth';
import FAQImg from '../../assets/img/faq-search-icon.png';

type CandidateSelectProps = {
    value?: SingleValue<OptionType>;
};

type OptionType = CompanyProfileType & {
    value: string;
};

const CompanySelect: React.FC<CandidateSelectProps> = ({ value: valueProps }) => {
    const { user } = useSelector((state: RootState) => state.user);
    const hasUser = user as UserType;
    const ref = useRef<any>(null);
    const { current } = ref;
    const [searchValue, setSearchValue] = useState('');
    const [value, setValue] = useState<SingleValue<OptionType> | MultiValue<OptionType> | null>(valueProps || null);
    const [open, setOpen] = useState(false);

    const handleChange = useCallback(
        (value: SingleValue<OptionType> | MultiValue<OptionType>) => {
            const hasValue = value as SingleValue<OptionType>;
            if (hasValue) {
                companyClick(hasValue, hasUser.id);
                setValue(null);
                current.props.setSearchValue('');
            }
            current && current.blur();
            open && setOpen(false);
        },
        [current, open, hasUser.id]
    );

    const props = useMemo(() => {
        return {
            value,
            searchValue,
            setSearchValue,
            currentRef: current,
            placeholder: 'Search company, location...',
            className: 'react-select',
            classNamePrefix: 'react-select',
            isClearable: true,
            onChange: handleChange,
            setOpen: setOpen,
            setValue: setValue,
            cacheOptions: true,
            userId: hasUser.id,
            onFocus: () => {
                setOpen(true);
            },
            onBlur: () => setOpen(false),
            menuIsOpen: open,
            components: { Option: CustomSelectOption, SingleValue: CustomSelectValue, Menu: CustomMenu },
        };
    }, [value, open, handleChange, current, searchValue, hasUser.id]);

    const keyDown = useCallback(
        (ev: KeyboardEvent) => {
            const { keyCode } = ev;
            if (searchValue && current && keyCode === 13) {
                history.push(getSearchLink(searchValue));
                current.props.setSearchValue('');
                current.props.currentRef.blur();
            }
        },
        [searchValue, current]
    );

    useEffect(() => {
        document.addEventListener('keydown', keyDown);
        return () => {
            document.removeEventListener('keydown', keyDown);
        };
    }, [keyDown]);

    return (
        <div className="offer-select offer-select--header">
            <div className="offer-select__input">
                <AsyncSelect
                    ref={ref}
                    {...props}
                    loadOptions={loadOptions}
                    onInputChange={(value) => value && setSearchValue(value)}
                />
            </div>
            <div className="offer-select__btn">
                <a className={`${!searchValue ? 'disabled' : ''}`} type="button">
                    <i className="bi bi-search" />
                </a>
            </div>
        </div>
    );
};

const loadOptions = debounce(
    (value: string, callback: (options: OptionType[]) => void) => {
        (async function () {
            const params: CompanyListRequestType = {
                Start: 0,
                Limit: 5,
                'SearchParam.FilterValue': value,
            };
            try {
                const {
                    resultObject: { items },
                } = await companyService.getList(params);
                callback(
                    items.map((profile) => ({
                        ...profile,
                        value: profile.id,
                    }))
                );
            } catch (err) {
            }
        })();
    },
    500,
    { leading: true }
);

const CustomSelectValue = (props: SingleValueProps<OptionType, any>) => (
    <components.SingleValue {...props}>{props.data.name}</components.SingleValue>
);

const CustomSelectOption = (props: OptionProps<OptionType, any>) => (
    <components.Option {...props}>
        <MenuItem item={props.data} />
    </components.Option>
);

const CustomMenu = (props: any) =>
    props.options.length || getLsItems(props.selectProps.userId).length ? (
        <components.Menu {...props}>
            {props.children}

            {!props.options.length && !props.isLoading && props.selectProps.inputValue && (
                <div className="react-select-no-results fs-14 my-2">
                    <div className="d-flex align-items-center justify-content-center py-1">
                        <div className="text-center">
                            <img
                                src={FAQImg}
                                alt="We could not find results for your search"
                                className="ox-no-search-img"
                            />
                            <p className="fs-14">No results found. Try with another search.</p>
                        </div>
                    </div>
                </div>
            )}

            {!props.options.length && getLsItems(props.selectProps.userId).length && (
                <div className="react-select-recent">
                    <h2 className="fs-16 fw-600">Recent searches</h2>
                    <div className="react-select-recent__list pb-4">
                        {getLsItems(props.selectProps.userId)
                            .slice(0, 5)
                            .map((item: LsCompanyType) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        companyClick(item, props.selectProps.userId);
                                        props.selectProps.currentRef.blur();
                                    }}
                                    className="react-select-recent__list-item"
                                >
                                    <div className="react-select-recent-item">
                                        <div
                                            className="react-select-recent-item__avatar react-select-recent-item__avatar--company"
                                            style={
                                                item.avatarUrl
                                                    ? { backgroundImage: `url('${item.avatarUrl}')` }
                                                    : undefined
                                            }
                                        />
                                        <div className="react-select-recent-item__name text-capitalize fs-14">
                                            {item.name.toLowerCase()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
            {props.options.length !== 0 && (
                <div className="react-select-menu-btn">
                    <Link
                        to={getSearchLink(props.selectProps.inputValue)}
                        onClick={() => {
                            props.selectProps.searchValue && props.selectProps.setSearchValue('');
                            props.selectProps.currentRef.blur();
                        }}
                        className="btn btn-outline-primary btn-block mt-3"
                    >
                        See more results
                    </Link>
                </div>
            )}
        </components.Menu>
    ) : null;

const MenuItem: React.FC<{ item: CompanyProfileType }> = ({ item }) => (
    <div className="react-select-option-item">
        <div
            className="react-select-option-item__avatar react-select-option-item__avatar--company"
            style={item.avatarUrl ? { backgroundImage: `url('${item.avatarUrl}')` } : undefined}
        />
        <div className="react-select-option-item__name lt-select-option-item__name text-capitalize">
            {item.name.toLowerCase()}
        </div>
        {item.industry && (
            <>
                <div className="ms-2 me-2">&bull;</div>
                <div className="react-select-option-item__details">{item.industry}</div>
            </>
        )}
        <div className="ms-2 me-2 d-none d-sm-inline">&bull;</div>
        <div className="react-select-option-item__details react-select-option-item__details--ellipsis text-capitalize">
            {item.cityDistrict}, {item.state.toLowerCase()}
        </div>
    </div>
);

export default CompanySelect;

function companyClick(currentItem: CompanyProfileType | LsCompanyType, userId: string) {
    const recentItemsJson = localStorage.getItem(`recentSearch-${userId}`);
    const recentItems: LsCompanyType[] = recentItemsJson ? JSON.parse(recentItemsJson) : [];
    const filteredRecentItems = recentItems.filter((item) => item.id !== currentItem.id);
    filteredRecentItems.unshift({
        id: currentItem.id,
        name: currentItem.name,
        cityDistrict: currentItem.cityDistrict,
        state: currentItem.state,
        avatarUrl: currentItem.avatarUrl,
        industry: currentItem.industry,
    });
    localStorage.setItem(`recentSearch-${userId}`, JSON.stringify(filteredRecentItems));
    history.push(generateLink(routes.company, { id: currentItem.id }));
}

export function getLsItems(userId: string) {
    const recentItems = localStorage.getItem(`recentSearch-${userId}`);
    return recentItems ? JSON.parse(recentItems) : [];
}

function getSearchLink(value: string) {
    return queryString.stringifyUrl({
        url: routes.companies,
        query: value
            ? {
                  searchParam: value,
              }
            : {},
    });
}
