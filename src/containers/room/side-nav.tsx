import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { ManagerPermissionEnum, UserRoleEnum, UserType } from '../../types/auth';
import { routes } from '../routes/routes-names';
import { Link, NavLink } from 'react-router-dom';
import OfferxLogo from '../../assets/img/offerx-logo.png';

type Props = {
    toggle: boolean;
    setToggle: (value: boolean) => void;
};

const SideNav: React.FC<Props> = ({ toggle, setToggle }) => {
    const { user } = useSelector((state: RootState) => state.user);
    const hasUser = user as UserType;

    const resetSession = () => {
        sessionStorage.removeItem('Filter_value');
    };

    return (
        <>
            {hasUser.role === UserRoleEnum.manager && (
                <>
                    <aside
                        aria-hidden="true"
                        className={`offerx_left_nav d-flex flex-column flex-shrink-0 ${
                            toggle ? 'ox-collaps' : 'ox-expand'
                        }`}
                        id="offcanvasNavbar"
                        tabIndex={-1}
                    >
                        <nav
                            onClick={() => resetSession()}
                            className="nav flex-column offerx_nav_links mb-auto border-top-0 pt-0 arrows-up-down"
                        >
                            <NavLink to={routes.offers} className="nav-link text-nowrap">
                                <i className="bi bi-file-earmark-person"></i>
                                <span className="ox-menu-item">Job offers</span>
                            </NavLink>
                            <NavLink to={routes.dashboard} className="nav-link text-nowrap">
                                <i className="bi bi-grid-1x2"></i>
                                <span className="ox-menu-item">Dashboard</span>
                            </NavLink>
                            {/* <div className="nav-link disaledBTN"><i className="bi bi-bar-chart"></i><span>Reports</span></div> */}
                            <NavLink to={routes.invitations} className="nav-link text-nowrap">
                                <i className="bi bi-envelope-open" />
                                <span className="ox-menu-item">Candidate invitations</span>
                            </NavLink>

                            {hasUser.role === UserRoleEnum.manager &&
                                hasUser.permissionTypes?.map((permissionItem) => {
                                    if (permissionItem === ManagerPermissionEnum.admin) {
                                        return (
                                            <NavLink to={routes.employees} className="nav-link text-nowrap">
                                                <i className="bi bi-people" />
                                                <span className="ox-menu-item">Manage employees</span>
                                            </NavLink>
                                        );
                                    }
                                    if (permissionItem === ManagerPermissionEnum.offerManager) {
                                        return (
                                            <div className="nav-link disaledBTN text-nowrap">
                                                <i className="bi bi-people" />
                                                <span className="ox-menu-item">Manage employees</span>
                                            </div>
                                        );
                                    }
                                })}
                            {/* <a className="nav-link disaledBTN text-nowrap"><i className="bi bi-wallet2" /><span> Plans {'&'} Billing</span></a> */}
                            {/* <div className="accordion" id="accordionExample">
                                <div>
                                    <div id="headingTwo">
                                        <a className="nav-link d-flex accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                            <i className="bi bi-gear"></i> <span>Configurations</span>
                                        </a>
                                    </div>
                                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                        <div className="accordion-body p-0">
                                        
                                             <a className="nav-link disaledBTN text-nowrap"><i className="bi bi-clock" /><span> Hours {'&'} Calendar</span></a>
                                            <a className="nav-link disaledBTN text-nowrap"><i className="bi bi-envelope" /><span> Manage Emails</span></a>
                                            <a className="nav-link disaledBTN text-nowrap"><i className="bi bi-wallet2" /><span> Plans {'&'} Billing</span></a>      </div>
                                    </div>
                                </div>
                            </div> */}
                        </nav>
                        <nav className="nav offerx_nav_links pt-3">
                            {/* <a className="nav-link offerx-nav-bottom-link disaledBTN text-nowrap"><i className="bi bi-card-checklist" /><span>Tickets {'&'} Support</span></a> */}
                            <div
                                className={`d-flex w-100 ${
                                    toggle
                                        ? 'justify-content-center ox-collapse-btn'
                                        : 'ox-collapse-btn justify-content-end'
                                }`}
                            >
                                <i
                                    className={`bi lt-tooltip ${
                                        toggle ? 'bi-chevron-double-right' : 'bi-chevron-double-left'
                                    }`}
                                    onClick={() => setToggle(!toggle)}
                                >
                                    <span className="lt-tooltiptext lt-shadow-md fw-400 fs-14 right-tip">{`${
                                        toggle ? 'Show more information' : 'Show less information'
                                    }`}</span>
                                </i>
                            </div>
                        </nav>
                    </aside>
                </>
            )}
        </>
    );
};

export default SideNav;
