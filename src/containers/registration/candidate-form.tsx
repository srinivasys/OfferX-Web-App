import { Field, FieldProps, Formik, FormikProps, useFormik } from 'formik';
import React, { useCallback, useMemo, useState } from 'react';
import {
    date as dateYup,
    object as objectYup,
    string as stringYup,
    number as numYup,
    boolean as booleanYup,
} from 'yup';
import getValue from 'lodash/get';
import MaskedInput from 'react-text-mask';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { CandidateFormData, CandidateRequestType, GenderEnum } from '../../types/auth';
import { RootState } from '../../redux';
import useInitialErrors from '../../hooks/formik-initial-errors';
import { authService } from '../../lib/api/auth';
import { deleteReduxProfile } from '../../redux/registration';
import { goToRoom } from './utils';
import { aadharMask, mobileMask } from '../../lib/utils/validation';
import { cityOptions, CitySelectOptionType } from '../../lib/utils/select';
import { routes } from '../routes/routes-names';
import DatePickerComponent from '../../components/date-picker';
import imgFlag from '../../assets/icons/flag.png';
import websitelogo from '../../assets/img/offerx-logo.png';
import { HighestEducationEnum } from '../../types/auth';
import { arrayFromEnum } from '../../lib/utils/emun';
import { ExperienceLevelEnum } from '../../lib/constants/constants';
import { getHighestEducation } from '../../lib/utils/dictionary';

type Props = {
    candidateId?: string;
};

const initialFormData = {
    FirstName: '',
    MiddleName: '',
    LastName: '',
    Email: '',
    JobTitle: '',
    CityDistrict: '',
    State: '',
    Country: 'India',
    Dob: null,
    Gender: undefined,
    Phone: '',
    Aadhar: '',
    HighestEducation: '',
    ExperienceLevel: '',
    PrevCompany: '',
    isTermsChecked: false,
};

const CandidateForm: React.FC<Props> = ({ candidateId }) => {
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
    const [experienceLevelValue, SetExperienceLevelValue] = useState('');

    const submitForm = useCallback(
        async (values: CandidateFormData) => {
            if (!reduxProfile) return;
            const requestData: CandidateRequestType = {
                ...values,
                Aadhar: values.Aadhar.slice(-4),
                Phone: values.Phone,
                Gender: Number(values.Gender),
                Dob: values.Dob as Date,
                AuthType: reduxProfile.authType,
                Token: reduxProfile.token,
                HighestEducation: values.HighestEducation === '' ? null : Number(values.HighestEducation),
                ExperienceLevel: values.ExperienceLevel === '' ? null : Number(values.ExperienceLevel),
                PrevCompany: values.PrevCompany,
                ...(candidateId && { InvitationId: candidateId }),
            };

            try {
                const data = await authService.candidateSignUp(requestData);
                if (data) {
                    dispatch(deleteReduxProfile());
                    await goToRoom(data, dispatch);
                }
            } catch (err) {
            }
        },
        [reduxProfile, dispatch, candidateId]
    );

    return (
        <Formik
            onSubmit={submitForm}
            enableReinitialize
            initialValues={profileFormData}
            validationSchema={getValidationSchema()}
            initialErrors={initialErrors}
        >
            {(formikProps: FormikProps<CandidateFormData>) => {
                const { handleSubmit, values, isSubmitting, setFieldTouched, setFieldValue } = formikProps;
                return (
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body px-4 py-2">
                            <div className="d-flex lt-registration-header">
                                <div className="col-3 col-lg-2">
                                    <div className="header-divider pe-3">
                                        <img src={websitelogo} className="site-logo" alt="OfferX Logo"></img>
                                    </div>
                                </div>
                                <div className="col">
                                    <h1 className="fs-20 fw-400 py-2 mb-4 px-2">Candidate registration</h1>
                                </div>
                            </div>
                            <div className="registration-modal">
                                <div className="row mb-3">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">
                                            First name <span className="lt-text-error">*</span>
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
                                                            onChange={(ev) => {
                                                                setFieldTouched(field.name);
                                                                setFieldValue(field.name, ev.target.value);
                                                            }}
                                                            className={`form-control ${error ? 'is-invalid' : ''}`}
                                                            placeholder="Enter your first name as per aadhar"
                                                            maxLength={50}
                                                        />
                                                        <small className="text-danger">{error}</small>
                                                    </>
                                                );
                                            }}
                                        </Field>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">Middle name</label>
                                    </div>
                                    <div className="col">
                                        <Field name="MiddleName">
                                            {(fieldProps: FieldProps) => {
                                                const { field } = fieldProps;
                                                return (
                                                    <>
                                                        <input
                                                            type="text"
                                                            maxLength={50}
                                                            value={field.value}
                                                            onChange={(ev) => {
                                                                setFieldTouched(field.name);
                                                                setFieldValue(field.name, ev.target.value);
                                                            }}
                                                            className="form-control"
                                                            placeholder="Enter your middle name as per aadhar"
                                                        />
                                                    </>
                                                );
                                            }}
                                        </Field>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">
                                            Last name <span className="lt-text-error">*</span>
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
                                                            onChange={(ev) => {
                                                                setFieldTouched(field.name);
                                                                setFieldValue(field.name, ev.target.value);
                                                            }}
                                                            className={`form-control ${error ? 'is-invalid' : ''}`}
                                                            placeholder="Enter your last name as per aadhar"
                                                            maxLength={50}
                                                        />
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
                                            Date of birth<span className="lt-text-error">*</span>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <Field name="Dob">
                                            {(fieldProps: FieldProps) => {
                                                const { field, form } = fieldProps;
                                                const error =
                                                    getValue(form.touched, field.name) &&
                                                    getValue(form.errors, field.name);
                                                return (
                                                    <>
                                                        <div className={error ? 'react-datepicker-error' : ''}>
                                                            <DatePickerComponent
                                                                startDate={field.value}
                                                                headerSelects
                                                                onChange={(date) => {
                                                                    setFieldTouched(field.name);
                                                                    setFieldValue(field.name, date);
                                                                }}
                                                                minDate={moment().subtract(65, 'years').toDate()}
                                                                maxDate={moment().subtract(18, 'years').toDate()}
                                                                placeholder="Select your date of birth as per aadhaar"
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
                                            Gender <span className="lt-text-error">*</span>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <Field name="Gender">
                                            {(fieldProps: FieldProps) => {
                                                const { field, form } = fieldProps;
                                                const error =
                                                    getValue(form.touched, field.name) &&
                                                    getValue(form.errors, field.name);
                                                return (
                                                    <>
                                                        <select
                                                            value={field.value}
                                                            onChange={(ev) => {
                                                                setFieldTouched(field.name);
                                                                setFieldValue(field.name, ev.target.value);
                                                            }}
                                                            className={`form-select ${error ? 'is-invalid' : ''}`}
                                                        >
                                                            <option value="">Select your gender</option>
                                                            <option value={GenderEnum.male}>Male</option>
                                                            <option value={GenderEnum.female}>Female</option>
                                                            <option value={GenderEnum.preferNotToDisclose}>
                                                                Prefer not to disclose
                                                            </option>
                                                        </select>
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
                                            Phone no <span className="lt-text-error">*</span>
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
                                                                <div className={`input-group-text ${error ? 'is-invalid' : ''}`}>+91</div>
                                                            </div>
                                                            <MaskedInput
                                                                value={field.value}
                                                                onChange={(ev) => {
                                                                    setFieldTouched(field.name);
                                                                    setFieldValue(field.name, ev.target.value);
                                                                }}
                                                                className={`form-control ${error ? 'is-invalid' : ''}`}
                                                                placeholder="Enter your phone number"
                                                                guide={false}
                                                                mask={mobileMask}
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
                                            Login email 
                                        </label>
                                    </div>
                                    <div className="col">
                                        <input type="text" className="form-control" value={values.Email} disabled />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">
                                            Aadhaar no <span className="lt-text-error">*</span>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <Field name="Aadhar">
                                            {(fieldProps: FieldProps) => {
                                                const { field, form } = fieldProps;
                                                const error =
                                                    getValue(form.touched, field.name) &&
                                                    getValue(form.errors, field.name);
                                                return (
                                                    <>
                                                        <MaskedInput
                                                            value={field.value}
                                                            onChange={(ev) => {
                                                                setFieldTouched(field.name);
                                                                setFieldValue(field.name, ev.target.value);
                                                            }}
                                                            className={`form-control ${error ? 'is-invalid' : ''}`}
                                                            placeholder="Enter last 4 Digits of your aadhaar number"
                                                            guide={false}
                                                            mask={aadharMask}
                                                        />
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
                                <div className="row mb-3">
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
                                <div className="row mb-3">
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
                                <div className="row mb-3">
                                    <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                        <label className="fs-14 fw-400">
                                            Highest education <span className="lt-text-error">*</span>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <Field name="HighestEducation">
                                            {(fieldProps: FieldProps) => {
                                                const { field, form } = fieldProps;
                                                const error =
                                                    getValue(form.touched, field.name) &&
                                                    getValue(form.errors, field.name);
                                                return (
                                                    <>
                                                        <select
                                                            value={field.value}
                                                            onChange={(ev) => {
                                                                setFieldTouched(field.name);
                                                                setFieldValue(field.name, ev.target.value);
                                                            }}
                                                            className={`form-select ${error ? 'is-invalid' : ''}`}
                                                        >
                                                            <option value="">Select your highest education</option>
                                                            {arrayFromEnum(HighestEducationEnum).map((item) => (
                                                                <option key={item} value={item}>
                                                                    {getHighestEducation(item)}
                                                                </option>
                                                            ))}
                                                        </select>
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
                                            Job experience <span className="lt-text-error">*</span>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <Field name="ExperienceLevel">
                                            {(fieldProps: FieldProps) => {
                                                const { field } = fieldProps;
                                                return (
                                                    <>
                                                        <div className="form-check form-check-inline mb-0">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="inlineRadioOptions"
                                                                id="FresherRadio"
                                                                checked={field.value === ExperienceLevelEnum.Fresher}
                                                                value={field.value}
                                                                onChange={() => {
                                                                    setFieldTouched(field.name);

                                                                    setFieldValue(
                                                                        field.name,
                                                                        ExperienceLevelEnum.Fresher
                                                                    );
                                                                    SetExperienceLevelValue(
                                                                        ExperienceLevelEnum[ExperienceLevelEnum.Fresher]
                                                                    );
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor="FresherRadio">
                                                                Fresher
                                                            </label>
                                                        </div>
                                                        <div className="form-check form-check-inline mb-0">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="inlineRadioOptions"
                                                                id="ExperiencedRadio"
                                                                checked={
                                                                    field.value === ExperienceLevelEnum.Experienced
                                                                }
                                                                value={field.value}
                                                                onChange={() => {
                                                                    setFieldTouched(field.name);
                                                                    setFieldValue(
                                                                        field.name,
                                                                        ExperienceLevelEnum.Experienced
                                                                    );
                                                                    SetExperienceLevelValue(
                                                                        ExperienceLevelEnum[
                                                                            ExperienceLevelEnum.Experienced
                                                                        ]
                                                                    );
                                                                }}
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="ExperiencedRadio"
                                                            >
                                                                Experienced
                                                            </label>
                                                        </div>
                                                        <Field name="ExperienceLevel">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
                                                                        <div className="d-flex justify-content-between">
                                                                            <small className="text-danger mt-2">
                                                                                {error}
                                                                            </small>
                                                                        </div>
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </>
                                                );
                                            }}
                                        </Field>
                                    </div>
                                </div>
                                {experienceLevelValue === ExperienceLevelEnum[ExperienceLevelEnum.Experienced] && (
                                    <div>
                                        <div className="row mb-3">
                                            <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                                                <label className="fs-14 fw-400">
                                                    Recent Job title <span className="lt-text-error">*</span>
                                                </label>
                                            </div>
                                            <div className="col">
                                                <Field name="JobTitle">
                                                    {(fieldProps: FieldProps) => {
                                                        const { field, form } = fieldProps;
                                                        const error =
                                                            getValue(form.touched, field.name) &&
                                                            getValue(form.errors, field.name);
                                                        return (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    maxLength={60}
                                                                    value={field.value}
                                                                    onChange={(ev) => {
                                                                        setFieldTouched(field.name);
                                                                        setFieldValue(field.name, ev.target.value);
                                                                    }}
                                                                    className={`form-control ${
                                                                        error ? 'is-invalid' : ''
                                                                    }`}
                                                                    placeholder="Enter your job title"
                                                                />
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
                                                    Company<span className="lt-text-error">*</span>
                                                </label>
                                            </div>
                                            <div className="col">
                                                <Field name="PrevCompany">
                                                    {(fieldProps: FieldProps) => {
                                                        const { field, form } = fieldProps;
                                                        const error =
                                                            getValue(form.touched, field.name) &&
                                                            getValue(form.errors, field.name);
                                                        return (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    maxLength={100}
                                                                    value={field.value}
                                                                    onChange={(ev) => {
                                                                        setFieldTouched(field.name);
                                                                        setFieldValue(field.name, ev.target.value);
                                                                    }}
                                                                    className={`form-control ${
                                                                        error ? 'is-invalid' : ''
                                                                    }`}
                                                                    placeholder="Enter your company."
                                                                />
                                                                <small className="text-danger">{error}</small>
                                                            </>
                                                        );
                                                    }}
                                                </Field>
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                            Cookie
                                        </Link>{' '}
                                        and{' '}
                                        <Link to={routes.privacy} target="_blank">
                                            Privacy policies
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
                                    {isSubmitting && <span className="spinner-border spinner-border-sm" />} Join
                                </button>
                            </div>
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
};

export default CandidateForm;

const getValidationSchema = () =>
    objectYup().shape({
        FirstName: stringYup()
            .required('First name is required and must be at least 3 characters.')
            .min(3, 'First name must be at least 3 characters.'),
        LastName: stringYup()
            .required('Last name is required and must be at least 3 characters.')
            .min(3, 'Last name must be at least 3 characters.'),
        CityDistrict: stringYup().required('City/District is required.'),
        Dob: dateYup()
            .nullable()
            .transform((current, orig) => (orig === '' ? null : current))
            .required('Date of birth is required and must be as per aadhaar.'),
        Gender: stringYup().required('Gender is required.'),
        Aadhar: stringYup().required('Aadhaar is required and must be last 4 digits of your Aadhaar number.').min(19, 'Aadhar number must be at least 4 characters.'),
        Phone: stringYup().required('Phone number is required and must be 10 digits number.').min(10, 'Phone number must be 10 digit number.'),
        HighestEducation: numYup().required('Highest education is required.'),
        ExperienceLevel: numYup().required('Job experience is required.'),
        JobTitle: stringYup().when('ExperienceLevel', {
            is: ExperienceLevelEnum.Experienced,
            then: stringYup().required('Recent job title is required.'),
        }),
        PrevCompany: stringYup().when('ExperienceLevel', {
            is: ExperienceLevelEnum.Experienced,
            then: stringYup().required('Company is required.'),
        }),
        isTermsChecked: booleanYup().oneOf([true], 'Please accept terms and conditions to register.'),
    });
