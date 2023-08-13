import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { routes } from '../routes/routes-names';
import Header from './header';
import CandidatesSearchList from '../candidates/search-list';
import ReleaseOffer from '../release-offer';
import Offers from '../offers';
import HeaderModals from './header/modals';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { UserRoleEnum, UserType } from '../../types/auth';
import CandidateDetailsPage from '../candidates/details-page';
import MyCompany from '../companies/my-profile';
import UserManagement from '../employees/index';
import MyProfile from '../candidates/my-profile';
import Document from '../document';
import CompaniesSearchList from '../companies/search-list';
import CompanyDetailsPage from '../companies/details-page';
import SideNav from './side-nav';
import Dashboard from '../dashboard';
import CandidateInvitations from '../invitations/candidate';

const Room = () => {
    const { user } = useSelector((state: RootState) => state.user);
    const hasUser = user as UserType;
    const hasCandidate = hasUser.role === UserRoleEnum.candidate;
    const [toggle, setToggle] = useState<boolean>(false);

    return (
        <>
            <main>
                <Header user={hasUser} />
                <HeaderModals user={hasUser} />
                <div className="d-flex">
                    <div className="flex-shrink-1">
                        <SideNav toggle={toggle} setToggle={setToggle} />
                    </div>
                    <div className="flex-grow-1">
                        <section
                            className={`page-content ${hasCandidate ? 'p-0' : ''}${
                                toggle ? 'ox-collaps-page' : ' ox-expand-page'
                            }`}
                        >
                            <div
                                className={`${
                                    hasCandidate ? 'main-box px-0 candidate-page' : 'main-box px-0 company-page'
                                }`}
                            >
                                <div className={`${hasCandidate ? 'container' : 'container-fluid'}`}>
                                    <Switch>
                                        <Route path={routes.pendingOffers} component={Offers} />
                                        <Route path={routes.acceptedOffers} component={Offers} />
                                        <Route path={routes.declinedOffers} component={Offers} />
                                        <Route path={routes.retractedOffers} component={Offers} />
                                        <Route path={routes.expiredOffers} component={Offers} />
                                        <Route path={routes.onboardedOffers} component={Offers} />
                                        <Route path={routes.ghostedOffers} component={Offers} />
                                        <Route path={routes.document} component={Document} />
                                        {hasUser.role === UserRoleEnum.manager && (
                                            <Switch>
                                                <Route path={routes.candidates} component={CandidatesSearchList} />
                                                <Route path={routes.candidate} component={CandidateDetailsPage} />
                                                <Route path={routes.myCompany} component={MyCompany} />
                                                <Route path={routes.releaseOffer} component={ReleaseOffer} />
                                                <Route path={routes.employees} component={UserManagement} />
                                                <Route path={routes.invitations} component={CandidateInvitations} />
                                                <Route path={routes.dashboard} component={Dashboard} />
                                                <Redirect to={routes.pendingOffers} />
                                            </Switch>
                                        )}
                                        {hasCandidate && (
                                            <Switch>
                                                <Route path={routes.companies} component={CompaniesSearchList} />
                                                <Route path={routes.company} component={CompanyDetailsPage} />
                                                <Route path={routes.myProfile} component={MyProfile} />
                                                <Redirect to={routes.pendingOffers} />
                                            </Switch>
                                        )}
                                    </Switch>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Room;
