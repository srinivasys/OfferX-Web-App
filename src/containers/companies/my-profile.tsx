import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Field, FieldProps, Formik, FormikProps } from 'formik';
import getValue from 'lodash/get';
import MaskedInput from 'react-text-mask';
import Select from 'react-select';
import { object as objectYup, string as stringYup, number as numberYup, date } from 'yup';
import { companyService } from '../../lib/api/company';
import { CompanyProfileType, EditCompanyFormType, UpdateCompanyRequestType } from '../../types/company';
import Profile from '../../components/profile';
import { RootState } from '../../redux';
import { ManagerPermissionEnum, UserType } from '../../types/auth';
import { emailRegexp, gstRegexp, mobileMask, siteRegexp, yearMask } from '../../lib/utils/validation';
import useInitialErrors from '../../hooks/formik-initial-errors';
import { getUser } from '../../redux/user';
import PageLoader from '../../components/loader';
import { cityOptions, CitySelectOptionType } from '../../lib/utils/select';
import imgFlag from '../../assets/icons/flag.png';
import { closeModal } from '../../lib/utils/close-modal';
import Context from '../../context/update';
import ShowPopUp from '../../components/custom-popup-alert';
import { reviewService } from '../../lib/api/review';
import { CompanyReviewsType } from '../../types/review';

const MyCompany = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<CompanyProfileType | null>(null);
    const [success, setSuccess] = useState(false);
    const [reviewData, setReviewData] = useState<CompanyReviewsType[]>();

    const { user } = useSelector((state: RootState) => state.user);
    const hasUser = user as UserType;

    function handleCloseModal() {
        setTimeout(() => {
            success && setSuccess(false);
        }, 500);
    }

    const initialValues = useMemo(
        () => ({
            name: data?.name || '',
            gstNumber: data?.gstNumber.value || '',
            industry: data?.industry || '',
            foundedYear:data?.foundedYear || 0,
            aboutUs: data?.aboutUs || '',
            companyAddress: data?.companyAddress || '',
            cityDistrict: data?.cityDistrict || '',
            state: data?.state || '',
            country: data?.country || '',
            postalCode: data?.postalCode || '',
            phone: data?.phone ? `${data.phone}` : '',
            email: data?.email || '',
            webSite: data?.webSite || 'https://',
        }),
        [data]
    );

    const initialErrors = useInitialErrors(initialValues, getValidationSchema());

    const getProfile = useCallback(async () => {
        try {
            const { resultObject: company } = await companyService.getProfile();
            const { resultObject } = await reviewService.getCompanyReview(hasUser?.companyId || '');
            setReviewData(resultObject);
            setData(company);
        } catch (err: any) {
        } finally {
            setLoading(false);
        }
    }, []);

    const submitForm = useCallback(
        async (values: EditCompanyFormType) => {
            const requestData: UpdateCompanyRequestType = {
                ...values,
                phone: values.phone,
                foundedYear: Number(values.foundedYear),
                gstNumber: values.gstNumber === '' ? null : values.gstNumber,
            };
            let formData = new FormData();
            formData.append('request', JSON.stringify(requestData));
            try {
                await companyService.update(formData);
                await dispatch(getUser());
                await getProfile();
                setSuccess(true);
            } catch (err) {
            }
        },
        [dispatch, getProfile]
    );

    useEffect(() => {
        getProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return loading ? (
        <PageLoader />
    ) : (
        data && (
            <Context.Provider value={{ updateProfile: getProfile }}>
                <Profile
                    avatar={data.avatarUrl}
                    banner={data.bannerUrl}
                    name={data.name}
                    activity={data.industry}
                    location={`${data.cityDistrict}, ${data.state}`}
                    address={data.companyAddress}
                    aboutUs={data.aboutUs}
                    reviewsCount={data.reviewsCount}
                    rating={data.rating.value}
                    contractCompliance={data.contractComplianceQuantity}
                    contractViolation={data.contractViolationQuantity}
                    phone={data.phone}
                    email={data.email}
                    website={data.webSite}
                    foundedYear={data.foundedYear}
                    editCompany={user?.permissionTypes?.includes(ManagerPermissionEnum.admin)}
                    reviewOffers={[]}
                    isMyProfile={true}
                    reviewItemsList={reviewData?.map((item) => ({
                        id: item.id,
                        avatar: item.candidateAvatarUrl,
                        name: `${item.candidateFirstName} ${item.candidateLastName}`,
                        text: item.reviewText,
                        date: item.date,
                        contractComplianceState: item.contractComplianceState,
                        rating: item.stars,
                        creatorId: item.candidateId,
                        offerId: item.offerId,
                        reviewType: item.reviewType,
                        contractViolationReason: item.contractViolationReason,
                        location: item.jobTitle,
                        onboardReviewList: item.onboardingReviews.map((item) => ({
                            id: item.id,
                            avatar: item.companyAvatarUrl,
                            name: item.companyName,
                            text: item.reviewText,
                            date: item.date,
                            contractComplianceState: item.contractComplianceState,
                            rating: item.stars.value,
                            creatorId: item.candidateId,
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
                            creatorId: item.candidateId,
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
                            creatorId: item.candidateId,
                            offerId: item.offerId,
                            reviewType: item.reviewType,
                            contractViolationReason: item.contractViolationReason,
                        })),
                    }))}
                >
                    <Formik
                        onSubmit={submitForm}
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={getValidationSchema()}
                        initialErrors={initialErrors}
                    >
                        {(formikProps: FormikProps<EditCompanyFormType>) => {
                            const { handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm } =
                                formikProps;

                            const Buttons = () => {
                                return (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                resetForm();
                                            }}
                                            className="btn btn-outline-primary outline-p-hover me-2"
                                            data-bs-dismiss="modal"
                                        >
                                            Cancel
                                        </button>
                                        {isSubmitting && (
                                            <div className="new-spinner p-absolute">
                                                <div>
                                                    <span className="spinner-border spinner-border-sm custom-spinner-border" />
                                                </div>
                                                <p className="fs-14 custom-loading-text">Loading</p>
                                            </div>
                                        )}
                                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
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
                                            className={`${
                                                success ? 'modal-md' : 'modal-lg'
                                            } modal-dialog lt-edit-profile modal-dialog-centered modal-dialog-scrollable`}
                                        >
                                            <div className="modal-content lt-modal-content pe-3">
                                                {loading ? (
                                                    <PageLoader />
                                                ) : success ? (
                                                    <ShowPopUp
                                                        handleCloseModal={handleCloseModal}
                                                        headerText="Company profile"
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
                                                                    resetForm();
                                                                }}
                                                                aria-label="Close"
                                                            />
                                                        </div>
                                                        <div className="modal-body lt-modal-body mt-4 mt-sm-0">
                                                            <div className="pe-3 pt-3">
                                                                <h1 className="fw-700 fs-18 mb-3">Company details</h1>
                                                                <hr />
                                                                <div className="mb-3">
                                                                    <label className="mb-2 fw-700 fs-14">
                                                                        Company name as in GST return{' '}
                                                                        <span className="lt-text-error">*</span>
                                                                    </label>
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
                                                                                            setFieldValue(
                                                                                                field.name,
                                                                                                ev.target.value
                                                                                            );
                                                                                        }}
                                                                                        className={`form-control ${
                                                                                            error ? 'is-invalid' : ''
                                                                                        }`}
                                                                                        placeholder="Enter your company name as in GST return"
                                                                                        maxLength={350}
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
                                                                        Company GST number
                                                                    </label>
                                                                    <Field name="gstNumber">
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
                                                                                            setFieldValue(
                                                                                                field.name,
                                                                                                ev.target.value
                                                                                            );
                                                                                        }}
                                                                                        className={`form-control text-uppercase ${
                                                                                            error ? 'is-invalid' : ''
                                                                                        }`}
                                                                                        disabled
                                                                                        placeholder="Enter your company GST number"
                                                                                        maxLength={15}
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
                                                                        Industry
                                                                    </label>
                                                                    <Field name="industry">
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
                                                                                            setFieldValue(
                                                                                                field.name,
                                                                                                ev.target.value
                                                                                            );
                                                                                        }}
                                                                                        className={`form-control ${
                                                                                            error ? 'is-invalid' : ''
                                                                                        }`}
                                                                                        placeholder="Enter industry"
                                                                                        maxLength={160}
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
                                                                        Founded year
                                                                    </label>
                                                                    <Field name="foundedYear">
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

                                                                                            setFieldValue(
                                                                                                field.name,

                                                                                                ev.target.value
                                                                                            );
                                                                                        }}
                                                                                        className={`form-control ${
                                                                                            error ? 'is-invalid' : ''
                                                                                        }`}
                                                                                        placeholder="Enter founded year"
                                                                                        guide={false}
                                                                                        mask={yearMask}
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
                                                                        About us
                                                                    </label>
                                                                    <Field name="aboutUs">
                                                                        {(fieldProps: FieldProps) => {
                                                                            const { field } = fieldProps;
                                                                            return (
                                                                                <textarea
                                                                                    rows={8}
                                                                                    maxLength={2000}
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
                                                                <h1 className="fw-700 fs-18 mb-3">
                                                                    Company contact info
                                                                </h1>
                                                                <div className="mb-3">
                                                                    <label className="mb-2 fw-700 fs-14">
                                                                        Company address{' '}
                                                                        <span className="lt-text-error">*</span>
                                                                    </label>
                                                                    <Field name="companyAddress">
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
                                                                                        maxLength={500}
                                                                                        onChange={(ev) => {
                                                                                            setFieldTouched(field.name);
                                                                                            setFieldValue(
                                                                                                field.name,
                                                                                                ev.target.value
                                                                                            );
                                                                                        }}
                                                                                        className={`form-control ${
                                                                                            error ? 'is-invalid' : ''
                                                                                        }`}
                                                                                        placeholder="Enter address"
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
                                                                                        className={`form-control text-camel-case ${
                                                                                            error ? 'is-invalid' : ''
                                                                                        }`}
                                                                                        placeholder="Enter state"
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
                                                                        Postal code{' '}
                                                                        <span className="lt-text-error">*</span>
                                                                    </label>
                                                                    <Field name="postalCode">
                                                                        {(fieldProps: FieldProps) => {
                                                                            const { field, form } = fieldProps;
                                                                            const error =
                                                                                getValue(form.touched, field.name) &&
                                                                                getValue(form.errors, field.name);
                                                                            return (
                                                                                <>
                                                                                    <input
                                                                                        type="text"
                                                                                        maxLength={10}
                                                                                        value={field.value}
                                                                                        onChange={(ev) => {
                                                                                            setFieldTouched(field.name);
                                                                                            setFieldValue(
                                                                                                field.name,
                                                                                                ev.target.value
                                                                                            );
                                                                                        }}
                                                                                        className={`form-control ${
                                                                                            error ? 'is-invalid' : ''
                                                                                        }`}
                                                                                        placeholder="Enter postal code"
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
                                                                    <label className="mb-2 fw-700 fs-14 ">
                                                                        Company phone number{' '}
                                                                        <span className="lt-text-error">*</span>
                                                                    </label>
                                                                    <Field name="phone">
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
                                                                                                className={`input-group-text ${
                                                                                                    error
                                                                                                        ? 'is-invalid'
                                                                                                        : ''
                                                                                                }`}
                                                                                            >
                                                                                                +91
                                                                                            </div>
                                                                                        </div>
                                                                                        <MaskedInput
                                                                                            value={field.value}
                                                                                            maxLength={15}
                                                                                            onChange={(ev) => {
                                                                                                setFieldTouched(
                                                                                                    field.name
                                                                                                );
                                                                                                setFieldValue(
                                                                                                    field.name,
                                                                                                    ev.target.value
                                                                                                );
                                                                                            }}
                                                                                            className={`form-control ${
                                                                                                error
                                                                                                    ? 'is-invalid'
                                                                                                    : ''
                                                                                            }`}
                                                                                            placeholder="Enter phone number"
                                                                                            guide={false}
                                                                                            mask={mobileMask}
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
                                                                        Company email{' '}
                                                                        <span className="lt-text-error">*</span>
                                                                    </label>
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
                                                                                        maxLength={320}
                                                                                        value={field.value}
                                                                                        onChange={(ev) => {
                                                                                            setFieldTouched(field.name);
                                                                                            setFieldValue(
                                                                                                field.name,
                                                                                                ev.target.value
                                                                                            );
                                                                                        }}
                                                                                        className={`form-control ${
                                                                                            error ? 'is-invalid' : ''
                                                                                        }`}
                                                                                        placeholder="Enter your company email"
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
                                                                        Company website{' '}
                                                                        <span className="lt-text-error">*</span>
                                                                    </label>
                                                                    <Field name="webSite">
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
                                                                                        maxLength={255}
                                                                                        onChange={(ev) => {
                                                                                            setFieldTouched(field.name);
                                                                                            setFieldValue(
                                                                                                field.name,
                                                                                                ev.target.value
                                                                                            );
                                                                                        }}
                                                                                        className={`form-control ${
                                                                                            error ? 'is-invalid' : ''
                                                                                        }`}
                                                                                        placeholder="Has to match with company email domain"
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
                                                        </div>
                                                        <div className="modal-footer lt-modal-footer text-sm-end mt-4 lt-edit-profile-footer">
                                                            <Buttons />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            );
                        }}
                    </Formik>
                    {/* {isReviewConfirmationModal &&  <ShowPopUp headerText='Company Profile' text='Profile updated successfully' />} */}
                </Profile>
            </Context.Provider>
        )
    );
};

export default MyCompany;

const invalidYearAlert = 'Founded year should be between 1900 and ' + new Date().getFullYear();

const getValidationSchema = () =>
    objectYup().shape({
        name: stringYup().required('Required field.'),
        companyAddress: stringYup().required('Company address is required.'),
        cityDistrict: stringYup().required('City/District is required.'),
        state: stringYup().required('State is required.'),
        postalCode: stringYup().required('Postal code is required.'),
        foundedYear:
            numberYup()
                .nullable()
                .integer()
                .label('Founded year')
                .when(
                    'foundedYear',
                    (foundedYear, schema) => {
                        if (foundedYear) {
                            return schema
                                .min(1900, invalidYearAlert)
                                .max(new Date().getFullYear(), invalidYearAlert);
                        }
                        return schema;
                    }
                ),
        email: stringYup().required('Email is required.').matches(emailRegexp, {
            message: 'Invalid email format.',
        }),
        gstNumber: stringYup().matches(gstRegexp, {
            message: 'Invalid GST number',
        }),
        phone: stringYup()
            .required('Company Phone number is required and must be 10 digits number.')
            .min(10, 'Phone number must be at least 10 digits.'),
        webSite: stringYup()
            .required('Company website is required.')
            .matches(siteRegexp, {
                message: 'Invalid site',
            })
            .test(
                'webSite',
                'Invalid website domain. The company website has to match the company email.',
                function (value) {
                    if (!value || !this.parent.email) return false;
                    const emailDomain = this.parent.email.match(/@(.*)/);
                    if (!emailDomain) return false;
                    return value.includes(emailDomain[1]);
                }
            ),
    },
    [
        ["foundedYear", "foundedYear"]
    ]
    );
