import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../routes/routes-names';
import MainHeader from './header';
import Footer from './footer';
import Ab from '../../assets/img/about-us.png';
import Re from '../../assets/img/rebalancing.png';
import Tr from '../../assets/img/try-offerx.png';
import Trb from '../../assets/img/tryofferx-bg.png';
import Co1 from '../../assets/img/company1.jpg';
import Co2 from '../../assets/img/company2.jpg';
import Co3 from '../../assets/img/company3.jpg';
import { useScript } from '../../hooks/script';

const About = () => {
    const aosReady = useScript('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js');

    useEffect(() => {
        if (!aosReady) return;
        window.AOS?.init();
    }, [aosReady]);

    return (
        <>
            <MainHeader />
            <div className="about-us">
                <section className="bg-white lt-bg-white text-start text-lg-start text-center">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <div data-aos="fade-up" data-aos-delay="200">
                                    <h1>About Us</h1>
                                    <p className="fw-400 fs-14 my-3">
                                        It is our mission to identify issues within the recruitment process and to
                                        create easy-to-use solutions. We believe that there is a better way for
                                        recruiters and candidates to engage with each other, and we build technology
                                        platforms that are designed to bring about that better way of working.
                                    </p>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg"
                                        data-bs-toggle="modal"
                                        data-bs-target="#SignInSignUp"
                                    >
                                        Try OfferX now
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="aboutus-pic text-end" data-aos="fade-up" data-aos-delay="200">
                                    <img src={Ab} className="img-fluid" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="rebalancing lt-bg-gray-10 text-start text-lg-start text-center">
                    <div className="container">
                        <div className="row align-items-center flex-row-reverse">
                            <div className="col-lg-6">
                                <div data-aos="fade-up" data-aos-delay="200">
                                    <div className="lt-header-line" />
                                    <h2 className="">Rebalancing The Employee Onboarding Experience</h2>

                                    <div className="rebalancing-title text-start text-lg-start text-sm-start">
                                        <p className="fw-400 fs-14 my-3">
                                            OfferX is a simple online employee offer release platform where employers
                                            release offers through the secure digital portal, where the candidate can
                                            eSign to indicate acceptance. After accepting the offer, if the candidate or
                                            employer violates the contract or otherwise ‘ghosts,’ that behavior will be
                                            flagged for future reference.
                                        </p>

                                        <p className="fw-400 fs-14 my-3">
                                            OfferX is a way to bring balance into the system and improve committal on
                                            both sides by enabling the ratings and reviews for both the employer and the
                                            candidate. In this neutral platform, both the candidates and employers can
                                            read and provide reviews on each other to add stability and predictability
                                            with the job offers.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg mt-3"
                                        data-bs-toggle="modal"
                                        data-bs-target="#SignInSignUp"
                                    >
                                        Start Today
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="rebalancing-pic" data-aos="fade-up" data-aos-delay="200">
                                    <img src={Re} className="img-fluid" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section
                    style={{
                        backgroundImage: `url('${Trb}') no-repeat #fff`,
                        backgroundSize: '100%',
                        padding: '7rem 0',
                    }}
                    className="tryofferx bg-white lt-bg-white"
                >
                    <div className="container text-center">
                        <div className="row align-items-center">
                            <div className="col-lg-12" data-aos="fade-up" data-aos-delay="200">
                                <div className="lt-header-line" />
                                <h2 className="mb-4">Try OfferX For Free</h2>
                                <div className="tryofferx-pic">
                                    <img src={Tr} className="img-fluid mb-3" alt="" />
                                </div>
                                <div className="">
                                    <p className="fw-400 fs-14 my-3">
                                        OfferX is a simple to use online recruitment platform - companies release offers
                                        through the secure digital portal, where the candidate can eSign to indicate
                                        acceptance. If the candidate then accepts an offer somewhere else or otherwise
                                        ‘ghosts’, then they will receive a negative review and score on the platform –
                                        so other companies know that they are unreliable and to be wary of offering
                                        positions in the future.
                                    </p>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg"
                                        data-bs-toggle="modal"
                                        data-bs-target="#SignInSignUp"
                                    >
                                        Try It For Free Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="company lt-bg-gray-10 text-start text-lg-start text-center">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="company-description" data-aos="fade-up" data-aos-delay="200">
                                    <div className="lt-header-line" />
                                    <h2 className="">The Company</h2>
                                </div>
                                <div
                                    className="text-start text-lg-start text-sm-start"
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                >
                                    <p className="fw-400 fs-14 my-3">
                                        We're an organization made up of people who are passionate about technology and
                                        problem-solving, fostering a culture of inclusion, innovation, and support. We
                                        analyze the recruitment industry, identify trending or growing issues, and then
                                        work tirelessly with each other to bring a solution to the world.
                                    </p>
                                    <p className="fw-400 fs-14 my-3">
                                        Because we've experienced the issues present in the recruitment industry first
                                        hand, we know where the biggest problems lie and the solution we would like to
                                        see. When it comes to improving the candidate onboarding process and eliminating
                                        applicant ghosting, we believe that OfferX is the perfect tool to help.
                                    </p>
                                    <p className="fw-400 fs-14 my-3">
                                        {' '}
                                        Our global presence includes offices in the U.S, Canada, and India.
                                    </p>
                                </div>
                                <Link to={routes.contact} className="btn btn-primary mt-4 btn-lg">
                                    Contact Us
                                </Link>
                            </div>
                            <div className="col-lg-6">
                                <div className="row">
                                    <div className="col-lg-12 pe-lg-0 pe-md-0">
                                        <div
                                            className="company-pic company-one"
                                            data-aos="fade-up"
                                            data-aos-delay="200"
                                        >
                                            <img src={Co1} className="img-fluid mb-3 w-100" alt="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 pe-lg-0 pe-md-0">
                                        <div className="company-pic" data-aos="fade-up" data-aos-delay="200">
                                            <img src={Co2} className="img-fluid mb-3 w-100" alt="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 pe-lg-0 pe-md-0">
                                        <div className="company-pic" data-aos="fade-up" data-aos-delay="200">
                                            <img src={Co3} className="img-fluid mb-3 w-100" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default About;
