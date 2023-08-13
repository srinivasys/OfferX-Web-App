import React, { useCallback, useEffect, useMemo } from 'react';
import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { boolean as booleanYup, object as objectYup, string as stringYup } from 'yup';
import getValue from 'lodash/get';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import MaskedInput from 'react-text-mask';
import useInitialErrors from '../../hooks/formik-initial-errors';
import { emailRegexp, gstRegexp, mobileMask, siteRegexp } from '../../lib/utils/validation';
import { ManagerFormsType, ManagerRequestType } from '../../types/auth';
import { RootState } from '../../redux';
import { authService } from '../../lib/api/auth';
import { deleteReduxProfile } from '../../redux/registration';
import { goToRoom } from './utils';
import PageLoader from '../../components/loader';
import { cityOptions, CitySelectOptionType } from '../../lib/utils/select';
import { routes } from '../routes/routes-names';
import imgFlag from '../../assets/icons/flag.png';
import websitelogo from '../../assets/img/offerx-logo.png';
import { ReactComponent as Icon404 } from '../../assets/icons/404.svg';

type Props = {
    managerId?: string;
};

const initialFormData = {
    FirstName: '',
    MiddleName: '',
    LastName: '',
    Email: '',
    CompanyName: '',
    GstNumber: '',
    CompanyAddress: '',
    CityDistrict: '',
    State: '',
    Country: 'India',
    PostalCode: '',
    CompanyEmail: '',
    Phone: '',
    WebSite: '',
    isTermsChecked: false,
};

const ManagerForm: React.FC<Props> = ({ managerId }) => {
    const dispatch = useDispatch();
    const reduxProfile = useSelector((state: RootState) => state.registration.profile);

    const profileFormData = useMemo(
        () =>
            reduxProfile
                ? {
                      ...initialFormData,
                      FirstName: reduxProfile.firstName,
                      LastName: reduxProfile.lastName,
                      Email: reduxProfile.email,
                  }
                : initialFormData,
        [reduxProfile]
    );

    const initialErrors = useInitialErrors(profileFormData, getValidationSchema());

    const submitForm = useCallback(
        async (values: ManagerFormsType) => {
            if (!reduxProfile) return;
            const requestData: ManagerRequestType = {
                ...values,
                Phone: values.Phone,
                GstNumber: values.GstNumber === '' ? null : values.GstNumber,
                AuthType: reduxProfile.authType,
                Token: reduxProfile.token,
            };
            try {
                const data = await authService.managerSignUp(requestData);
                if (data) {
                    dispatch(deleteReduxProfile());
                    await goToRoom(data, dispatch);
                }
            } catch (err) {
            }
        },
        [reduxProfile, dispatch]
    );

    // Join manager by invitation
    useEffect(() => {
        if (!managerId || !reduxProfile) return;
        (async function () {
            try {
                await authService.managerJoinByInvitation({
                    Email: reduxProfile.email,
                    InvitationId: managerId,
                });
                const data = await authService.socialSignIn({
                    Email: reduxProfile.email,
                    AuthType: reduxProfile.authType,
                    Token: reduxProfile.token,
                });
                if (data) {
                    dispatch(deleteReduxProfile());
                    await goToRoom(data, dispatch);
                }
            } catch (err) {
            }
        })();
    }, [managerId, dispatch, reduxProfile]);

    return !!managerId ? (
        <div className="full-height-modal">
            <Icon404 />
            <div className="mt-4 fs-16 fw-600">The email id does not match with the invited email id.</div>
        </div>
    ) : (
        <Formik
            onSubmit={submitForm}
            enableReinitialize
            initialValues={profileFormData}
            validationSchema={getValidationSchema()}
            initialErrors={initialErrors}
        >
            {(formikProps: FormikProps<ManagerFormsType>) => {
                const { handleSubmit, values, isSubmitting, setFieldTouched, setFieldValue } = formikProps;
                return (
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="d-flex lt-employer-registration-header">
                                <div className="col-2">
                                    <div className="header-divider">
                                        <img src={websitelogo} className="site-logo" alt="OfferX Logo" />
                                    </div>
                                </div>
                                <div className="col">
                                    <h1 className="fs-20 fw-400 py-2 mb-4 px-2">Employer Registration</h1>
                                </div>
                            </div>
                            <div className="registration-modal">
                                <div className="row mb-3 align-items-center">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">
                                            First Name <span className="lt-text-error">*</span>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <Field name="FirstName">
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
                                                            maxLength={250}
                                                            onChange={(ev) => {
                                                                setFieldTouched(field.name);
                                                                setFieldValue(field.name, ev.target.value);
                                                            }}
                                                            className={`form-control ${error ? 'is-invalid' : ''}`}
                                                            placeholder="Enter your first name"
                                                        />
                                                        <small className="text-danger">{error}</small>
                                                    </>
                                                );
                                            }}
                                        </Field>
                                    </div>
                                </div>
                                <div className="row mb-3 align-items-center">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">Middle Name</label>
                                    </div>
                                    <div className="col">
                                        <Field name="MiddleName">
                                            {(fieldProps: FieldProps) => {
                                                const { field } = fieldProps;
                                                return (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={field.value}
                                                            maxLength={200}
                                                            onChange={(ev) => {
                                                                setFieldTouched(field.name);
                                                                setFieldValue(field.name, ev.target.value);
                                                            }}
                                                            className="form-control"
                                                            placeholder="Enter your middle name"
                                                        />
                                                    </>
                                                );
                                            }}
                                        </Field>
                                    </div>
                                </div>
                                <div className="row mb-3 align-items-center">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">
                                            Last Name <span className="lt-text-error">*</span>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <Field name="LastName">
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
                                                            maxLength={200}
                                                            onChange={(ev) => {
                                                                setFieldTouched(field.name);
                                                                setFieldValue(field.name, ev.target.value);
                                                            }}
                                                            className={`form-control ${error ? 'is-invalid' : ''}`}
                                                            placeholder="Enter your last name"
                                                        />
                                                        <small className="text-danger">{error}</small>
                                                    </>
                                                );
                                            }}
                                        </Field>
                                    </div>
                                </div>
                                <div className="row mb-3 align-items-center">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">
                                            Login email 
                                        </label>
                                    </div>
                                    <div className="col">
                                        <input type="text" className="form-control" value={values.Email} disabled />
                                    </div>
                                </div>
                                <div className="row mb-3 align-items-center">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">
                                            Company name as in GST return <span className="lt-text-error">*</span>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <Field name="CompanyName">
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
                                                            maxLength={350}
                                                            onChange={(ev) => {
                                                                setFieldTouched(field.name);
                                                                setFieldValue(field.name, ev.target.value);
                                                            }}
                                                            className={`form-control ${error ? 'is-invalid' : ''}`}
                                                            placeholder="Enter your company name as in GST return"
                                                        />
                                                        <small className="text-danger">{error}</small>
                                                    </>
                                                );
                                            }}
                                        </Field>
                                    </div>
                                </div>
                                <div className="row mb-3 align-items-center">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">
                                            Company GST no. <span className="lt-text-error">*</span>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <Field name="GstNumber">
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
                                                            className={`form-control text-uppercase ${
                                                                error ? 'is-invalid' : ''
                                                            }`}
                                                            placeholder="Enter your company GST number"
                                                            maxLength={15}
                                                        />
                                                        <small className="text-danger">{error}</small>
                                                    </>
                                                );
                                            }}
                                        </Field>
                                    </div>
                                </div>
                                <div className="row mb-3 align-items-center">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">
                                            Company address <span className="lt-text-error">*</span>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <Field name="CompanyAddress">
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
                                                            className={`form-control ${error ? 'is-invalid' : ''}`}
                                                            placeholder="Enter your company address"
                                                            maxLength={500}
                                                        />
                                                        <small className="text-danger">{error}</small>
                                                    </>
                                                );
                                            }}
                                        </Field>
                                    </div>
                                </div>
                                <div className="row mb-3 align-items-center">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">
                                            City/District <span className="lt-text-error">*</span>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <Field name="CityDistrict">
                                            {(fieldProps: FieldProps) => {
                                                const { field, form } = fieldProps;
                                                const error =
                                                    getValue(form.touched, field.name) &&
                                                    getValue(form.errors, field.name);
                                                return (
                                                    <>
                                                        <div className="page-select ox-city-district">
                                                            <Select
                                                                isSearchable
                                                                value={cityOptions.find(
                                                                    (item) => item.value === field.value
                                                                )}
                                                                onChange={(selectedOption) => {
                                                                    const { value, state } =
                                                                        selectedOption as CitySelectOptionType;
                                                                    setFieldTouched(field.name);
                                                                    formikProps.setValues({
                                                                        ...formikProps.values,
                                                                        [field.name]: value,
                                                                        State: state,
                                                                    });
                                                                }}
                                                                options={cityOptions}
                                                                className="react-select"
                                                                classNamePrefix="react-select"
                                                                placeholder="Select city"
                                                            />
                                                        </div>
                                                        <small className="text-danger">{error}</small>
                                                    </>
                                                );
                                            }}
                                        </Field>
                                    </div>
                                </div>
                                <div className="row mb-3 align-items-center">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">
                                            State 
                                        </label>
                                    </div>
                                    <div className="col">
                                        <Field name="State">
                                            {(fieldProps: FieldProps) => {
                                                const { field, form } = fieldProps;
                                                const error =
                                                    getValue(form.touched, field.name) &&
                                                    getValue(form.errors, field.name);
                                                return (
                                                    <>
                                                        <input
                                                            type="text"
                                                            disabled
                                                            value={field.value.toString().toLowerCase()}
                                                            onChange={(ev) => {
                                                                setFieldTouched(field.name);
                                                                setFieldValue(field.name, ev.target.value);
                                                            }}
                                                            className={`form-control text-camel-case ${
                                                                error ? 'is-invalid' : ''
                                                            }`}
                                                        />
                                                        <small className="text-danger">{error}</small>
                                                    </>
                                                );
                                            }}
                                        </Field>
                                    </div>
                                </div>
                                <div className="row mb-3 align-items-center">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">
                                            Country 
                                        </label>
                                    </div>
                                    <div className="col">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text disabled">
                                                    <img src={imgFlag} alt="" className="input-flag" />
                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={values.Country}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3 align-items-center">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">
                                            Postal code <span className="lt-text-error">*</span>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <Field name="PostalCode">
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
                                                            className={`form-control ${error ? 'is-invalid' : ''}`}
                                                            placeholder="Enter postal code"
                                                            maxLength={10}
                                                        />
                                                        <small className="text-danger">{error}</small>
                                                    </>
                                                );
                                            }}
                                        </Field>
                                    </div>
                                </div>
                                <div className="row mb-3 align-items-center">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">
                                            Company phone no. <span className="lt-text-error">*</span>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <Field name="Phone">
                                            {(fieldProps: FieldProps) => {
                                                const { field, form } = fieldProps;
                                                const error =
                                                    getValue(form.touched, field.name) &&
                                                    getValue(form.errors, field.name);
                                                return (
                                                    <>
                                                        <div className="input-group">
                                                            <div className="input-group-prepend">
                                                                <div
                                                                    className={`input-group-text phone-border ${
                                                                        error ? 'is-invalid' : ''
                                                                    }`}
                                                                >
                                                                    +91
                                                                </div>
                                                            </div>
                                                            <MaskedInput
                                                                value={field.value}
                                                                onChange={(ev) => {
                                                                    setFieldTouched(field.name);
                                                                    setFieldValue(field.name, ev.target.value);
                                                                }}
                                                                className={`form-control form-phone-border ${
                                                                    error ? 'phone-input is-invalid' : ''
                                                                }`}
                                                                placeholder="Enter company phone"
                                                                guide={false}
                                                                mask={mobileMask}
                                                                maxLength={15}
                                                            />
                                                        </div>
                                                        <small className="text-danger">{error}</small>
                                                    </>
                                                );
                                            }}
                                        </Field>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">
                                            Company Email <span className="lt-text-error">*</span>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <Field name="CompanyEmail">
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
                                                            className={`form-control ${error ? 'is-invalid' : ''}`}
                                                            placeholder="Enter your company email"
                                                            maxLength={320}
                                                        />
                                                        <small className="text-danger">{error}</small>
                                                        <div className="text-danger mb-2" />
                                                        {/* <div className="alert alert-warning p-2 mb-0">
                                                            <p className="mb-0 fs-12">
                                                                We will send the account activation link to this email. This
                                                                company email and your login email could be the same.
                                                                However, it has to match the company website domain.
                                                            </p>
                                                        </div> */}
                                                    </>
                                                );
                                            }}
                                        </Field>
                                    </div>
                                </div>
                                <div className="row mb-3 align-items-center">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">
                                            Company Website <span className="lt-text-error">*</span>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <Field name="WebSite">
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
                                                            className={`form-control ${error ? 'is-invalid' : ''}`}
                                                            placeholder="Has to match with company email domain"
                                                            maxLength={255}
                                                        />
                                                        <small className="text-danger">{error}</small>
                                                    </>
                                                );
                                            }}
                                        </Field>
                                    </div>
                                </div>
                                <div className="form-check mb-2">
                                    <Field
                                        className="form-check-input cursor-pointer"
                                        name="isTermsChecked"
                                        type="checkbox"
                                        id="check"
                                    ></Field>
                                    <label className="form-check-label fs-13 mt-1 cursor-pointer" htmlFor="check">
                                        I agree to the OfferX{' '}
                                        <Link to={routes.terms} target="_blank">
                                            Terms & Conditions
                                        </Link>
                                        {', '}
                                        <Link to={`${routes.privacy}#Item-6`} target="_blank">
                                            Cookies
                                        </Link>{' '}
                                        and{' '}
                                        <Link to={routes.privacy} target="_blank">
                                            Privacy Policies
                                        </Link>
                                        .
                                    </label>
                                    <Field name="isTermsChecked">
                                        {(fieldProps: FieldProps) => {
                                            const { field, form } = fieldProps;
                                            const error =
                                                getValue(form.touched, field.name) && getValue(form.errors, field.name);
                                            return (
                                                <div>
                                                    <small className="text-danger">{error}</small>
                                                </div>
                                            );
                                        }}
                                    </Field>
                                </div>
                            </div>
                            <div className="my-3 w-100 text-end">
                                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                    {isSubmitting && <span className="spinner-border spinner-border-sm" />}Join
                                </button>
                            </div>
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
};

export default ManagerForm;

const getValidationSchema = () =>
    objectYup().shape({
        FirstName: stringYup()
            .required('First name is required and must be at least 3 characters.')
            .min(3, 'First name must be at least 3 characters.'),
        LastName: stringYup()
            .required('Last name is required and must be at least 3 characters.')
            .min(3, 'Last name must be at least 3 characters.'),
        CompanyName: stringYup().required('Company name is required.'),
        CompanyAddress: stringYup().required('Company address is required.'),
        CityDistrict: stringYup().required('City/District is required.'),
        PostalCode: stringYup().required('Postal code is required.'),
        Phone: stringYup()
            .required('Company Phone number is required and must be 10 digits number.')
            .min(10, 'Phone number must be at least 10 digits number.'),
        CompanyEmail: stringYup().required('Email is required.').matches(emailRegexp, {
            message: 'Invalid email format.',
        }),
        GstNumber: stringYup().required('Company GST number is required.').matches(gstRegexp, {
            message: 'Invalid GST number',
        }),
        WebSite: stringYup()
            .required('Company website is required.')
            .matches(siteRegexp, {
                message: 'Invalid site',
            })
            .test(
                'WebSite',
                'Invalid website domain. The company website has to match the company email.',
                function (value) {
                    if (!value || !this.parent.CompanyEmail) return false;
                    const emailDomain = this.parent.CompanyEmail.match(/@(.*)/);
                    if (!emailDomain) return false;
                    return value.includes(emailDomain[1]);
                }
            ),
        agreement: booleanYup().oneOf([true]),
        isTermsChecked: booleanYup().oneOf([true], 'Please accept terms and conditions to register.'),
    });
