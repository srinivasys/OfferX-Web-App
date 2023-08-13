import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { linkedInSignOut, signOut } from '../../../redux/user';
import { ManagerPermissionEnum, UserRoleEnum, UserType } from '../../../types/auth';
import avatar from '../../../assets/img/avatars.svg';
import { getPermissionText } from '../../../lib/utils/dictionary';
import { routes } from '../../routes/routes-names';
import { authType } from '../../../lib/auth-type';
import { Rating } from 'react-simple-star-rating';
import { ExperienceLevelEnum } from '../../../lib/constants/constants';

type Props = {
    user: UserType;
};

const HeaderUser: React.FC<Props> = ({ user }) => {
    const dispatch = useDispatch();
    const socialAuthType = authType.getAuthType();
    const hasCandidate = user.role === UserRoleEnum.candidate;
    const companyTitle =
        user.role === UserRoleEnum.manager
            ? user.permissionTypes
                  ?.map((permissionItem: ManagerPermissionEnum) => getPermissionText(permissionItem))
                  .join(', ')
            : user.jobTitle == "" ? ExperienceLevelEnum[ExperienceLevelEnum.Fresher]: user.jobTitle;

    return (
        <>
            <div className="dropdown lt-dropdown-menu lt-profile-dropdown">
                <a
                    className={`btn btn-secondary dropdown-toggle d-flex align-items-center justify-content-center ${
                        hasCandidate ? 'flex-column' : ''
                    }`}
                    href="_"
                    role="button"
                    id="MyProfile"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <img src={user.avatarUrl || avatar} alt="" className="header-avatar avatar" title="My profile" />
                </a>
                <ul className="dropdown-menu lt-shadow-sm py-0 text-nowrap" aria-labelledby="MyProfile">
                    <li className="px-3 py-2">
                        <h1
                            className="fs-18 fw-700 text-capitalize mb-1 text-ellipsis"
                            title={
                                user.firstName.length > 5 || user.lastName.length > 5
                                    ? `${user.firstName} ${user.lastName}`
                                    : ''
                            }
                        >
                            {user.firstName} {user.lastName}
                        </h1>
                        <div className="border-bottom pb-2 mb-2 fs-14 text-ellipsis" title={companyTitle?.toString()}>
                            {companyTitle}
                        </div>
                        {user.role === UserRoleEnum.manager && (
                            <div className="company-name" title={user.companyName || ''}>
                                {user.companyName}
                            </div>
                        )}
                        <div className="d-flex align-items-center lt-star-rate">
                            {user.rating.value > 0 && <div className="fw-600 fs-28 me-1">{user.rating.value}</div>}
                            <Rating
                                allowFraction={true}
                                size={20}
                                fillColor="#4EB6FF"
                                initialValue={user.rating.value}
                                transition={true}
                                emptyColor="transparent"
                                SVGstrokeColor="#4EB6FF"
                                SVGstorkeWidth="1"
                                readonly={true}
                                allowTitleTag={false}
                            />
                        </div>
                    </li>
                    {user.role === UserRoleEnum.manager ? (
                        <>
                            <li>
                                <a
                                    href="."
                                    className="dropdown-item"
                                    data-bs-toggle="modal"
                                    data-bs-target="#MyProfileDetails"
                                >
                                    <i className="bi bi-person" />
                                    My profile
                                </a>
                            </li>
                            <li>
                                <Link to={routes.myCompany} className="dropdown-item">
                                    <i className="bi bi-building" />
                                    Company profile
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to={routes.myProfile} className="dropdown-item">
                                <i className="bi bi-person" />
                                My profile
                            </Link>
                        </li>
                    )}
                    <li>
                        <button
                            type="button"
                            className="dropdown-item"
                            onClick={() =>
                                socialAuthType === 'linkedIn' ? dispatch(linkedInSignOut()) : dispatch(signOut())
                            }
                        >
                            <i className="bi bi-power" />
                            Sign out
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default HeaderUser;
