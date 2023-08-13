import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../../routes/routes-names';
import footerlogo from '../../../assets/img/footer-logo.png';

const Footer = () => {
    return (
        <footer className="landing-footer">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-8">
                        <img src={footerlogo} className="site-logo mb-3" alt="OfferX Logo"></img>
                        <p>
                            OfferX is a simple to use online recruitment platform - by <br /> enabling two-way reviewing
                            for an optimized onboarding process.
                        </p>
                        <div className="offerx-footer-address mt-3">
                            {/* <a href="tel: +914048512310">
                                <i className="bi bi-telephone" /> +91 40 - 48512310
                            </a> */}
                            <a href="mailto: support@offerx.in">
                                <i className="bi bi-envelope" /> support@offerx.in
                            </a>
                            <div className="d-flex">
                                <div>
                                    <i className="bi bi-geo-alt" />
                                </div>
                                <div>
                                    Unit No. 1803, Manjeera Trinity Corporate, JNTU-Hitech City Road, Kukatpally,
                                    Hyderabad – 500 072, Telangana, India
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                        <h4 className="mt-md-0">Important Links</h4>
                        <ul className="offerx-footer-links">
                            <li>
                                <Link to={routes.main}>Home</Link>
                            </li>
                            <li>
                                <Link to={routes.about}>About Us</Link>
                            </li>
                            <li>
                                <Link to={routes.contact}>Contact Us</Link>
                            </li>
                            <li>
                                <a rel="noreferrer" href="https://www.graph5.com" target="_blank">
                                    Graph5
                                </a>
                            </li>
                            <li>
                                <a rel="noreferrer" href="https://www.screenx.ai/" target="_blank">
                                    ScreenX
                                </a>
                            </li>
                            <li>
                                <Link className="fw-400 fs-14 text-light me-2" to={routes.faq}>
                                    FAQ's
                                </Link>
                            </li>
                            <li>
                                <Link className="fw-400 fs-14 text-light me-2" to={routes.privacy}>
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link className="fw-400 fs-14 text-light me-2" to={routes.terms}>
                                    Terms & Conditions
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-3 col-md-4">
                        <h4>Social Media</h4>
                        <div className="offerx-social-icons mb-3">
                            <a
                                rel="noreferrer"
                                href="https://www.facebook.com/OfferX.india"
                                target="_blank"
                                title="Facebook"
                            >
                                <i className="bi bi-facebook" />
                            </a>
                            <a rel="noreferrer" href="https://www.twitter.com/OfferX_" target="_blank" title="Twitter">
                                <i className="bi bi-twitter" />
                            </a>
                            <a
                                rel="noreferrer"
                                href="https://www.linkedin.com/company/offer-x"
                                target="_blank"
                                title="Linkedin"
                            >
                                <i className="bi bi-linkedin" />
                            </a>
                            <a
                                rel="noreferrer"
                                href="https://www.instagram.com/offerx.in"
                                target="_blank"
                                title="Instagram"
                            >
                                <i className="bi bi-instagram" />
                            </a>
                        </div>
                        <p className="mb-3">Copyright © {new Date().getFullYear()} OfferX.in<br />All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
