import React from 'react';
import FAQImg from '../../assets/img/faq-search-icon.png';

const FAQ = () => {
    return (
        <div className="row">
            <div className="w-100 text-center">
                <h1 className="fw-700 fs-42 mt-5 mb-4">Frequently Asked Questions</h1>
                {/*<div className="col-5 m-auto">
                    <div className="input-group input-group-sm mb-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search candidate..."
                            aria-label="Search candidate..."
                            aria-describedby="button-addon2"
                        />
                        <button className="btn btn-primary px-4" type="button" id="button-addon2">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>*/}
                <div className="w-100"></div>
            </div>
            <div className="w-100 py-4 mb-3 text-center d-none">
                <img src={FAQImg} className="mb-3 mt-5" alt="" />
                <p className="mb-3">No question found. Please contact us to resolve your question.</p>
            </div>
            <div className="col">
                {/* <div className="input-group mb-3 w-25 m-auto align-items-center">
                    <div className="form-control border-0 text-end pe-2">
                        <label className="form-check-label fw-600" htmlFor="FAQS">
                            Candidate
                        </label>
                    </div>
                    <span className="input-group-text border-0">
                        <span className="form-check form-switch lt-form-switch">
                            <input className="form-check-input" type="checkbox" id="FAQS" />
                            <label className="form-check-label" htmlFor="FAQS"></label>
                        </span>
                    </span>
                    <div className="form-control border-0">
                        <label className="form-check-label fw-600" htmlFor="FAQS">
                            Employeer
                        </label>
                    </div>
                </div> */}
                <div className="card">
                    <div className="card-body p-0">
                        <div className="accordion accordion-flush" id="accordionFlushExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="flush-headingOne">
                                    <button
                                        className="accordion-button"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseOne"
                                        aria-expanded="false"
                                        aria-controls="flush-collapseOne"
                                    >
                                        About OfferX
                                    </button>
                                </h2>
                                <div
                                    id="flush-collapseOne"
                                    className="accordion-collapse collapse show"
                                    aria-labelledby="flush-headingOne"
                                    data-bs-parent="#accordionFlushExample"
                                >
                                    <div className="accordion-body">
                                        <a
                                            className="collapse-head collapsed"
                                            data-bs-toggle="collapse"
                                            href="#Ques1"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques1"
                                        >
                                            1. What is OfferX?
                                        </a>
                                        <div className="collapse p-3 show" id="Ques1">
                                            <p className='fs-14'>
                                                OfferX is a neutral and transparent recruitment platform solves the
                                                current day pain points of candidates and employers.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="flush-headingTwo">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseTwo"
                                        aria-expanded="false"
                                        aria-controls="flush-collapseTwo"
                                    >
                                        Offer Letter
                                    </button>
                                </h2>
                                <div
                                    id="flush-collapseTwo"
                                    className="accordion-collapse collapse"
                                    aria-labelledby="flush-headingTwo"
                                    data-bs-parent="#accordionFlushExample"
                                >
                                    <div className="accordion-body">
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques2"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques2"
                                        >
                                            1. What is job offer letter?
                                        </a>
                                        <div className="collapse p-3" id="Ques2">
                                            <p className='fs-14'>
                                                Candidate generally receives a conditional job offer letter after he/she
                                                has completed the interview process successfully. Some companies call it
                                                as letter of intent also.
                                            </p>
                                        </div>
                                        {/* <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques3"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques3"
                                        >
                                            2. Is there any legality of offer letter?
                                        </a>
                                        <div className="collapse p-3" id="Ques3">
                                            <p>
                                                
                                            </p>
                                        </div> */}
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques4"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques4"
                                        >
                                            2. Is job offer letter legally binding on the employee and employer?
                                        </a>
                                        <div className="collapse p-3" id="Ques4">
                                            <p className='fs-14'>
                                                Employer generally releases conditional job offer letter to the
                                                candidate. Candidate may accept or reject the job offer. However, when
                                                the candidate accepts the offer by the way of e-sign it becomes
                                                unconditional acceptance of an offer enforcing legal contract between
                                                candidate and employer.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="flush-headingThree">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseThree"
                                        aria-expanded="false"
                                        aria-controls="flush-collapseThree"
                                    >
                                        Offer Expiry
                                    </button>
                                </h2>
                                <div
                                    id="flush-collapseThree"
                                    className="accordion-collapse collapse"
                                    aria-labelledby="flush-headingThree"
                                    data-bs-parent="#accordionFlushExample"
                                >
                                    <div className="accordion-body">
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques5"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques5"
                                        >
                                            1. What is job offer expiry?
                                        </a>
                                        <div className="collapse p-3" id="Ques5">
                                            <p className='fs-14'>
                                                Any job offer released by the employer comes with an offer expiry date.
                                                The offer will expire if the candidate has not taken any appropriate
                                                action like accept or reject within offer expiry date.
                                            </p>
                                        </div>
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques6"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques6"
                                        >
                                            2. Does the job offer remain valid after offer expiry date?
                                        </a>
                                        <div className="collapse p-3" id="Ques6">
                                            <p className='fs-14'>
                                                Any job offer released by the employer becomes null and void after the
                                                offer Expiry date as these are conditional offers.
                                            </p>
                                        </div>
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques7"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques7"
                                        >
                                            3. I have a genuine reason not to take appropriate action within offer
                                            expiry date. Can I request employer to release job offer with new expiry
                                            date?
                                        </a>
                                        <div className="collapse p-3" id="Ques7">
                                            <p className='fs-14'>
                                                You can contact respective HR / Company explaining the genuine reason
                                                for not taking appropriate action within Job expiry date. Based on the
                                                fact and evidence HR / Organization may Re-offer with a revised offer
                                                expiry date which is purely case to case basis and with sole discretion.
                                            </p>
                                        </div>
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques8"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques8"
                                        >
                                            4. Can I see the expired job offers in my dashboard?
                                        </a>
                                        <div className="collapse p-3" id="Ques8">
                                            <p className='fs-14'>
                                                All the expired offers can be viewed under Expired tab of candidate
                                                dashboard.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="flush-headingThree">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#plusfour"
                                        aria-expanded="false"
                                        aria-controls="plusfour"
                                    >
                                        Job Offer Release
                                    </button>
                                </h2>
                                <div
                                    id="plusfour"
                                    className="accordion-collapse collapse"
                                    aria-labelledby="flush-headingThree"
                                    data-bs-parent="#accordionFlushExample"
                                >
                                    <div className="accordion-body">
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques9"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques9"
                                        >
                                            1. Where do I see the offers released by employers in the OfferX platform?
                                        </a>
                                        <div className="collapse p-3" id="Ques9">
                                            <p className="mb-3 fs-14">
                                                As a candidate you need to login to your OfferX account and check under
                                                Pending tab to view the offers received from different employers.
                                            </p>
                                            <div className="alert alert-warning border-start border-0 border-4 rounded-0 fs-14">
                                                <strong>
                                                    <i className="bi bi-info-circle"></i> Note:
                                                </strong>{' '}
                                                Can view the offers released by employers who are present and release an
                                                offer in OfferX.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="flush-headingThree">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#plusfive"
                                        aria-expanded="false"
                                        aria-controls="plusfive"
                                    >
                                        Accept Job Offer
                                    </button>
                                </h2>
                                <div
                                    id="plusfive"
                                    className="accordion-collapse collapse"
                                    aria-labelledby="flush-headingThree"
                                    data-bs-parent="#accordionFlushExample"
                                >
                                    <div className="accordion-body">
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques10"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques10"
                                        >
                                            1. How do I accept job offer in OfferX platform?
                                        </a>
                                        <div className="collapse p-3" id="Ques10">
                                            <p className="mb-3 fs-14">
                                                Accepting the offer in OfferX Platform is very simple. Click on open
                                                offer Document against respective offer under Pending tab (Dashboard{' '}
                                                <i className="bi bi-chevron-right"></i> Job Offers{' '}
                                                <i className="bi bi-chevron-right"></i> Pending tab{' '}
                                                <i className="bi bi-chevron-right"></i> Open offer Document{' '}
                                                <i className="bi bi-chevron-right"></i> Accept offer) to view offer
                                                document and accept the offer by clicking accept offer.
                                            </p>
                                        </div>
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques11"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques11"
                                        >
                                            2. Can I accept multiple job offers in OfferX platform?
                                        </a>
                                        <div className="collapse p-3" id="Ques11">
                                            <p className="mb-3 fs-14">
                                                Yes, candidate can accept more than one offer(s) released by different
                                                employers using OfferX platform.
                                            </p>
                                        </div>
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques12"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques12"
                                        >
                                            3. Who all may see when I accept job offer in OfferX platform?
                                        </a>
                                        <div className="collapse p-3" id="Ques12">
                                            <p className="mb-3 fs-14">
                                                Accept an offer is a key decision taken by the candidate as part of
                                                recruitment process. The employer whose job offer has been accepted will
                                                have better visibility with details like Job Offer Accepted date, Job
                                                Start date, Offer letter etc.
                                            </p>
                                            <p className='fs-14'>
                                                However, rest of the employers in the OfferX platform can view a tag as{' '}
                                                <i>“This candidate has accepted an Offer”</i> and no details beyond this
                                                when visited your profile.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="flush-headingThree">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#plussix"
                                        aria-expanded="false"
                                        aria-controls="plussix"
                                    >
                                        OfferX In Mobile
                                    </button>
                                </h2>
                                <div
                                    id="plussix"
                                    className="accordion-collapse collapse"
                                    aria-labelledby="flush-headingThree"
                                    data-bs-parent="#accordionFlushExample"
                                >
                                    <div className="accordion-body">
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques14"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques14"
                                        >
                                            1. Can I accept offer from OfferX mobile application?
                                        </a>
                                        <div className="collapse p-3" id="Ques14">
                                            <p className="mb-3 fs-14">
                                                Yes, We are working on it and may release the mobile version soon.
                                            </p>
                                        </div>
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques15"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques15"
                                        >
                                            2. Can I sign up and sign in using OfferX mobile application?
                                        </a>
                                        <div className="collapse p-3" id="Ques15">
                                            <p className="mb-3 fs-14">
                                                Yes, We are working on it and may release the mobile version soon.
                                            </p>
                                        </div>
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques16"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques16"
                                        >
                                            3. Can I accept the offers using OfferX mobile application?
                                        </a>
                                        <div className="collapse p-3" id="Ques16">
                                            <p className="mb-3 fs-14">Yes, We are working on it and may release the mobile version soon.</p>
                                        </div>
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques24"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques24"
                                        >
                                            4. Does the login credentials be same for web and mobile application?
                                        </a>
                                        <div className="collapse p-3" id="Ques24">
                                            <p className="mb-3 fs-14">
                                                Yes, We are working on it and may release the mobile version soon.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="flush-headingThree">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#ReviewRating"
                                        aria-expanded="false"
                                        aria-controls="ReviewRating"
                                    >
                                        Review and Rating
                                    </button>
                                </h2>
                                <div
                                    id="ReviewRating"
                                    className="accordion-collapse collapse"
                                    aria-labelledby="flush-headingThree"
                                    data-bs-parent="#accordionFlushExample"
                                >
                                    <div className="accordion-body">
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques13"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques13"
                                        >
                                            1. What are the different types of reviews employers are entitled to write
                                            on candidate profiles?
                                        </a>
                                        <div className="collapse p-3" id="Ques13">
                                            <p className="mb-3 fs-14">
                                                Employers may write two types of reviews based on the scenario.
                                            </p>
                                            <ul>
                                                <li>Negative review and low rating.</li>
                                                <li>Positive review and good rating.</li>
                                            </ul>
                                        </div>
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques14"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques14"
                                        >
                                            2. When does low rating and negative review is written by an employer on my
                                            profile?
                                        </a>
                                        <div className="collapse p-3" id="Ques14">
                                            <p className="mb-3 fs-14">
                                                Candidate is entitled to receive a negative review and low rating when
                                                the Job offer terms and conditions are violated.
                                            </p>
                                        </div>
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques15"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques15"
                                        >
                                            3. When does good rating and positive review is written by an employer on my
                                            profile?
                                        </a>
                                        <div className="collapse p-3" id="Ques15">
                                            <p className="mb-3 fs-14">
                                                Candidate is entitled to receive a positive review and good feedback
                                                when the Job offer terms and conditions are honored.
                                            </p>
                                        </div>
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques16"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques16"
                                        >
                                            4. What happens if there are multiple negative reviews and low score on my
                                            profile?
                                        </a>
                                        <div className="collapse p-3" id="Ques16">
                                            <p className="mb-3 fs-14">
                                                Employers prefer candidates with positive review and high score.
                                            </p>
                                            <p className='fs-14'>
                                                Employers may least prefer candidates with negative review and less
                                                score.
                                            </p>
                                            <p className='fs-14'>
                                                You can increase the score by following the practices set in OfferX
                                                transparently.
                                            </p>
                                        </div>
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques17"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques17"
                                        >
                                            5. What happens if there are multiple positive reviews and high score on my
                                            profile?
                                        </a>
                                        <div className="collapse p-3" id="Ques17">
                                            <p className="mb-3 fs-14">
                                                Employers prefer candidates with positive review and high score.
                                                Candidates with high score and positive review fetch better job offers.
                                            </p>
                                        </div>
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques19"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques19"
                                        >
                                            6. I have accepted job offer in OfferX platform and not joined / onboarded
                                            as per offer letter. <br />
                                            a. What is the impact to me? <br />
                                            b.When can employer writes a negative review on my profile?
                                        </a>
                                        <div className="collapse p-3" id="Ques19">
                                            <p className="mb-3 fs-14">
                                                If you have not onboarded to your new employer as per offer letter, for
                                                a genuine reason reach out to your HR / Employer immediately Otherwise,
                                                your employer has authority to write a negative review and low rating
                                                after job joining date as you have ghosted which may impact your future
                                                recruitment process.
                                            </p>
                                        </div>
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques20"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques20"
                                        >
                                            7. I have noticed that employer has written a negative review and low rating
                                            on my profile when I have not onboarded for a genuine reason.
                                        </a>
                                        <div className="collapse p-3" id="Ques20">
                                            <p className="mb-3 fs-14">
                                                Employer makes all necessary attempts to reach you before initiating a
                                                negative review and low rating. However, if you still have a genuine
                                                reason and facts, please reach out to your employer asking for removal
                                                of negative review and rating.
                                            </p>
                                            <p className='fs-14'>
                                                All such requests may be considered case to case basis with sole
                                                desecration of employer.
                                            </p>
                                        </div>
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques21"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques21"
                                        >
                                            8. Employer has given a negative review and low rating by mistake even
                                            though I have onboarded on time. How can I resolve it?
                                        </a>
                                        <div className="collapse p-3" id="Ques21">
                                            <p className="mb-3 fs-14">
                                                It may happen rarely. However, you have the authority to raise a flag
                                                and reply with your concern against the negative for correction in a
                                                transparent way. Employers will correct such mistakes without any
                                                hesitation.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="flush-headingThree">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#ESign"
                                        aria-expanded="false"
                                        aria-controls="ESign"
                                    >
                                        e-Sign
                                    </button>
                                </h2>
                                <div
                                    id="ESign"
                                    className="accordion-collapse collapse"
                                    aria-labelledby="flush-headingThree"
                                    data-bs-parent="#accordionFlushExample"
                                >
                                    <div className="accordion-body">
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques22"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques22"
                                        >
                                            1. Do offer letter need to be signed?
                                        </a>
                                        <div className="collapse p-3" id="Ques22">
                                            <p className="mb-3 fs-14">
                                                As a candidate you need to e-sign the conditional job offer letter
                                                released by the employer to show your acceptance and to enforce a legal
                                                contract between candidate and employer.
                                            </p>
                                        </div>
                                        <a
                                            className="collapse-head collapsed w-100 d-block py-2"
                                            data-bs-toggle="collapse"
                                            href="#Ques23"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="Ques23"
                                        >
                                            2. Is e-sign valid in the court of law?
                                        </a>
                                        <div className="collapse p-3" id="Ques23">
                                            <p className="mb-3 fs-14">
                                                As a candidate you need to e-sign the conditional job offer letter
                                                released by the employer to show your acceptance and to enforce a legal
                                                contract between candidate and employer.
                                            </p>
                                            <p className="fw-600 fs-14">I have accepted an offer</p>
                                            <p className="mb-2 fs-14">
                                                Any job offer released by the employer is a conditional offer which
                                                comes with certain conditions imposed and with expiry date.
                                            </p>
                                            <p className="mb-2 fs-14">
                                                Any job offer which is released comes with offer Expiry date. Candidate
                                                has to read understand and Any job offer released by the employer has to
                                                be thoroughly.
                                            </p>
                                            <p className='fs-14'>
                                                Candidate has the option either to accept or reject the job offer within
                                                the offer expiry date.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default FAQ;
