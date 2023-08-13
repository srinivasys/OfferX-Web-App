import React, { useEffect, useState } from 'react';
import VideoPoster from '../../assets/img/video-thumbnail.png';
import Built from '../../assets/img/why-we-built-this.png';
import Wb from '../../assets/img/work-background.png';
import Step1 from '../../assets/img/step7.png';
import Step2 from '../../assets/img/step8.png';
import Step3 from '../../assets/img/step9.png';
import Step4 from '../../assets/img/step10.png';
import Wc from '../../assets/img/why-choosing-us.png';
import Gl from '../../assets/img/Graph5-Logo.png';
import Gi from '../../assets/img/Graph5-Image.png';
import Si from '../../assets/img/ScreenX-Image.png';
import Sl from '../../assets/img/ScreenX-Logo.png';
import Footer from './footer';
import MainHeader from './header';
import { useScript } from '../../hooks/script';
import { RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';
import '../../assets/styles/landing-pages.css';
import OfferxVideo from '../../assets/img/NewofferXVideo.mp4';

declare global {
    interface Window {
        AOS?: {
            init: () => void;
        };
    }
}

type Props = RouteComponentProps;

const Main: React.FC<Props> = ({ location }) => {
    const { ConfirmCandidateInvitationId, ConfirmManagerInvitationId } = queryString.parse(location.search);
    const aosReady = useScript('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js');
    const [videwShow, setVideoShow] = useState<boolean>(false);

    useEffect(() => {
        if (!aosReady) return;
        window.AOS?.init();
    }, [aosReady]);

    return (
        <>
            <MainHeader
                candidateId={
                    typeof ConfirmCandidateInvitationId === 'string' ? ConfirmCandidateInvitationId : undefined
                }
                managerId={typeof ConfirmManagerInvitationId === 'string' ? ConfirmManagerInvitationId : undefined}
            />
            <section className="hero-banner plan-bg">
                <div className="container">
                    <div className="row text-lg-start text-xl-start text-center align-items-center">
                        <div className="col-lg-5 col-sm-12">
                            <div className="hero-content" data-aos="fade-up" data-aos-delay="200">
                                <span className="fs-42 fw-700">Say Goodbye To</span>
                                <br /> <span className="fw-700 ox-home-title">Recruitment Ghosting</span>
                                <p className="mb-4">
                                    We solve the recruitment ghosting problem with an optimized onboarding process and a
                                    two-way reviewing platform.
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
                        <div className="col-lg-7 col-sm-12">
                            <div
                                className="ox-video-poster d-flex align-items-center justify-content-center"
                                data-aos="fade-up"
                                data-aos-delay="200"
                            >
                                {!videwShow ? (
                                    <div className="text-center">
                                        <i
                                            className="bi bi-youtube ox-home-player-btn"
                                            onClick={() => setVideoShow(true)}
                                            title="Play"
                                        ></i>
                                    </div>
                                ) : (
                                    <>
                                        <video
                                            controls
                                            poster={VideoPoster}
                                            preload="none"
                                            playsInline
                                            controlsList="nodownload"
                                            autoPlay
                                        >
                                            <source src={OfferxVideo} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="why-we-built gray-bg px-3 ps-lg-0">
                <div className="row align-items-center">
                    <div
                        className="col-12 col-lg-5 order-2 order-sm-2 order-lg-1 mt-lg-0 mt-5"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <img src={Built} className="img-fluid w-75" alt="" />
                    </div>
                    <div
                        className="col-12 m-lg-0 m-sm-auto col-lg-5 order-1 order-sm-1 order-lg-2"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <div className="align-left-border mx-lg-0 m-sm-auto mb-sm-3 m-auto mb-3" />
                        <h1 className="fw-600 fs-32 text-lg-start text-xl-start text-center mb-4">Why We Built This</h1>
                        <p className="mb-3">
                            Around the world talent scarcity has become a major challenge and it also brings
                            predictability challenges for both employers and candidates with the job offers.
                        </p>
                        <p className="mb-3">
                            Employers spend time, money, and resources hiring the perfect candidate with a long
                            recruiting cycle, after the offer is accepted by the candidate, and then when the start date
                            approaches for the candidate to start: they never show up. In the meantime, employers have
                            stopped their recruitment efforts, and lost precious time of hiring; even worse have major
                            business impacts like losing their customer and business altogether.
                        </p>
                        <p className="mb-3">
                            A candidate to find a suitable job, they must spend a significant amount of time going
                            through their job search and exhaustive interview setup process with multiple companies.
                            However, there is no way for the candidate to validate if the employer is legitimate or have
                            violated the offers by releasing non-committal offers in the past.
                        </p>
                        <p className="fw-700">
                            OfferX solves these problems by giving visibility to their past history to both sides and
                            thus increasing the chances of committal with the offers.
                        </p>
                    </div>
                </div>
            </section>

            <section
                className="how-does-work"
                data-aos="fade-up"
                data-aos-delay="200"
                style={{ backgroundImage: `url('${Wb}') no-repeat #ffffff`, backgroundSize: 'cover' }}
            >
                <div className="container">
                    <div className="text-center mb-lg-5 mb-sm-0">
                        <div className="align-left-border m-auto mb-3" />
                        <h1 className="fw-600 fs-32">How Does It Work?</h1>
                    </div>

                    <div className="row align-items-center section-50 text-lg-start text-xl-start text-center">
                        <div
                            className="col-lg-6 col-12 order-2 order-sm-2 order-lg-1"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <img src={Step1} className="img-fluid thumb-img" alt="" />
                        </div>
                        <div
                            className="col-lg-6 col-12 order-1 order-sm-1 order-lg-2"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <div className="mb-lg-0 mb-sm-4 mb-3 text-lg-start text-xl-start text-sm-center d-lg-flex">
                                <h1 className="fw-600 fs-20 lt-text-primary-alt me-lg-3">#1</h1>
                                <p className="fs-16">
                                    Companies release offers to selected candidates through the secured digital portal.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="row align-items-center section-50 text-lg-start text-xl-start text-center">
                        <div
                            className="col-lg-6 col-12 order-1 order-sm-1 order-lg-1"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <div className="mb-lg-0 mb-sm-4 mb-3 d-lg-flex">
                                <h1 className="fw-600 fs-20 lt-text-primary-alt me-lg-3">#2</h1>
                                <p className="fs-16">
                                    Candidates can easily and securely sign online to indicate their acceptance.
                                </p>
                            </div>
                        </div>
                        <div
                            className="col-lg-6 col-12 order-2 order-sm-2 order-lg-2"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <img src={Step2} className="img-fluid thumb-img" alt="" />
                        </div>
                    </div>

                    <div className="row align-items-center section-50 text-lg-start text-xl-start text-center">
                        <div
                            className="col-lg-6 col-12 order-2 order-sm-2 order-lg-1"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <img src={Step3} className="img-fluid thumb-img" alt="" />
                        </div>
                        <div
                            className="col-lg-6 col-12 order-1 order-sm-1 order-lg-2"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <div className="mb-lg-0 mb-sm-4 mb-3 text-lg-start text-xl-start text-sm-center d-lg-flex">
                                <h1 className="fw-600 fs-20 lt-text-primary-alt me-lg-3">#3</h1>
                                <p className="fs-16">
                                    Quickly see if the candidate or company have been compliant with or in violation of
                                    any contract offers.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="row align-items-center section-50 text-lg-start text-xl-start text-center">
                        <div
                            className="col-lg-6 col-12 order-2 order-sm-1 order-lg-1"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <div className="mb-lg-0 mb-sm-4 mb-3 d-lg-flex">
                                <h1 className="fw-600 fs-20 lt-text-primary-alt me-lg-3">#4</h1>
                                <p className="fs-16">
                                    Companies and candidates can access and manage their offers easily and securely.
                                </p>
                            </div>
                        </div>
                        <div
                            className="col-lg-6 col-12 order-2 order-sm-2 order-lg-2"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <img src={Step4} className="img-fluid thumb-img" alt="" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="gray-bg">
                <div className="container">
                    <div className="row text-lg-start text-xl-start text-center align-items-center">
                        <div className="col-lg-6 col-sm-12 col-12" data-aos="fade-up" data-aos-delay="200">
                            <div className="align-left-border mx-lg-0 m-sm-auto mb-sm-3 mx-auto" />
                            <h1 className="fw-600 fs-32 mb-4">Why Choosing Us?</h1>
                            <p className="mb-3 text-start text-sm-start">
                                OfferX is a simple online employee offer release platform where employers release offers
                                through the secure digital portal, where the candidate can eSign to indicate acceptance.
                                After accepting the offer, if the candidate or employer violates the contract or
                                otherwise 'ghosts,' that behavior will be flagged for future reference.
                            </p>
                            <p className="mb-4 text-start text-sm-start">
                                OfferX is a way to bring balance into the system and improve committal on both sides by
                                enabling the ratings and reviews for both the employer and the candidate. In this
                                neutral platform, both the candidates and employers can read and provide reviews on each
                                other to add stability and predictability with the job offers.
                            </p>
                            <button
                                className="btn btn-primary btn-lg mt-sm-4 mb-5 mb-lg-0"
                                data-bs-toggle="modal"
                                data-bs-target="#SignInSignUp"
                            >
                                Start Today
                            </button>
                        </div>
                        <div
                            className="col-lg-6 col-sm-12 col-12 text-sm-center text-lg-end text-xl-start"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <img src={Wc} className="img-fluid thumb-img mt-sm-4" alt="" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="lt-blue-bg">
                <div className="container">
                    <div className="text-center mb-5">
                        <div className="align-left-border m-auto mb-3" />
                        <h1 className="fw-600 fs-32">Try our other products</h1>
                    </div>
                    <div className="row align-items-center">
                        <div
                            className="col-lg-6 col-12 text-lg-start text-xl-start text-center order-2 order-lg-1"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <img src={Gl} className="mb-4" alt="Graph5 Logo" />
                            <p className="mb-3 fs-16">
                                Better connecting the recruiters to dramatically reduce the time being spent filling
                                open positions while getting the most suitable candidates hired.
                            </p>
                            <a
                                href={'https://www.graph5.com'}
                                className="btn btn-primary btn-lg"
                                rel="noopener noreferrer"
                                title="Graph5"
                                target="_blank"
                            >
                                Try Graph5
                            </a>
                        </div>
                        <div
                            className="col-lg-6 col-12 text-end order-1 order-lg-2"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <img src={Gi} className="img-fluid" alt="" />
                        </div>
                    </div>
                    <hr className="my-5" />
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-12 text-end" data-aos="fade-up" data-aos-delay="200">
                            <img src={Si} className="img-fluid" alt="" />
                        </div>
                        <div
                            className="col-lg-6 col-12 text-lg-start text-xl-start text-center"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <img src={Sl} className="mb-4" alt="ScreenX Logo" />
                            <p className="mb-3 fs-16">
                                The free web-based platform that can cut your interview screening time by up to 90%
                                while streamlining the process from start to finish.
                            </p>
                            <a
                                href={'https://www.screenx.ai'}
                                className="btn btn-primary btn-lg"
                                title="Screenx"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                Try ScreenX
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default Main;
