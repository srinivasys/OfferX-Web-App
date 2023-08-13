import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { routes } from '../../routes/routes-names';
import { linkedInSignOut, signOut } from '../../../redux/user';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import AuthModal from '../../registration';
import websitelogo from '../../../assets/img/offerx-logo.png';
import { authType } from '../../../lib/auth-type';

type Props = {
    candidateId?: string;
    managerId?: string;
};

const MainHeader: React.FC<Props> = ({ candidateId, managerId }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.user);
    const socialAuthType = authType.getAuthType();
    return (
        <>
            <header className="landing-page">
                <nav className="navbar navbar-expand-lg navbar-toggleable-sm navbar-light py-0">
                    <div className="container">
                        <Link to={routes.main} className="navbar-brand py-0 fs-28 fw-700">
                            <img src={websitelogo} className="site-logo" alt="OfferX Logo"></img>
                        </Link>
                        <button
                            className="navbar-toggler border-0"
                            type="button"
                            data-bs-target="#offcanvasNavbar"
                            data-bs-toggle="offcanvas"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div
                            aria-hidden="true"
                            aria-labelledby="offcanvasNavbarLabel"
                            className="flex-sm-row-reverse offcanvas offcanvas-end"
                            id="offcanvasNavbar"
                            data-bs-scroll="true"
                            tabIndex={-1}
                        >
                            <div className="offcanvas-header ml-auto">
                                <button
                                    data-sider-close
                                    aria-label="Close"
                                    className="btn-close text-reset ms-auto"
                                    data-bs-dismiss="offcanvas"
                                    type="button"
                                />
                            </div>
                            <div className="offcanvas-body">
                                <ul className="navbar-nav flex-grow">
                                    <li className="nav-item">
                                        <NavLink
                                            exact
                                            to={routes.main}
                                            activeClassName="active"
                                            className="nav-link text-dark"
                                        >
                                            Home
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            to={routes.about}
                                            activeClassName="active"
                                            className="nav-link text-dark"
                                        >
                                            About Us
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            to={routes.contact}
                                            activeClassName="active"
                                            className="nav-link text-dark"
                                        >
                                            Contact Us
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        {user ? (
                                            <div className="nav-link text-dark">
                                                <Link
                                                    to={routes.pendingOffers}
                                                    className="text-dark text-decoration-none"
                                                >
                                                    {user.firstName}
                                                </Link>
                                                {' / '}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        socialAuthType === 'linkedIn'
                                                            ? dispatch(linkedInSignOut())
                                                            : dispatch(signOut())
                                                    }
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                className="nav-link text-dark"
                                                data-bs-toggle="modal"
                                                data-bs-target="#SignInSignUp"
                                                onClick={() => {
                                                    const close = document.querySelector(
                                                        '[data-sider-close]'
                                                    ) as HTMLButtonElement;
                                                    close.click();
                                                }}
                                            >
                                                Sign In / Sign Up
                                            </button>
                                        )}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <AuthModal candidateId={candidateId} managerId={managerId} />
        </>
    );
};

export default MainHeader;
