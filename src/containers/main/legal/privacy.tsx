import React from 'react';
import { NavHashLink } from 'react-router-hash-link';
import { UseSetActiveClass } from '../../../hooks/set-active-class';

const Privacy = () => {
    UseSetActiveClass();

    return (
        <>
            <div className="w-100 mb-4">
                <h1 className="fw-700 fs-28">Privacy Policy</h1>
            </div>
            <div className="card vh-75">
                <div className="card-body py-0">
                    <div className="row no-gutters">
                        <div className="col-3 px-0">
                            <nav id="PrivacyPolicy" className="navbar flex-column align-items-stretch privacy-policy">
                                <nav className="nav nav-pills flex-column onscroll-nav-li">
                                    <NavHashLink className="nav-link" to="#Item-1">
                                        General
                                    </NavHashLink>
                                    <NavHashLink className="nav-link" to="#Item-2">
                                        How We Collect The Information
                                    </NavHashLink>
                                    <NavHashLink className="nav-link" to="#Item-3">
                                        Information We Collect
                                    </NavHashLink>
                                    <NavHashLink className="nav-link" to="#Item-4">
                                        How We Use Information
                                    </NavHashLink>
                                    <NavHashLink className="nav-link" to="#Item-5">
                                        Data Transfer
                                    </NavHashLink>
                                    <NavHashLink className="nav-link" to="#Item-6">
                                        Cookies
                                    </NavHashLink>
                                    <NavHashLink className="nav-link" to="#Item-7">
                                        Data Security
                                    </NavHashLink>
                                    <NavHashLink className="nav-link" to="#Item-8">
                                        Links To Third Party Site/Apps
                                    </NavHashLink>
                                    <NavHashLink className="nav-link" to="#Item-9">
                                        Social Network Plugins
                                    </NavHashLink>
                                    <NavHashLink className="nav-link" to="#Item-10">
                                        Sharing Of Personal Information
                                    </NavHashLink>
                                    <NavHashLink className="nav-link" to="#Item-11">
                                        Children
                                    </NavHashLink>
                                    <NavHashLink className="nav-link" to="#Item-12">
                                        Changes To This Policy
                                    </NavHashLink>
                                    <NavHashLink className="nav-link" to="#Item-13">
                                        Newsletter
                                    </NavHashLink>
                                </nav>
                            </nav>
                        </div>
                        <div className="col">
                            <div className="p-3" data-bs-offset="0">
                                <div id="Item-1">
                                    <p className="fs-13">
                                        <span className="fw-600">Effective Date:</span> February 17, 2022
                                    </p>
                                    <p className="fs-13 mb-3">
                                        <span className="fw-600">Platform Covered:</span> www.offerx.in
                                    </p>
                                    <h4 className="mb-3">General</h4>
                                    <p className="mb-3 text-justify fs-14">
                                        This Privacy policy describes how Wallero Technologies Pvt. Ltd. and its
                                        affiliates (collectively “Wallero, we, our, us” Clearly define that OfferX is a
                                        Neutral platform and connects the employer and the candidate primarily. We
                                        collect, use, share or otherwise process your personal information through
                                        OfferX website www.offerx.in, its mobile application and m-site (hereinafter
                                        referred to as the “Platform”).
                                    </p>
                                    <ol>
                                        <li className="text-justify fs-14 mb-3">
                                            This Website with the URL of www.offerx.in ("Website/Site") is operated by
                                            Wallero Technologies private limited ("We/Our/Us"). We are committed to
                                            protecting and respecting your privacy. We do collect your personal
                                            information and process your personal data in accordance with the IT Act,
                                            2000 (21 of 2000) and other national and state laws which relate the
                                            processing of personal data. Please read the following carefolly to
                                            understand our views and practices regarding your personal data before
                                            login.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            When you use our platform, we collect your personal information in order to
                                            provide and continually improve our products and services.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            Our privacy policy is subject to change at any time without notice. To make
                                            sure you are aware of any changes, please review this policy periodically.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            All partner firms and any third-party working with or for Us, and who have
                                            access to personal information, will be expected to read and comply with
                                            this policy. No third party may access or process sensitive personal
                                            information held by Us without having first entered into a confidentiality
                                            agreement.
                                        </li>
                                    </ol>
                                </div>
                                <div id="Item-2">
                                    <h4>How We Collect The Information</h4>
                                    <ol>
                                        <li className="text-justify fs-14 mb-3">
                                            From you directly and through this Site: We may collect information through
                                            the Website when you visit. The data we collect depends on the context of
                                            your interactions with our Website.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            Through business interaction: We may collect information through business
                                            interaction with you or your employees.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            From other sources: We may receive information from other sources, such as
                                            public database, joint marketing partners; when you login to Social Media
                                            Platforms like Outlook, LinkedIn, Google; or other third parties such as:
                                            GST database, Aadhaar DataBase and other databases.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            Information about your interactions with the products and services offered
                                            by our subsidiaries VIZ. Outlook, Linkedin, Google.
                                        </li>
                                    </ol>
                                </div>
                                <div id="Item-3">
                                    <h4>Information We Collect</h4>
                                    <ol>
                                        <li className="text-justify fs-14 mb-3">
                                            We collect information primarily to provide better services to all of our
                                            customers.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            We collect the following information from you when you use or sign in on our
                                            website: Full Name, Date Of Birth, Gender, email ID, Phone Number, Address
                                            and Pin Code, Photograph.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            We do collect the following personal sensitive information from you when you
                                            use or signup on our Website: Email address, Mobile Number and last 4 Digit
                                            of Aadhaar Number, History of your employment, service Experience,
                                            Educational Qualifications.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            When you visit our Site, some information is automatically collected. This
                                            may include information such as the Operating Systems (OS) running on your
                                            device, Internet Protocol (IP) address, access times, browser type, and
                                            language, and the website you visited before our Site. We also collect
                                            information about how you use Our products or services.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            We automatically update to offer information and update to offer history,
                                            which we sometimes aggregate with similar AI/ML to compare multiple offers
                                            of the candidate and with offers of the pool of the candidate information
                                            from other customers to create features such as Best offer, Best
                                            Employer/Employee, etc similarly genuine feedback will be updated Viz low
                                            ranking, etc...
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            The full Uniform Resource Locators (URL) clickstream to, through and from
                                            our website (including date and time); cookie number; products and/or
                                            content you viewed or searched for, page response times; download errors;
                                            length of visits to certain pages; page interaction information (such as
                                            scrolling, clicks, and mouse-hovers).
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            We automatically collect information using "Cookies". Cookies are small data
                                            files stored on your hard drive the websites. Among other things, cookies
                                            help us improve our Site, our marketing activities, and your experience. We
                                            use cookies to see which areas and features are popular and to count visits
                                            to our Site.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            Most Web browsers are set to accept cookies by default. If you prefer, you
                                            can choose to set your browser to remove cookies and to reject cookies. If
                                            you set your browser to reject cookies, some features will be unavailable.
                                            For more information on how to reject cookies, see your browser's
                                            instructions on changing your cookie settings.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            By using this Website, you are agreeing that We may advertise your feedback
                                            on the Website and marketing materials.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            We will retain your information as long as we require this to provide you
                                            with the job offers and services and for such period as mandated by the
                                            concerned laws.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            If you opt to receive marketing correspondence from us, subscribe to our
                                            mailing list or newsletters, enter into any of our competitions or provide
                                            us with your details at networking events, we may use your personal data for
                                            our legitimate interests in order to provide you with details about our
                                            services, business updates and events.
                                        </li>
                                    </ol>
                                </div>
                                <div id="Item-4">
                                    <h4>How We Use Information?</h4>
                                    <ul>
                                        <li className="text-justify fs-14 mb-3">
                                            We use the information with uniqueness explicitly, overtly to improve,
                                            maintain, protect and to develop our current products and services.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            We use the information collected through this website as described in this
                                            policy and we may use your information to:
                                        </li>
                                    </ul>
                                    <div className="ps-5">
                                        <ol>
                                            <li className="text-justify fs-14 mb-3">
                                                Improve our services, Site and how we operate our businesses.
                                            </li>
                                            <li className="text-justify fs-14 mb-3">
                                                Understand and enhance your experience using our Site, products and
                                                services.
                                            </li>
                                            <li className="text-justify fs-14 mb-3">
                                                Personalize our products or services and make recommendations.
                                            </li>
                                            <li className="text-justify fs-14 mb-3">
                                                Provide and deliver products and services you request.
                                            </li>
                                            <li className="text-justify fs-14 mb-3">
                                                Process, manage, complete, and account for transactions.
                                            </li>
                                            <li className="text-justify fs-14 mb-3">
                                                Provide customer support and respond to your requests, comments, and
                                                inquiries.
                                            </li>
                                            <li className="text-justify fs-14 mb-3">
                                                Create and manage the online accounts you manage on our website.
                                            </li>
                                            <li className="text-justify fs-14 mb-3">
                                                Send you related information, including confirmations, invoices,
                                                technical notices, updates, security alerts and support and
                                                administrative messages.
                                            </li>
                                            <li className="text-justify fs-14 mb-3">
                                                Communicate with you about promotions, upcoming events and news about
                                                products and services.
                                            </li>
                                            <li className="text-justify fs-14 mb-3">
                                                We may process your personal information without your knowledge or
                                                consent wherever required by applicable law or regulation for the
                                                purposes of verification of identity or for prevention, detection or
                                                investigation, including of cyber incidents, prosecution and punishment
                                                of offences.
                                            </li>
                                            <li className="text-justify fs-14 mb-3">
                                                Protect, investigate and deter against fraudulent, unauthorized or
                                                illegal activity.
                                            </li>
                                            <li className="text-justify fs-14 mb-3">
                                                We use this information to do internal research on our users'
                                                demographics, interests, and behaviour to better understand, protect and
                                                serve our users. This information is compiled and analysed on an
                                                aggregated basis.
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                                <div id="Item-5">
                                    <h4>Data Transfer</h4>
                                    <ol>
                                        <li className="text-justify fs-14 mb-3">
                                            Information about our user is an important part of our business and we take
                                            due care to protect the same.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            We share your data with your consent or to complete any transaction or
                                            provide any product or service you have requested or authorized. We also
                                            share data with our affiliates and subsidiaries, with vendors working on our
                                            behalf.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            We may employ other companies and individuals to perform functions on our
                                            behalf. The functions include products or services and e-mail, removing
                                            repetitive information, providing marketing assistance, providing search
                                            results and links (including paid listings and links), processing payments,
                                            transmitting content, scoring credit risk, and providing customer service.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            These third-party service providers have access to personal information
                                            needed to perform their functions but may not use it for other purposes.
                                            Further, they must process the personal information in accordance with this
                                            Privacy Policy and as permitted by applicable data protection laws.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            We release account and other personal information when we believe is
                                            appropriate to comply with the law, enforce or apply our conditions of use,
                                            and other agreements, protect the rights, property or safety of Us, our
                                            users or others. This includes candidates offer accepted information,
                                            blacklisted candidate and organizations Review of employer rating and
                                            review, especially Negative or fraud protection.
                                        </li>
                                    </ol>
                                </div>
                                <div id="Item-6">
                                    <h4>Cookies</h4>
                                    <ul>
                                        <li className="text-justify fs-14 mb-3">
                                            To optimize our web presence, we use cookies. These are small text files
                                            stored on your computer's main memory. These cookies are deleted after you
                                            close the browser. Other cookies remain on your computer (long-term cookies)
                                            and permit its recognition on your next visit or your next sign in. This
                                            allows us to improve your access to our site. This helps us to learn more
                                            about your interests, and provide you with essential features and services
                                            and for additional purposes, including:
                                        </li>
                                    </ul>
                                    <div className="ps-5">
                                        <ol>
                                            <li className="text-justify fs-14 mb-3">
                                                Keep track of offer management process.
                                            </li>
                                            <li className="text-justify fs-14 mb-3">
                                                Conducting research and diagnostics to improve the content, products,
                                                and services.
                                            </li>
                                            <li className="text-justify fs-14 mb-3">Preventing fraudulent activity.</li>
                                            <li className="text-justify fs-14 mb-3">Improving security.</li>
                                        </ol>
                                    </div>
                                    <ul>
                                        <li className="text-justify fs-14 mb-3">
                                            Our cookies allow you to take advantage of some of our essential features.
                                            For instance, if you block or otherwise reject our cookies, you will not be
                                            able to add items to your shopping basket, proceed to checkout, or use any
                                            products or services that require you to sign in.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            Approved third parties also may set cookies when you interact with Our
                                            services.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            Third parties include search engines, providers of measurement and analytics
                                            services, social media networks, and advertising companies.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            Third parties use cookies in the process of delivering content, including
                                            ads relevant to your interests, to measure the effectiveness of their ads,
                                            and to perform services on behalf of Us.
                                        </li>
                                        <li className="text-justify fs-14 mb-3">
                                            You can prevent the storage of cookies by choosing a "disable cookies"
                                            option in your browser settings. But this can limit the functionality of our
                                            services.
                                        </li>
                                    </ul>
                                </div>
                                <div id="Item-7">
                                    <h4>Data Security</h4>
                                    <ol>
                                        <li className="text-justif fs-14 mb-3">
                                            We take due care to protect customer data. Technical measures are in place
                                            to prevent unauthorized or unlawful access to data and against accidental
                                            loss or destruction of, or damage to data. The employees who are dealing
                                            with the data have been trained to protect the data from any illegal or
                                            unauthorized usage.We allow only verified candidates and employers.
                                        </li>
                                        <li className="text-justif fs-14 mb-3">
                                            We work to protect the security of your information during transmission by
                                            using Secure Sockets Locker (SSL) software, which encrypts information you
                                            input. SSL allows sensitive information such as credit card numbers, eKYC,
                                            eSign, UID's and login credentials to be transmitted securely.
                                        </li>
                                        <li className="text-justif fs-14 mb-3">
                                            We follow the Payment Card Industry Data Security Standard (PCI DSS) when
                                            handling branded credit cards from the major card schemes.
                                        </li>
                                        <li className="text-justif fs-14 mb-3">
                                            We maintain physical, electronic, and procedural safeguards in connection
                                            with the collection, storage, and disclosure of personal customer
                                            information.
                                        </li>
                                        <li className="text-justif fs-14 mb-3">
                                            We take reasonable steps to help protect your personal information in an
                                            effort to prevent the loss, misuse, and unauthorized access, disclosure
                                            alteration and destruction. It is your responsibility to protect your user
                                            names and passwords to help prevent anyone from accessing or abusing your
                                            accounts and services.
                                        </li>
                                        <li className="text-justif fs-14 mb-3">
                                            It is important for you to protect against unauthorized access to your
                                            password and your computers, devices, and applications. Be sure to sign off
                                            when you finish using a shared computer.
                                        </li>
                                        <li className="text-justif fs-14 mb-3">
                                            Information you provide to us is shared on our secure servers. We have
                                            implemented appropriate physical, technical and organizational measures
                                            designed to secure your information against accidental loss and unauthorized
                                            access, use, alteration or disclosure. In addition, we limit access to
                                            personal data to those employees, agents, contractors, and other third
                                            parties that have a legitimate business need for such access.
                                        </li>
                                        <li>
                                            Information collected from you will be stored XXXX as required to complete
                                            the transaction entered into with you.
                                        </li>
                                    </ol>
                                </div>
                                <div id="Item-8" className="mb-3">
                                    <h4>Links To Third Party Site/Apps</h4>
                                    <p className='fs-14'>
                                        Our Site may, from time to time, contain links to and from other websites of
                                        third parties such as Graph5, ScreenX, KYC vendors and e-sign vendors.
                                    </p>
                                    <p className='fs-14'>
                                        Please note that if you follow a link to any of these websites, such websites
                                        will apply different terms to the collection and privacy of your personal data
                                        and we do not accept any responsibility or liability for these policies. When
                                        you leave our Site, we encourage you to read the privacy policy of every website
                                        you visit.
                                    </p>
                                </div>
                                <div id="Item-9" className="mb-3">
                                    <h4>Social Network Plugins</h4>
                                    <p className='fs-14'>
                                        This Website incorporates plugins and/or buttons for social networks, in order
                                        to allow easy sharing on your favourite social networks. These plugins are
                                        programmed so as not to set any cookies when assessing the page to safeguard the
                                        privacy of users. The collection and use of information obtained by means of the
                                        plugin are governed by the respective privacy policies of the social networks.
                                    </p>
                                </div>
                                <div id="Item-10">
                                    <h4>Sharing Of Personal Information</h4>
                                    <ul>
                                        <li className="text-justif fs-14 mb-3">
                                            We do not share your personal data with third parties without your prior
                                            consent other than.
                                        </li>
                                        <li className="text-justif fs-14 mb-3">
                                            With third parties who work on our behalf provided such third parties adhere
                                            to the data protection principles set out in the IT Act, 2000 (21 of 2000)
                                            and other applicable legislation or enter into a written agreement with Us
                                            requiring that the third party provide at least the same level of privacy
                                            protection as is required by such principles.
                                        </li>
                                        <li className="text-justif fs-14 mb-3">
                                            To comply with laws or to respond to lawful requests and legal process.
                                        </li>
                                        <li className="text-justif fs-14 mb-3">
                                            To protect the rights and property of Us, our agents, customers, and others
                                            including to enforce our agreements, policies and terms of use.
                                        </li>
                                        <li className="text-justif fs-14 mb-3">
                                            In an emergency, including to protect the personal safety and identify the
                                            person who write a unprofessional review.
                                        </li>
                                        <li className="text-justif fs-14 mb-3">
                                            For the purpose of a business deal (or negotiation of a business deal)
                                            involving the sale or transfer of all or a part of our business or assets
                                            (business deals may include, for example, any merger, financing,
                                            acquisition, divestiture or bankruptcy transaction or proceeding).
                                        </li>
                                    </ul>
                                    <p className="fw-600 fs-16 mb-2">
                                        Transparency in Reviews (Reviews shall be referred as Contents).
                                    </p>
                                    <p className="text-justif fs-14 mb-3">
                                        We encourage the employer, employees and job candidates to share honest reviews.
                                        We will remove positive reviews where we have evidence that employees were
                                        compensated and/or coerced into leaving a review or had offered incentives in
                                        exchange for reviews.
                                    </p>
                                    <ul>
                                        <li className="text-justif fs-14 mb-3">
                                            The Reviews shall be transparent, genuine and authentic.
                                        </li>
                                    </ul>
                                    <div className="ms-4 p-3 alert alert-warning fs-14">
                                        <b>Note:</b> The review will be more credible if you use good grammar, spelling
                                        and punctuation. Your writing doesn't have to be perfect, but it should be at
                                        least understandable. We reject reviews with excessive capitalization,
                                        gibberish, or filler words/special characters.
                                    </div>
                                    <p className="mb-3">
                                        The opinions expressed in reviews are those of users and not of Wallero
                                        Technologies Pvt.Ltd or any of its subsidiaries.
                                    </p>

                                    <div className="ps-4">
                                        <ol>
                                            <li className="text-justif fs-14 mb-3">
                                                To include both pro and con statements to provide a thoroughly balanced
                                                review. A balanced review can make for a better community experience.
                                            </li>
                                            <li className="text-justif fs-14 mb-3">
                                                The Reviews of Employer and Employee shall be posted publicly at their
                                                own risk and Wallero Technologies Pvt.Ltd will not be legally
                                                responsible for the respective reviews of the company or by the
                                                candidate.
                                            </li>
                                            <li className="text-justif fs-14 mb-3">
                                                Employer and Employee Reviews shall be transparent and genuine; no usage
                                                of unparliamentary language, threats of violence, racism, or
                                                discriminatory language targeted at an individual or group, tarnishing
                                                the image of the employer or an employee shall be strictly prohibited.{' '}
                                            </li>
                                            <li className="text-justif fs-14 mb-3">
                                                Any reliance you place on such information is strictly at your own risk
                                                (Employee/Employer. We disclaim all liabilities and responsibilities
                                                arising from any reliance placed on such information by you or any other
                                                visitor to the Website, or by anyone who may be informed of any of its
                                                contents.
                                            </li>
                                            <li className="text-justif fs-14 mb-3">
                                                If a particular review gets flagged or reported, removing it completely
                                                would be at our sole discretion. Please keep in mind that flagging a
                                                piece of content for a second look does not guarantee that it will be
                                                removed from the site. Because of the diversity of our community, it's
                                                possible that something could be disagreeable or disturbing to you
                                                without meeting the criteria for being removed or blocked.
                                            </li>
                                            <li className="text-justif fs-14 mb-3">
                                                Each individual shall submit only one review per review type (company
                                                review, interview review, take home salary, etc.), per employer or
                                                interviewing company, per year.
                                            </li>
                                            <li className="text-justif fs-14 mb-3">
                                                The content should be related to jobs you have held or interviews you
                                                have attended within the past five years.
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                                <div id="Item-11" className="mb-3">
                                    <h4>Children</h4>
                                    <p className='fs-14'>
                                        If you are under 18, or the age of majority in the jurisdiction in which you
                                        reside, you may only use Our Website with the consent of your parent or legal
                                        guardian. In any case, We will not be liable for any cause of action that arose
                                        due to non-compliance with this section.
                                    </p>
                                </div>
                                <div id="Item-12" className="mb-3">
                                    <h4>Changes To This Policy</h4>
                                    <p className='fs-14'>
                                        We may change this policy from time to time. If we make any changes to this
                                        policy, we will change the "Last Updated" date above. You agree that your
                                        continued use of our services after such changes have been published to our
                                        services will constitute your acceptance of such revised policy.
                                    </p>
                                </div>
                                <div id="Item-13">
                                    <h4>Newsletter</h4>
                                    <p className="mb-3 fs-14">
                                        Following subscription to the newsletter, your e-mail address is used for our
                                        advertising purposes until you cancel the newsletter again. Cancellation is
                                        possible at any time. The following consent has been expressly granted by you
                                        separately, or possibly in the course of an ordering process: (I am accepting to
                                        receive newsletter from this website), you may revoke your consent at any time
                                        with future effect. If you no longer want to receive the newsletter, then
                                        unsubscribe by clicking on unsubscribe option given in the email footer.
                                    </p>
                                    <p className="mb-3 fs-14">
                                        If you have any concern about privacy or grievances with Us, please contact us
                                        with a thorough description and we will try to resolve the issue for you.
                                    </p>
                                </div>
                                <div className="mb-5">
                                    <h4>Contact Details:</h4>
                                    <p className="mb-2 fs-14">
                                        <i className="bi bi-person lt-text-primary-alt" /> OfferX Support
                                    </p>
                                    <p className="mb-2 fs-14">
                                        <i className="bi bi-envelope lt-text-primary-alt" />{' '}
                                        <a href="mailto: support@offerx.in">support@offerx.in</a>
                                    </p>
                                    {/* <p className="mb-2">
                                        <i className="bi bi-telephone lt-text-primary-alt" /> <a href="tel: +919000012345">+91 90000 12345</a>
                                    </p> */}
                                    <p className="mb-2 fs-14">
                                        <i className="bi bi-geo-alt lt-text-primary-alt" /> Wallero Technologies Pvt.
                                        Ltd., <br /> #1803, Manjeera Trinity Corporate, JNTU Road, KPHB Colony,
                                        Hyderabad - 500072.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Privacy;
