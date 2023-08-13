import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { date as dateYup, object as objectYup, string as stringYup, number as numYup } from 'yup';
import getValue from 'lodash/get';
import MaskedInput from 'react-text-mask';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import moment from 'moment';
//@ts-ignore
import Files from 'react-files';
import Profile from '../../components/profile';
import { candidateService } from '../../lib/api/candidate';
import { EditCandidateFormType, CandidateProfileType, UpdateCandidateRequestType } from '../../types/candidate';
import { getHighestEducation } from '../../lib/utils/dictionary';
import useInitialErrors from '../../hooks/formik-initial-errors';
import { GenderEnum, HighestEducationEnum, UserType } from '../../types/auth';
import { aadharMask, mobileMask, yearMask } from '../../lib/utils/validation';
import { arrayFromEnum } from '../../lib/utils/emun';
import { ReactFilesError, ReactFilesFile } from '../../types/files';
import { getUser } from '../../redux/user';
import PageLoader from '../../components/loader';
import { cityOptions, CitySelectOptionType } from '../../lib/utils/select';
import { getFileExtension } from '../../lib/utils/file-extension';
import DatePickerComponent from '../../components/date-picker';
import imgFlag from '../../assets/icons/flag.png';
import { ReactComponent as IconTrash } from '../../assets/icons/trash.svg';
import { closeModal } from '../../lib/utils/close-modal';
import Context from '../../context/update';
import DeleteResume from './modals/delete-resume';
import ShowPopUp from '../../components/custom-popup-alert';
import { CandidateReviewsType } from '../../types/review';
import { reviewService } from '../../lib/api/review';
import { RootState } from '../../redux';
import { ExperienceLevelEnum } from '../../lib/constants/constants';

const MyProfile = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<CandidateProfileType | null>(null);
    const [resume, setResume] = useState<{ file?: File; error?: string } | null>(null);
    const [success, setSuccess] = useState(false);
    const [reviewData, setReviewData] = useState<CandidateReviewsType[]>();
    const [experienceLevelValue, SetExperienceLevelValue] = useState('');

    const { user } = useSelector((state: RootState) => state.user);
    const hasUser = user as UserType;

    function handleCloseModal() {
        setTimeout(() => {
            success && setSuccess(false);
        }, 500);
    }

    const initialValues = useMemo(
        () => ({
            firstName: data?.firstName || '',
            middleName: data?.middleName || '',
            lastName: data?.lastName || '',
            avatarUrl: data?.avatarUrl || '',
            jobTitle: data?.jobTitle || '',
            cityDistrict: data?.cityDistrict || '',
            state: data?.state || '',
            aboutMe: data?.aboutMe || '',
            website: data?.website || '',
            phone: data?.phone ? `${data.phone}` : '',
            highestEducation: data?.highestEducation ?? '',
            institutionName: data?.institutionName || '',
            graduationYear: String(data?.graduationYear) || '',
            resumeFileUrl: data?.resumeFileUrl
                ? `${data.firstName}.${data.lastName}.${getFileExtension(data.resumeFileUrl)}`
                : '',
            country: data?.country || '',
            dob: data?.dob ? new Date(data.dob) : new Date(),
            gender: data?.gender ?? GenderEnum.preferNotToDisclose,
            aadhar: data?.aadhar ? `XXXX XXXX XXXX ${data.aadhar}` : '',
            prevCompany: data?.prevCompany || '',
            experienceLevel: data?.experienceLevel ?? '',
        }),
        [data]
    );

    const initialErrors = useInitialErrors(initialValues, getValidationSchema());

    const getProfile = useCallback(async () => {
        try {
            const { resultObject: candidate } = await candidateService.getProfile();
            setData(candidate);
            const { resultObject } = await reviewService.getCandidateReview(hasUser?.id || '');
            setReviewData(resultObject);
            SetExperienceLevelValue(ExperienceLevelEnum[candidate.experienceLevel]);
        } catch (err: any) {
        } finally {
            setLoading(false);
        }
    }, []);

    const submitForm = useCallback(
        async (values: EditCandidateFormType) => {
            const requestData: UpdateCandidateRequestType = {
                ...values,
                aadhar: values.aadhar.slice(-4),
                phone: values.phone,
                gender: Number(values.gender),
                graduationYear: Number(values.graduationYear),
                highestEducation: values.highestEducation === '' ? null : Number(values.highestEducation),
                prevCompany: values.prevCompany,
            };
            let formData = new FormData();
            formData.append('request', JSON.stringify(requestData));
            resume?.file && formData.append('resumeFile', resume?.file);
            try {
                await candidateService.update(formData);
                await dispatch(getUser());
                await getProfile();
                setResume(null);
                setSuccess(true);
            } catch (err) {
            }
        },
        [resume, getProfile, dispatch]
    );

    useEffect(() => {
        getProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const now = new Date().getUTCFullYear();
    const graduationYears = Array(now - (now - 66))
        .fill('')
        .map((v, idx) => now - idx);

    return loading ? (
        <PageLoader />
    ) : (
        data && (
            <Context.Provider value={{ updateProfile: getProfile }}>
                <Profile
                    avatar={data.avatarUrl}
                    banner={data.bannerUrl}
                    name={`${data.firstName} ${data.middleName} ${data.lastName}`}
                    activity={data.jobTitle + ' at ' + data.prevCompany}
                    location={`${data.cityDistrict}, ${data.state}`}
                    aboutMe={data.aboutMe ? data.aboutMe : undefined}
                    reviewsCount={data.reviewsCount}
                    rating={data.rating.value}
                    contractCompliance={data.contractComplianceQuantity}
                    contractViolation={data.contractViolationQuantity}
                    phone={data.phone}
                    email={data.email}
                    website={data.website}
                    resume={data.resumeFileUrl}
                    prevCompany={data.prevCompany}
                    experienceLevel={data.experienceLevel}
                    aadhar={data.aadhar}
                    dob={data.dob}
                    gender={data.gender}
                    education={{
                        highestEducation:
                            typeof data.highestEducation === 'number' ? getHighestEducation(data.highestEducation) : '',
                        institutionName: data.institutionName || '',
                        graduationYear: data.graduationYear,
                    }}
                    reviewOffers={[]}
                    isMyProfile={true}
                    reviewItemsList={reviewData?.map((item) => ({
                        id: item.id,
                        avatar: item.companyAvatarUrl,
                        name: item.companyName,
                        text: item.reviewText,
                        date: item.date,
                        contractComplianceState: item.contractComplianceState,
                        rating: item.stars,
                        creatorId: item.companyId,
                        offerId: item.offerId,
                        reviewType: item.reviewType,
                        contractViolationReason: item.contractViolationReason,
                        location: item.companyLocation,
                        onboardReviewList: item.onboardingReviews.map((item) => ({
                            id: item.id,
                            avatar: item.companyAvatarUrl,
                            name: item.companyName,
                            text: item.reviewText,
                            date: item.date,
                            contractComplianceState: item.contractComplianceState,
                            rating: item.stars.value,
                            creatorId: item.companyId,
                            offerId: item.offerId,
                            replys: item.replys.map((item) => ({
                                id: item.id,
                                companyReviewId: item.companyReviewId,
                                candidateId: item.candidateId,
                                candidateFirstName: item.candidateLastName,
                                replyText: item.replyText,
                                companyName: item.companyName,
                                date: item.date,
                                offerId: item.offerId,
                            })),
                            reviewType: item.reviewType,
                            jobTitle: item.jobTitle,
                            contractViolationReason: item.contractViolationReason,
                        })),
                        progressReviewList: item.progressReviews.map((item) => ({
                            id: item.id,
                            avatar: item.companyAvatarUrl,
                            name: item.companyName,
                            text: item.reviewText,
                            date: item.date,
                            contractComplianceState: item.contractComplianceState,
                            rating: item.stars.value,
                            creatorId: item.companyId,
                            offerId: item.offerId,
                            reviewType: item.reviewType,
                            contractViolationReason: item.contractViolationReason,
                        })),
                        exitReviewList: item.exitReviews.map((item) => ({
                            id: item.id,
                            avatar: item.companyAvatarUrl,
                            name: item.companyName,
                            text: item.reviewText,
                            date: item.date,
                            contractComplianceState: item.contractComplianceState,
                            rating: item.stars.value,
                            creatorId: item.companyId,
                            offerId: item.offerId,
                            reviewType: item.reviewType,
                            contractViolationReason: item.contractViolationReason,
                        })),
                    }))}
                    editCandidate
                >
                    <Formik
                        onSubmit={submitForm}
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={getValidationSchema()}
                        initialErrors={initialErrors}
                    >
                        {(formikProps: FormikProps<EditCandidateFormType>) => {
                            const { handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm } =
                                formikProps;

                            const Buttons = () => {
                                return (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setResume(null);
                                                resetForm();
                                            }}
                                            className="btn btn-outline-primary outline-p-hover btn-sm me-2"
                                            data-bs-dismiss="modal"
                                        >
                                            Cancel
                                        </button>
                                        {isSubmitting && <div className='new-spinner p-absolute'><div><span className="spinner-border spinner-border-sm custom-spinner-border" /></div><p className='fs-14 custom-loading-text'>Loading</p></div>}
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-sm"
                                            disabled={isSubmitting}
                                        >
                                            Update
                                        </button>
                                    </>
                                );
                            };
                            return (
                                <form onSubmit={handleSubmit}>
                                    <div
                                        className="modal fade"
                                        id="EditProfile"
                                        data-bs-backdrop="static"
                                        data-bs-keyboard="false"
                                        tabIndex={-1}
                                        aria-labelledby="EditProfileLabel"
                                        aria-hidden="true"
                                    >
                                        <div
                                            className={`${success ? 'modal-md' : 'modal-lg'
                                                } modal-dialog lt-edit-profile modal-dialog-centered modal-dialog-scrollable`}
                                        >
                                            <div className="modal-content lt-modal-content pe-3">
                                                {loading ? (
                                                    <PageLoader />
                                                ) : success ? (
                                                    <ShowPopUp
                                                        handleCloseModal={handleCloseModal}
                                                        headerText="Profile"
                                                        text="Profile updated successfully"
                                                    />
                                                ) : (
                                                    <>
                                                        <div className="modal-header lt-modal-header">
                                                            <h5
                                                                className="modal-title w-100 text-center fw-700 fs-20"
                                                                id="EditProfileLabel"
                                                            >
                                                                Edit profile
                                                            </h5>
                                                            <button
                                                                type="button"
                                                                className="btn-close lt-edit-profile-close"
                                                                data-bs-dismiss="modal"
                                                                title="Close"
                                                                onClick={() => {
                                                                    setResume(null);
                                                                    resetForm();
                                                                }}
                                                                aria-label="Close"
                                                            />
                                                        </div>
                                                        <div className="modal-body lt-modal-body mt-4 mt-sm-0">
                                                            <div className="pe-3 pt-3">
                                                                <h1 className="fw-700 fs-18 mb-3">Personal details</h1>
                                                                <div className="row">
                                                                    <div className="col-sm-4 col-12 mb-3">
                                                                        <label className="mb-2 fw-700 fs-14">
                                                                            First name{' '}
                                                                            
                                                                        </label>
                                                                        <Field name="firstName">
                                                                            {(fieldProps: FieldProps) => {
                                                                                const { field, form } = fieldProps;
                                                                                const error =
                                                                                    getValue(
                                                                                        form.touched,
                                                                                        field.name
                                                                                    ) &&
                                                                                    getValue(form.errors, field.name);
                                                                                return (
                                                                                    <>
                                                                                        <input
                                                                                            type="text"
                                                                                            value={field.value}
                                                                                            onChange={(ev) => {
                                                                                                setFieldTouched(
                                                                                                    field.name
                                                                                                );
                                                                                                setFieldValue(
                                                                                                    field.name,
                                                                                                    ev.target.value
                                                                                                );
                                                                                            }}
                                                                                            className={`form-control ${error
                                                                                                    ? 'is-invalid'
                                                                                                    : ''
                                                                                                }`}
                                                                                            placeholder="Enter your first name"
                                                                                            maxLength={50}
                                                                                            disabled
                                                                                        />
                                                                                        <small className="text-danger">
                                                                                            {error}
                                                                                        </small>
                                                                                    </>
                                                                                );
                                                                            }}
                                                                        </Field>
                                                                    </div>
                                                                    <div className="col-sm-4 col-12 mb-3">
                                                                        <label className="mb-2 fw-700 fs-14">
                                                                            Middle name
                                                                        </label>
                                                                        <Field name="middleName">
                                                                            {(fieldProps: FieldProps) => {
                                                                                const { field } = fieldProps;
                                                                                return (
                                                                                    <>
                                                                                        <input
                                                                                            type="text"
                                                                                            maxLength={50}
                                                                                            value={field.value}
                                                                                            onChange={(ev) => {
                                                                                                setFieldTouched(
                                                                                                    field.name
                                                                                                );
                                                                                                setFieldValue(
                                                                                                    field.name,
                                                                                                    ev.target.value
                                                                                                );
                                                                                            }}
                                                                                            className="form-control"
                                                                                            disabled
                                                                                        />
                                                                                    </>
                                                                                );
                                                                            }}
                                                                        </Field>
                                                                    </div>
                                                                    <div className="col-sm-4 col-12 mb-3">
                                                                        <label className="mb-2 fw-700 fs-14">
                                                                            Last name{' '}
                                                                            
                                                                        </label>
                                                                        <Field name="lastName">
                                                                            {(fieldProps: FieldProps) => {
                                                                                const { field, form } = fieldProps;
                                                                                const error =
                                                                                    getValue(
                                                                                        form.touched,
                                                                                        field.name
                                                                                    ) &&
                                                                                    getValue(form.errors, field.name);
                                                                                return (
                                                                                    <>
                                                                                        <input
                                                                                            type="text"
                                                                                            value={field.value}
                                                                                            onChange={(ev) => {
                                                                                                setFieldTouched(
                                                                                                    field.name
                                                                                                );
                                                                                                setFieldValue(
                                                                                                    field.name,
                                                                                                    ev.target.value
                                                                                                );
                                                                                            }}
                                                                                            className={`form-control ${error
                                                                                                    ? 'is-invalid'
                                                                                                    : ''
                                                                                                }`}
                                                                                            placeholder="Enter your last name"
                                                                                            maxLength={50}
                                                                                            disabled
                                                                                        />
                                                                                        <small className="text-danger">
                                                                                            {error}
                                                                                        </small>
                                                                                    </>
                                                                                );
                                                                            }}
                                                                        </Field>
                                                                    </div>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label className="mb-2 fw-700 fs-14">
                                                                        Date of birth{' '}
                                                                       
                                                                    </label>

                                                                    <Field name="dob">
                                                                        {(fieldProps: FieldProps) => {
                                                                            const { field, form } = fieldProps;
                                                                            const error =
                                                                                getValue(form.touched, field.name) &&
                                                                                getValue(form.errors, field.name);
                                                                            return (
                                                                                <>
                                                                                    <div
                                                                                        className={
                                                                                            error
                                                                                                ? 'react-datepicker-error'
                                                                                                : 'datepicker-disabled'
                                                                                        }
                                                                                    >
                                                                                        <DatePickerComponent
                                                                                            disabled={true}
                                                                                            startDate={field.value}
                                                                                            headerSelects
                                                                                            onChange={(date) => {
                                                                                                setFieldTouched(
                                                                                                    field.name
                                                                                                );
                                                                                                setFieldValue(
                                                                                                    field.name,
                                                                                                    date
                                                                                                );
                                                                                            }}
                                                                                            minDate={moment()
                                                                                                .subtract(65, 'years')
                                                                                                .toDate()}
                                                                                            maxDate={moment()
                                                                                                .subtract(18, 'years')
                                                                                                .toDate()}
                                                                                            placeholder="Select your date of birth as per aadhaar"
                                                                                        />
                                                                                    </div>
                                                                                    <small className="text-danger">
                                                                                        {error}
                                                                                    </small>
                                                                                </>
                                                                            );
                                                                        }}
                                                                    </Field>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label className="mb-2 fw-700 fs-14">
                                                                        Gender 
                                                                    </label>

                                                                    <Field name="gender">
                                                                        {(fieldProps: FieldProps) => {
                                                                            const { field, form } = fieldProps;
                                                                            const error =
                                                                                getValue(form.touched, field.name) &&
                                                                                getValue(form.errors, field.name);
                                                                            return (
                                                                                <>
                                                                                    <select
                                                                                        value={field.value}
                                                                                        disabled
                                                                                        onChange={(ev) => {
                                                                                            setFieldTouched(field.name);
                                                                                            setFieldValue(
                                                                                                field.name,
                                                                                                ev.target.value
                                                                                            );
                                                                                        }}
                                                                                        className={`form-select ${error ? 'is-invalid' : ''
                                                                                            }`}
                                                                                    >
                                                                                        <option value="">Select your gender</option>
                                                                                        <option value={GenderEnum.male}>
                                                                                            Male
                                                                                        </option>
                                                                                        <option
                                                                                            value={GenderEnum.female}
                                                                                        >
                                                                                            Female
                                                                                        </option>
                                                                                        <option
                                                                                            value={
                                                                                                GenderEnum.preferNotToDisclose
                                                                                            }
                                                                                        >
                                                                                            Prefer not to disclose
                                                                                        </option>
                                                                                    </select>
                                                                                    <small className="text-danger">
                                                                                        {error}
                                                                                    </small>
                                                                                </>
                                                                            );
                                                                        }}
                                                                    </Field>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label className="mb-2 fw-700 fs-14">
                                                                        Aadhaar number{' '}
                                                                        
                                                                    </label>

                                                                    <Field name="aadhar">
                                                                        {(fieldProps: FieldProps) => {
                                                                            const { field, form } = fieldProps;
                                                                            const error =
                                                                                getValue(form.touched, field.name) &&
                                                                                getValue(form.errors, field.name);
                                                                            return (
                                                                                <>
                                                                                    <input
                                                                                        disabled
                                                                                        value={field.value}
                                                                                        onChange={(ev) => {
                                                                                            setFieldTouched(field.name);
                                                                                            setFieldValue(
                                                                                                field.name,
                                                                                                ev.target.value
                                                                                            );
                                                                                        }}
                                                                                        className={`form-control disabled ${error ? 'is-invalid' : ''
                                                                                            }`}
                                                                                        placeholder="Enter last 4 Digits of your aadhaar number"
                                                                                    />
                                                                                    <small className="text-danger">
                                                                                        {error}
                                                                                    </small>
                                                                                </>
                                                                            );
                                                                        }}
                                                                    </Field>
                                                                </div>

                                                                <div className="mb-3">
                                                                    <label className="mb-2 fw-700 fs-14">
                                                                        City/District{' '}
                                                                        <span className="lt-text-error">*</span>
                                                                    </label>
                                                                    <Field name="cityDistrict">
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
                                                                                                (item) =>
                                                                                                    item.value ===
                                                                                                    field.value
                                                                                            )}
                                                                                            onChange={(
                                                                                                selectedOption
                                                                                            ) => {
                                                                                                const { value, state } =
                                                                                                    selectedOption as CitySelectOptionType;
                                                                                                setFieldTouched(
                                                                                                    field.name
                                                                                                );
                                                                                                formikProps.setValues({
                                                                                                    ...formikProps.values,
                                                                                                    [field.name]: value,
                                                                                                    state,
                                                                                                });
                                                                                            }}
                                                                                            options={cityOptions}
                                                                                            className="react-select"
                                                                                            classNamePrefix="react-select"
                                                                                            placeholder="Select city"
                                                                                        />
                                                                                    </div>
                                                                                    <small className="text-danger">
                                                                                        {error}
                                                                                    </small>
                                                                                </>
                                                                            );
                                                                        }}
                                                                    </Field>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label className="mb-2 fw-700 fs-14">
                                                                        State 
                                                                    </label>
                                                                    <Field name="state">
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
                                                                                        value={field.value
                                                                                            .toString()
                                                                                            .toLowerCase()}
                                                                                        onChange={(ev) => {
                                                                                            setFieldTouched(field.name);
                                                                                            setFieldValue(
                                                                                                field.name,
                                                                                                ev.target.value
                                                                                            );
                                                                                        }}
                                                                                        className={`form-control text-camel-case ${error ? 'is-invalid' : ''
                                                                                            }`}
                                                                                        placeholder="Enter state"
                                                                                        id="StateNames"
                                                                                    />
                                                                                    <small className="text-danger">
                                                                                        {error}
                                                                                    </small>
                                                                                </>
                                                                            );
                                                                        }}
                                                                    </Field>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label className="mb-2 fw-700 fs-14">
                                                                        Country 
                                                                    </label>
                                                                    <div className="input-group">
                                                                        <div className="input-group-prepend">
                                                                            <div className="input-group-text disabled flag-padding">
                                                                                <img
                                                                                    src={imgFlag}
                                                                                    alt=""
                                                                                    className="input-flag"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            value={data.country}
                                                                            className="form-control"
                                                                            disabled
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label className="mb-2 fw-700 fs-14">
                                                                        About me
                                                                    </label>
                                                                    <Field name="aboutMe">
                                                                        {(fieldProps: FieldProps) => {
                                                                            const { field } = fieldProps;
                                                                            return (
                                                                                <textarea
                                                                                    rows={8}
                                                                                    maxLength={300}
                                                                                    value={field.value}
                                                                                    onChange={(ev) => {
                                                                                        setFieldTouched(field.name);
                                                                                        setFieldValue(
                                                                                            field.name,
                                                                                            ev.target.value
                                                                                        );
                                                                                    }}
                                                                                    className="form-control"
                                                                                />
                                                                            );
                                                                        }}
                                                                    </Field>
                                                                </div>
                                                                <hr className="my-4" />
                                                                <h1 className="fw-700 fs-18 mb-3">Contact info</h1>
                                                                <div className="row mb-3">
                                                                    <div className="col-6">
                                                                        <label className="mb-2 fw-700 fs-14">
                                                                            Email address{' '}
                                                                            
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            maxLength={320}
                                                                            value={data.email}
                                                                            className={`form-control`}
                                                                            disabled
                                                                        />
                                                                    </div>
                                                                    <div className="col-6">
                                                                        <label className="mb-2 fw-700 fs-14">
                                                                            Phone number{' '}
                                                                            <span className="lt-text-error">*</span>
                                                                        </label>
                                                                        <Field name="phone">
                                                                            {(fieldProps: FieldProps) => {
                                                                                const { field, form } = fieldProps;
                                                                                const error =
                                                                                    getValue(
                                                                                        form.touched,
                                                                                        field.name
                                                                                    ) &&
                                                                                    getValue(form.errors, field.name);
                                                                                return (
                                                                                    <>
                                                                                        <div className="input-group">
                                                                                            <div className="input-group-prepend">
                                                                                                <div className={`input-group-text ${error ? 'is-invalid' : ''}`}>
                                                                                                    +91
                                                                                                </div>
                                                                                            </div>
                                                                                            <input
                                                                                                value={field.value}
                                                                                                onChange={(ev) => {
                                                                                                    setFieldTouched(
                                                                                                        field.name
                                                                                                    );
                                                                                                    setFieldValue(
                                                                                                        field.name,
                                                                                                        ev.target.value
                                                                                                    );
                                                                                                }}
                                                                                                className={`form-control ${error
                                                                                                        ? 'is-invalid'
                                                                                                        : ''
                                                                                                    }`}
                                                                                                placeholder="Enter your phone"
                                                                                            />
                                                                                        </div>
                                                                                        <small className="text-danger">
                                                                                            {error}
                                                                                        </small>
                                                                                    </>
                                                                                );
                                                                            }}
                                                                        </Field>
                                                                    </div>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label className="mb-2 fw-700 fs-14">
                                                                        Professional profile URL
                                                                        <i className="bi bi-info-circle lt-tooltip ms-1">
                                                                            <span className="lt-tooltiptext lt-shadow-md fw-400 fs-14 bottom-tip">
                                                                                Ex:
                                                                                https://www.linkedin.com/in/joan-smith.
                                                                            </span>
                                                                        </i>
                                                                    </label>
                                                                    <Field name="website">
                                                                        {(fieldProps: FieldProps) => {
                                                                            const { field, form } = fieldProps;
                                                                            const error =
                                                                                getValue(form.touched, field.name) &&
                                                                                getValue(form.errors, field.name);
                                                                            return (
                                                                                <input
                                                                                    type="text"
                                                                                    maxLength={255}
                                                                                    value={field.value}
                                                                                    onChange={(ev) => {
                                                                                        setFieldTouched(field.name);
                                                                                        setFieldValue(
                                                                                            field.name,
                                                                                            ev.target.value
                                                                                        );
                                                                                    }}
                                                                                    className={`form-control ${error ? 'is-invalid' : ''
                                                                                        }`}
                                                                                    placeholder="Ex: Linkedin, Portfolio, Blog..."
                                                                                />
                                                                            );
                                                                        }}
                                                                    </Field>
                                                                </div>
                                                                <hr className="my-4" />
                                                                <h1 className="fw-700 fs-18 mb-3">Education Details</h1>
                                                                <div className="mb-3">
                                                                    <label className="mb-2 fw-700 fs-14">
                                                                        Education
                                                                    </label>
                                                                    <Field name="highestEducation">
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
                                                                                            setFieldValue(
                                                                                                field.name,
                                                                                                ev.target.value
                                                                                            );
                                                                                        }}
                                                                                        className={`form-select ${error ? 'is-invalid' : ''
                                                                                            }`}
                                                                                    >
                                                                                        <option value="">Select your highest education</option>
                                                                                        {arrayFromEnum(
                                                                                            HighestEducationEnum
                                                                                        ).map((item) => (
                                                                                            <option
                                                                                                key={item}
                                                                                                value={item}
                                                                                            >
                                                                                                {getHighestEducation(
                                                                                                    item
                                                                                                )}
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                    <small className="text-danger">
                                                                                        {error}
                                                                                    </small>
                                                                                </>
                                                                            );
                                                                        }}
                                                                    </Field>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label className="mb-2 fw-700 fs-14">
                                                                        Institution name
                                                                    </label>
                                                                    <Field name="institutionName">
                                                                        {(fieldProps: FieldProps) => {
                                                                            const { field, form } = fieldProps;
                                                                            const error =
                                                                                getValue(form.touched, field.name) &&
                                                                                getValue(form.errors, field.name);
                                                                            return (
                                                                                <>
                                                                                    <input
                                                                                        type="text"
                                                                                        maxLength={160}
                                                                                        value={field.value}
                                                                                        onChange={(ev) => {
                                                                                            setFieldTouched(field.name);
                                                                                            setFieldValue(
                                                                                                field.name,
                                                                                                ev.target.value
                                                                                            );
                                                                                        }}
                                                                                        className={`form-control ${error ? 'is-invalid' : ''
                                                                                            }`}
                                                                                        placeholder="Enter your institution name"
                                                                                    />
                                                                                    <small className="text-danger">
                                                                                        {error}
                                                                                    </small>
                                                                                </>
                                                                            );
                                                                        }}
                                                                    </Field>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label className="mb-2 fw-700 fs-14">
                                                                        Graduation year
                                                                    </label>
                                                                    <Field name="graduationYear">
                                                                        {(fieldProps: FieldProps) => {
                                                                            const { field, form } = fieldProps;
                                                                            const error =
                                                                                getValue(form.touched, field.name) &&
                                                                                getValue(form.errors, field.name);
                                                                            return (
                                                                                <select
                                                                                    value={field.value}
                                                                                    onChange={(ev) => {
                                                                                        setFieldTouched(field.name);
                                                                                        setFieldValue(
                                                                                            field.name,
                                                                                            ev.target.value
                                                                                        );
                                                                                    }}
                                                                                    className={`form-select ${error ? 'is-invalid' : ''
                                                                                        }`}
                                                                                >
                                                                                    <option value="">Select</option>
                                                                                    {graduationYears.map((item) => (
                                                                                        <option key={item} value={item}>
                                                                                            {item}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            );
                                                                        }}
                                                                    </Field>
                                                                </div>
                                                                <hr className="my-4" />

                                                                <h1 className="fw-700 fs-18 mb-3">Job details</h1>
                                                                <div className="mb-3">
                                                                    <div className="d-flex flex-column">
                                                                        <label className="mb-2 fw-700 fs-14 me-3">
                                                                            Job experience{' '}
                                                                            <span className="lt-text-error">*</span>
                                                                        </label>

                                                                        <div className="d-flex">
                                                                            <>
                                                                                <div className="form-check form-check-inline mb-0">
                                                                                    <Field name="experienceLevel">
                                                                                        {(fieldProps: FieldProps) => {
                                                                                            const { field } =
                                                                                                fieldProps;
                                                                                            return (
                                                                                                <>
                                                                                                    <div className="form-check form-check-inline mb-0 ps-0">
                                                                                                        <input
                                                                                                            className="form-check-input"
                                                                                                            type="radio"
                                                                                                            name="inlineRadioOptions"
                                                                                                            id="FresherRadio"
                                                                                                            checked={
                                                                                                                field.value ===
                                                                                                                ExperienceLevelEnum.Fresher
                                                                                                            }
                                                                                                            value={
                                                                                                                field.value
                                                                                                            }
                                                                                                            onChange={() => {
                                                                                                                setFieldTouched(
                                                                                                                    field.name
                                                                                                                );
                                                                                                                setFieldValue(
                                                                                                                    'jobTitle',
                                                                                                                    ''
                                                                                                                );
                                                                                                                setFieldValue(
                                                                                                                    'prevCompany',
                                                                                                                    ''
                                                                                                                );

                                                                                                                setFieldValue(
                                                                                                                    field.name,
                                                                                                                    ExperienceLevelEnum.Fresher
                                                                                                                );
                                                                                                                SetExperienceLevelValue(
                                                                                                                    ExperienceLevelEnum[
                                                                                                                    ExperienceLevelEnum
                                                                                                                        .Fresher
                                                                                                                    ]
                                                                                                                );
                                                                                                            }}
                                                                                                        />
                                                                                                        <label
                                                                                                            className="form-check-label"
                                                                                                            htmlFor="FresherRadio"
                                                                                                        >
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
                                                                                                                field.value ===
                                                                                                                ExperienceLevelEnum.Experienced
                                                                                                            }
                                                                                                            value={
                                                                                                                field.value
                                                                                                            }
                                                                                                            onChange={() => {
                                                                                                                setFieldTouched(
                                                                                                                    field.name
                                                                                                                );
                                                                                                                setFieldValue(
                                                                                                                    field.name,
                                                                                                                    ExperienceLevelEnum.Experienced
                                                                                                                );
                                                                                                                SetExperienceLevelValue(
                                                                                                                    ExperienceLevelEnum[
                                                                                                                    ExperienceLevelEnum
                                                                                                                        .Experienced
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
                                                                                                    <Field name="experienceLevel">
                                                                                                        {(
                                                                                                            fieldProps: FieldProps
                                                                                                        ) => {
                                                                                                            const {
                                                                                                                field,
                                                                                                                form,
                                                                                                            } =
                                                                                                                fieldProps;
                                                                                                            const error =
                                                                                                                getValue(
                                                                                                                    form.touched,
                                                                                                                    field.name
                                                                                                                ) &&
                                                                                                                getValue(
                                                                                                                    form.errors,
                                                                                                                    field.name
                                                                                                                );
                                                                                                            return (
                                                                                                                <>
                                                                                                                    <div className="d-flex justify-content-between">
                                                                                                                        <small className="text-danger mt-2">
                                                                                                                            {
                                                                                                                                error
                                                                                                                            }
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
                                                                            </>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {experienceLevelValue ===
                                                                    ExperienceLevelEnum[
                                                                    ExperienceLevelEnum.Experienced
                                                                    ] && (
                                                                        <div>
                                                                            <div className="mb-3">
                                                                                <label className="mb-2 fw-700 fs-14">
                                                                                    Job title{' '}
                                                                                    <span className="lt-text-error">*</span>
                                                                                </label>

                                                                                <Field name="jobTitle">
                                                                                    {(fieldProps: FieldProps) => {
                                                                                        const { field, form } = fieldProps;
                                                                                        const error =
                                                                                            getValue(
                                                                                                form.touched,
                                                                                                field.name
                                                                                            ) &&
                                                                                            getValue(
                                                                                                form.errors,
                                                                                                field.name
                                                                                            );
                                                                                        return (
                                                                                            <>
                                                                                                <input
                                                                                                    type="text"
                                                                                                    maxLength={160}
                                                                                                    value={field.value}
                                                                                                    onChange={(ev) => {
                                                                                                        setFieldTouched(
                                                                                                            field.name
                                                                                                        );
                                                                                                        setFieldValue(
                                                                                                            field.name,
                                                                                                            ev.target.value
                                                                                                        );
                                                                                                    }}
                                                                                                    className={`form-control ${error
                                                                                                            ? 'is-invalid'
                                                                                                            : ''
                                                                                                        }`}
                                                                                                    placeholder="Enter your job title."
                                                                                                />
                                                                                                <small className="text-danger">
                                                                                                    {error}
                                                                                                </small>
                                                                                            </>
                                                                                        );
                                                                                    }}
                                                                                </Field>
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <label className="mb-2 fw-700 fs-14">
                                                                                    Company{' '}
                                                                                    <span className="lt-text-error">*</span>
                                                                                </label>

                                                                                <Field name="prevCompany">
                                                                                    {(fieldProps: FieldProps) => {
                                                                                        const { field, form } = fieldProps;
                                                                                        const error =
                                                                                            getValue(
                                                                                                form.touched,
                                                                                                field.name
                                                                                            ) &&
                                                                                            getValue(
                                                                                                form.errors,
                                                                                                field.name
                                                                                            );
                                                                                        return (
                                                                                            <>
                                                                                                <input
                                                                                                    type="text"
                                                                                                    maxLength={160}
                                                                                                    value={field.value}
                                                                                                    onChange={(ev) => {
                                                                                                        setFieldTouched(
                                                                                                            field.name
                                                                                                        );
                                                                                                        setFieldValue(
                                                                                                            field.name,
                                                                                                            ev.target.value
                                                                                                        );
                                                                                                    }}
                                                                                                    className={`form-control ${error
                                                                                                            ? 'is-invalid'
                                                                                                            : ''
                                                                                                        }`}
                                                                                                    placeholder="Enter your Company."
                                                                                                />
                                                                                                <small className="text-danger">
                                                                                                    {error}
                                                                                                </small>
                                                                                            </>
                                                                                        );
                                                                                    }}
                                                                                </Field>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                <hr className="my-4" />
                                                                <div className="mb-3">
                                                                    <span className="fs-14 fw-700">Resume</span>
                                                                    <span className="fs-12 fw-400 ms-2">
                                                                        (You can upload a PDF or Docx file file size
                                                                        limit is 2MB)
                                                                    </span>
                                                                </div>
                                                                <Field name="resumeFileUrl">
                                                                    {(fieldProps: FieldProps) => {
                                                                        const { field } = fieldProps;
                                                                        const file = resume?.file
                                                                            ? resume?.file.name
                                                                            : field.value || null;
                                                                        return file ? (
                                                                            <p className="d-flex align-items-center">
                                                                                <span className="fw-700 fs-14">
                                                                                    Uploaded
                                                                                </span>
                                                                                <span className="ms-2 fs-12">{file}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    data-bs-toggle={
                                                                                        field.value ? 'modal' : ''
                                                                                    }
                                                                                    data-bs-target={
                                                                                        field.value
                                                                                            ? '#DeleteResume'
                                                                                            : ''
                                                                                    }
                                                                                    onClick={() => {
                                                                                        if (resume?.file) {
                                                                                            setFieldValue(
                                                                                                field.name,
                                                                                                ''
                                                                                            );
                                                                                            setResume(null);
                                                                                        }
                                                                                    }}
                                                                                    title="Delete"
                                                                                    className="ms-2 lh-1"
                                                                                >
                                                                                    <IconTrash />
                                                                                </button>
                                                                            </p>
                                                                        ) : (
                                                                            <>
                                                                                <Files
                                                                                    className="files-dropzone"
                                                                                    onChange={(
                                                                                        files: ReactFilesFile[]
                                                                                    ) => {
                                                                                        if (files[0]) {
                                                                                            const file = files[0];
                                                                                            setResume({ file });
                                                                                        }
                                                                                    }}
                                                                                    onError={(
                                                                                        error: ReactFilesError
                                                                                    ) => {
                                                                                        if (error.code === 1) {
                                                                                        }
                                                                                    }}
                                                                                    accepts={['.pdf', '.docx']}
                                                                                    clickable
                                                                                >
                                                                                    <div className="drag-drop-box mt-3">
                                                                                        <div className="text-center">
                                                                                            <i className="bi bi-upload fs-28" />
                                                                                            <p>
                                                                                                Drop your file to upload
                                                                                                or browse
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </Files>
                                                                                <small className="text-danger mt-1">
                                                                                    {resume?.error}
                                                                                </small>
                                                                            </>
                                                                        );
                                                                    }}
                                                                </Field>
                                                            </div>
                                                        </div>
                                                        <div className="modal-footer lt-modal-footer text-end mt-4 lt-edit-profile-footer">
                                                            <Buttons />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <DeleteResume
                                        deleteSuccessful={() => {
                                            setFieldValue('resumeFileUrl', '');
                                        }}
                                    />
                                </form>
                            );
                        }}
                    </Formik>
                </Profile>
            </Context.Provider>
        )
    );
};

export default MyProfile;

const getValidationSchema = () =>
    objectYup().shape({
        firstName: stringYup()
            .required('First name is required and must be at least 3 characters.')
            .min(3, 'First name must be at least 3 characters.'),
        lastName: stringYup()
            .required('Last name is required and must be at least 3 characters.')
            .min(3, 'Last name must be at least 3 characters.'),
        cityDistrict: stringYup().required('City/District is required.'),
        state: stringYup().required('State is required.'),
        dob: dateYup()
            .nullable()
            .transform((current, orig) => (orig === '' ? null : current))
            .required('Date of birth is required and must be as per aadhaar.'),
        gender: stringYup().required('Gender is required.'),
        aadhar: stringYup().required('Aadhaar is required and must be last 4 digits of your Aadhaar number.').min(19, 'Aadhar number must be at least 4 digits.'),
        phone: stringYup().required('Phone number is required and must be 10 digits number.').min(10, 'Phone number must be at least 10 digits number.'),
        experienceLevel: numYup().required('Required field'),
        jobTitle: stringYup().when('experienceLevel', {
            is: ExperienceLevelEnum.Experienced,
            then: stringYup().required('Job title is required.'),
        }),
        prevCompany: stringYup().when('experienceLevel', {
            is: ExperienceLevelEnum.Experienced,
            then: stringYup().required('Company is required.'),
        }),
    });
