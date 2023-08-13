import React, { useCallback, useEffect, useState } from 'react';
import getValue from 'lodash/get';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { boolean as booleanYup, object as objectYup, string as stringYup } from 'yup';
import { Field, FieldProps, Formik, FormikHelpers, FormikProps } from 'formik';
import MainHeader from './header';
import Footer from './footer';
import Co from '../../assets/img/contact-us.png';
import { useScript } from '../../hooks/script';
import { ManagerFormsType } from '../../types/auth';
import useInitialErrors from '../../hooks/formik-initial-errors';
import { emailRegexp } from '../../lib/utils/validation';
import { EmailFormType } from '../../types/email';
import { emailService } from '../../lib/api/email';
import { routes } from '../routes/routes-names';
import Success from '../../components/success-modal';

const initialValues = {
    name: '',
    email: '',
    message: '',
    agreement: false,
};
const Contact = () => {
    const [successShow, setSuccessShow] = useState<boolean>(false);

    const aosReady = useScript('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js');
    const initialErrors = useInitialErrors(initialValues, getValidationSchema());

    const submitForm = useCallback(async (values: EmailFormType, { resetForm }: FormikHelpers<EmailFormType>) => {
        const { agreement, ...data } = values;
        try {
            await emailService.create(data);
            setSuccessShow(true);
            resetForm({ values: initialValues });
        } catch (err) {
        }
    }, []);

    useEffect(() => {
        if (!aosReady) return;
        window.AOS?.init();
    }, [aosReady]);

    return (
        <>
            <MainHeader />
            <section className="bg-white">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 ps-lg-0 mb-5 mb-lg-0">
                            <div data-aos="fade-up" data-aos-delay="200">
                                <div className="text-center text-lg-start">
                                    <h2 className="fw-600 mb-5 fs-32">Contact Us</h2>
                                </div>
                                <p className="mb-3 fs-16">
                                    We'd also like to hear your suggestions for future updates and features - so don't
                                    hesitate to have your say. Comments and feedback are always appreciated!
                                </p>
                                <p className="mb-4 fs-16">
                                    Don't hesitate to give us a call or send us a contact form message.
                                </p>
                                <div className="fs-16">
                                    {/* <div className="d-block my-2">
                                        <i className="bi bi-telephone lt-text-primary-default me-2" /> 
                                        <a
                                            className="my-2 lt-text-primary text-decoration-none"
                                            href="tel: +914048512310"
                                        >
                                            +91 40 - 48512310
                                        </a>
                                    </div> */}
                                    <div className="d-block my-2">
                                        <i className="bi bi-envelope lt-text-primary-default me-2" />
                                        <a
                                            className="my-2 lt-text-primary text-decoration-none"
                                            href="mailto: support@offerx.in"
                                        >
                                            support@offerx.in
                                        </a>
                                    </div>
                                    <div className="d-block my-2">
                                        <i className="bi bi-geo-alt lt-text-primary-default" /> Unit No. 1803, Manjeera
                                        Trinity Corporate, JNTU-Hitech City Road, Kukatpally, Hyderabad – 500 072,
                                        Telangana, India
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 text-center">
                            <div
                                className="contact-pic text-center text-lg-end"
                                data-aos="fade-up"
                                data-aos-delay="200"
                            >
                                <img src={Co} alt="" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="ContactForm">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 lt-contact ps-lg-0 mb-5 mb-lg-0">
                            <iframe
                                title="Reach Us Office Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.3289585582775!2d78.39145951532258!3d17.491803404388254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb918d3088147b%3A0x1edb904a419c2ef6!2sWallero%20Technologies%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1647418831880!5m2!1sen!2sin"
                                className="w-100 h-100 map-height"
                                loading="lazy"
                            ></iframe>
                        </div>
                        <div
                            className="col-lg-6 lt-contact border-end-0 pe-lg-0"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <div className="text-center text-lg-start">
                                <div className="lt-header-line" />
                                <h2 className="fw-600 mb-5 fs-32">Get In Touch</h2>
                            </div>
                            <Formik
                                onSubmit={submitForm}
                                enableReinitialize
                                initialValues={initialValues}
                                validationSchema={getValidationSchema()}
                                initialErrors={initialErrors}
                            >
                                {(formikProps: FormikProps<ManagerFormsType>) => {
                                    const { handleSubmit, isSubmitting, setFieldTouched, setFieldValue } = formikProps;
                                    return (
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group mb-4">
                                                <Field name="name">
                                                    {(fieldProps: FieldProps) => {
                                                        const { field, form } = fieldProps;
                                                        const error =
                                                            getValue(form.touched, field.name) &&
                                                            getValue(form.errors, field.name);
                                                        return (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    value={field.value}
                                                                    onChange={(ev) => {
                                                                        setFieldTouched(field.name);
                                                                        setFieldValue(field.name, ev.target.value);
                                                                    }}
                                                                    className={`form-control border-default ${
                                                                        error ? 'is-invalid' : ''
                                                                    }`}
                                                                    placeholder="Name"
                                                                />
                                                                <small className="text-danger">{error}</small>
                                                            </>
                                                        );
                                                    }}
                                                </Field>
                                            </div>
                                            <div className="form-group mb-4">
                                                <Field name="email">
                                                    {(fieldProps: FieldProps) => {
                                                        const { field, form } = fieldProps;
                                                        const error =
                                                            getValue(form.touched, field.name) &&
                                                            getValue(form.errors, field.name);
                                                        return (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    value={field.value}
                                                                    onChange={(ev) => {
                                                                        setFieldTouched(field.name);
                                                                        setFieldValue(field.name, ev.target.value);
                                                                    }}
                                                                    className={`form-control border-default ${
                                                                        error ? 'is-invalid' : ''
                                                                    }`}
                                                                    placeholder="Email"
                                                                />
                                                                <small className="text-danger">{error}</small>
                                                            </>
                                                        );
                                                    }}
                                                </Field>
                                            </div>
                                            <div className="form-group mb-4">
                                                <Field name="message">
                                                    {(fieldProps: FieldProps) => {
                                                        const { field, form } = fieldProps;
                                                        const error =
                                                            getValue(form.touched, field.name) &&
                                                            getValue(form.errors, field.name);
                                                        return (
                                                            <>
                                                                <textarea
                                                                    value={field.value}
                                                                    onChange={(ev) => {
                                                                        setFieldTouched(field.name);
                                                                        setFieldValue(field.name, ev.target.value);
                                                                    }}
                                                                    className={`form-control border-default ${
                                                                        error ? 'is-invalid' : ''
                                                                    }`}
                                                                    placeholder="Your Message"
                                                                    rows={6}
                                                                />
                                                                <small className="text-danger">{error}</small>
                                                            </>
                                                        );
                                                    }}
                                                </Field>
                                            </div>
                                            <div className="w-100 mb-2 d-flex">
                                                <Field name="agreement">
                                                    {(fieldProps: FieldProps) => {
                                                        const { field, form } = fieldProps;
                                                        const error =
                                                            getValue(form.touched, field.name) &&
                                                            getValue(form.errors, field.name);
                                                        return (
                                                            <>
                                                                <div className="d-flex align-items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={field.value}
                                                                        onChange={(ev) => {
                                                                            setFieldTouched(field.name);
                                                                            setFieldValue(
                                                                                field.name,
                                                                                ev.target.checked
                                                                            );
                                                                        }}
                                                                        id="IAgree"
                                                                        className="me-2"
                                                                    />
                                                                    <label
                                                                        htmlFor="IAgree"
                                                                        className={
                                                                            error
                                                                                ? 'text-danger fs-12 fw-400'
                                                                                : 'fs-12 fw-400'
                                                                        }
                                                                    >
                                                                        I have read and agree with the{' '}
                                                                        <Link to={routes.privacy} target="_blank">
                                                                            Privacy Policy
                                                                        </Link>{' '}
                                                                        and{' '}
                                                                        <Link to={routes.terms} target="_blank">
                                                                            Terms & Conditions
                                                                        </Link>
                                                                    </label>
                                                                </div>
                                                            </>
                                                        );
                                                    }}
                                                </Field>
                                            </div>
                                            <button
                                                className="btn btn-primary text-white"
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting && <span className="spinner-border spinner-border-sm" />}{' '}
                                                Submit
                                            </button>
                                        </form>
                                    );
                                }}
                            </Formik>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <Success
                message="Message sent successfully!"
                title="Thank You!"
                successShow={successShow}
                setSuccessShow={setSuccessShow}
            />
        </>
    );
};

export default Contact;

const getValidationSchema = () =>
    objectYup().shape({
        name: stringYup()
            .required('Name is required and must be at least 3 characters.')
            .min(3, 'Name must be at least 3 characters.'),
        email: stringYup().required('Email is required.').matches(emailRegexp, {
            message: 'Invalid email format.',
        }),
        message: stringYup()
            .required('Message is required and must be at least 3 characters.')
            .min(3, 'Message must be at least 3 characters.'),
        agreement: booleanYup().oneOf([true]),
    });
