import React from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import Header from '../header/index';
import Footer from '../footer/index';
import Privacy from './privacy';
import Terms from './terms-and-conditions';
import FAQ from '../faq';
import { routes } from '../../routes/routes-names';

const Legal = () => {
    return (
        <>
            <Header />
            <div className="privacy-policy">
                <section className="bg-white lt-bg-white text-start text-lg-start">
                    <div className="container">
                        <div className="row">
                            <ul className="nav terms-nav mb-3">
                                <li className="nav-item">
                                    <NavLink to={routes.privacy} className="nav-link" activeClassName="active">
                                        Privacy policy
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to={routes.terms} className="nav-link" activeClassName="active">
                                        Terms & Conditions
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to={routes.faq} className="nav-link">
                                        FAQ's
                                    </NavLink>
                                </li>
                            </ul>
                            <div className="outlet px-0">
                                <Switch>
                                    <Route path={routes.terms} component={Terms} />
                                    <Route path={routes.privacy} component={Privacy} />
                                    <Route path={routes.faq} component={FAQ} />
                                </Switch>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Legal;
