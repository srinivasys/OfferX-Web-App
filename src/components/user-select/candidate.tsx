import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { components, OptionProps, SingleValueProps, SingleValue, MultiValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { routes } from '../../containers/routes/routes-names';
import { candidateService } from '../../lib/api/candidate';
import { CandidateGlobalRequestType, CandidateListType } from '../../types/candidate';
import history from '../../history';
import { generateLink } from '../../lib/utils/generate-link';
import { LsCandidateType } from '../../types/local-storage';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { UserType } from '../../types/auth';
import FAQImg from '../../assets/img/faq-search-icon.png';
import { SuspendEnum } from '../../types/suspension';
import { Rating } from 'react-simple-star-rating';
import { ExperienceLevelEnum } from '../../lib/constants/constants';

type CandidateSelectProps = {
    value?: SingleValue<OptionType>;
    header?: boolean;
    onChange?: (option: SingleValue<OptionType> | MultiValue<OptionType>) => void;
    disabled?: boolean;
    candidateSearch?: boolean;
};

type OptionType = CandidateListType & {
    value: string;
};

const CandidateSelect: React.FC<CandidateSelectProps> = ({
    header,
    onChange,
    value: valueProps,
    disabled,
    candidateSearch,
}) => {
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
            if (header && hasValue) {
                candidateClick(hasValue, hasUser.id);
                setValue(null);
                current.props.setSearchValue('');
            }
            if (onChange) {
                setValue(hasValue);
                onChange(hasValue);
            }
            current && current.blur();
            open && setOpen(false);
        },
        [onChange, header, current, open, hasUser.id]
    );

    const props = useMemo(() => {
        return {
            value,
            searchValue,
            setSearchValue,
            currentRef: current,
            placeholder: header ? 'Search by candidate name, job title...' : 'Search by candidate name, job title...',
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
            isDisabled: disabled,
        };
    }, [header, value, open, handleChange, current, searchValue, disabled, hasUser.id]);

    const keyDown = useCallback(
        (ev: KeyboardEvent) => {
            if (header) {
                const { keyCode } = ev;
                if (searchValue && current && keyCode === 13) {
                    history.push(getSearchLink(searchValue));
                    current.props.setSearchValue('');
                    current.props.currentRef.blur();
                }
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

    const loadOptions = debounce(
        (value: string, callback: (options: OptionType[]) => void) => {
            (async function () {
                const params: CandidateGlobalRequestType = {
                    Start: 0,
                    Limit: 5,
                    'SearchParam.FilterValue': value,
                };
                try {
                    const {
                        resultObject: { items },
                    } = await candidateService.getList(params);
                    if (candidateSearch) {
                        callback(
                            items
                                .filter((user) => user.suspendedStatus === SuspendEnum.active)
                                .map((profile) => ({
                                    ...profile,
                                    value: profile.id,
                                }))
                        );
                    } else {
                        callback(
                            items.map((profile) => ({
                                ...profile,
                                value: profile.id,
                            }))
                        );
                    }
                } catch (err) {
                }
            })();
        },
        500,
        { leading: true }
    );
    return (
        <div className={`offer-select ${header ? 'offer-select--header' : 'offer-select--page'}`}>
            <div className="offer-select__input">
                <AsyncSelect
                    ref={ref}
                    {...props}
                    loadOptions={loadOptions}
                    onInputChange={(value) => value && setSearchValue(value)}
                />
            </div>
            {header && (
                <div className="offer-select__btn">
                    <a className={`${!searchValue ? 'disabled' : ''}`} type="button">
                        <i className="bi bi-search" title="Search" />
                    </a>
                </div>
            )}
        </div>
    );
};

const CustomSelectValue = (props: SingleValueProps<OptionType, any>) => (
    <components.SingleValue {...props}>
        {props.data.firstName} {props.data.lastName}
    </components.SingleValue>
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
                    <div className="react-select-recent__list">
                        {getLsItems(props.selectProps.userId)
                            .slice(0, 5)
                            .map((item: LsCandidateType) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        candidateClick(item, props.selectProps.userId);
                                        props.selectProps.currentRef.blur();
                                    }}
                                    className="react-select-recent__list-item"
                                >
                                    <div className="react-select-recent-item">
                                        <div
                                            className="react-select-recent-item__avatar"
                                            style={
                                                item.avatarUrl
                                                    ? { backgroundImage: `url('${item.avatarUrl}')` }
                                                    : undefined
                                            }
                                        />
                                        <div className="react-select-recent-item__name text-capitalize fs-14">
                                            {item.firstName.toLowerCase()} {item.lastName.toLowerCase()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            <div className="react-select-menu-btn">
                <Link
                    to={getSearchLink(props.selectProps.inputValue)}
                    onClick={() => {
                        props.selectProps.searchValue && props.selectProps.setSearchValue('');
                        props.selectProps.currentRef.blur();
                    }}
                    className="btn btn-outline-primary btn-block mt-3"
                >
                    Advanced search
                </Link>
            </div>
        </components.Menu>
    ) : null;

const MenuItem: React.FC<{ item: CandidateListType }> = ({ item }) => (
    <div className="react-select-option-item">
        <div
            className="react-select-option-item__avatar"
            style={item.avatarUrl ? { backgroundImage: `url('${item.avatarUrl}')` } : undefined}
        />
        <div className="react-select-option-item__body">
            <div
                className={`react-select-option-item__body-inner ${
                    !!item.allCompaniesAcceptedOffersCount ? 'react-select-option-item__body-inner--ellipsis' : ''
                }`}
            >
                <div className="react-select-option-item__name text-capitalize">
                    {item.firstName.toLowerCase()} {item.lastName.toLowerCase()}
                </div>
                <div>
                    <div className="d-flex align-items-center">
                        <div className="pt-1"> {item.rating !== 0 && <p className="me-1">{item.rating}</p>}</div>
                        <Rating
                            allowFraction={true}
                            size={20}
                            fillColor="#4EB6FF"
                            initialValue={item.rating}
                            transition={true}
                            emptyColor="transparent"
                            SVGstrokeColor="#4EB6FF"
                            SVGstorkeWidth="1"
                            readonly={true}
                            allowTitleTag={false}
                        />
                    </div>
                    {item.experienceLevel == ExperienceLevelEnum.Fresher && (<div className="react-select-option-item__details react-select-option-item__details--ellipsis text-capitalize">
                        {item.cityDistrict}<i className="bi bi-dot fs-18 me-0"></i> {ExperienceLevelEnum[ExperienceLevelEnum.Fresher]}
                    </div>)}
                    {item.experienceLevel ==(ExperienceLevelEnum.Experienced)   && (<div className="react-select-option-item__details react-select-option-item__details--ellipsis text-capitalize">
                        {item.jobTitle} <i className="bi bi-dot fs-18 me-0"></i> {item.cityDistrict}
                    </div>)}
                    {item.experienceLevel ==(null)   && (<div className="react-select-option-item__details react-select-option-item__details--ellipsis text-capitalize">
                        {item.jobTitle} <i className="bi bi-dot fs-18 me-0"></i> {item.cityDistrict}
                    </div>)}
                </div>
            </div>
            <div className="react-select-option-item__body-offers">
                <div className="bd-highlight">
                    {!!item.allCompaniesAcceptedOffersCount && (
                        <div className="badge rounded-pill alert-warning py-1 px-2 fs-12 me-1 fw-600 bd-highlight lt-text-warning">
                            {item.allCompaniesAcceptedOffersCount} accepted offer
                            {item.allCompaniesAcceptedOffersCount > 1 && 's'}
                        </div>
                    )}
                    {item.currentCompanyLastEventShortText && (
                        <div className="badge rounded-pill alert-info py-1 px-2 fs-12 fw-600 bd-highlight text-primary">
                            {item.currentCompanyLastEventShortText}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);

export default CandidateSelect;

function candidateClick(currentItem: CandidateListType | LsCandidateType, userId: string) {
    const LsRecentJson = localStorage.getItem(`recentSearch-${userId}`);
    const LsRecentItems: LsCandidateType[] = LsRecentJson ? JSON.parse(LsRecentJson) : [];
    const filteredRecentItems = LsRecentItems.filter((item) => item.id !== currentItem.id);
    filteredRecentItems.unshift({
        id: currentItem.id,
        firstName: currentItem.firstName,
        lastName: currentItem.lastName,
        avatarUrl: currentItem.avatarUrl,
        jobTitle: currentItem.jobTitle,
        cityDistrict: currentItem.cityDistrict,
        state: currentItem.state,
    });
    localStorage.setItem(`recentSearch-${userId}`, JSON.stringify(filteredRecentItems));
    history.push(generateLink(routes.candidate, { id: currentItem.id }));
}

export function getLsItems(userId: string) {
    const recentItems = localStorage.getItem(`recentSearch-${userId}`);
    return recentItems ? JSON.parse(recentItems) : [];
}

function getSearchLink(value: string) {
    return queryString.stringifyUrl({
        url: routes.candidates,
        query: value
            ? {
                  searchParam: value,
              }
            : {},
    });
}
