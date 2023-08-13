import React, { useState } from 'react';
import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { object as objectYup, string as stringYup, mixed as mixedYup, date as dateYup } from 'yup';
import { toast } from 'react-toastify';
//@ts-ignore
import Files from 'react-files';
import useInitialErrors from '../../hooks/formik-initial-errors';
import getValue from 'lodash/get';
import DatePickerComponent from '../../components/date-picker';
import { ReactFilesError, ReactFilesFile } from '../../types/files';
import { routes } from '../routes/routes-names';
import PdfViewer from '../../components/pdf-viewer';
import DocxViewer from '../../components/docx-viewer';
import { Messages } from '../../lib/utils/messages';
import { isLessThanTheMB } from '../../lib/utils/lessthan-max-filesize';
import { CandidateListType } from '../../types/candidate';
import avatar from '../../assets/img/avatar-grey.png';
import ReviewChart from '../../components/profile/component/review-chart';
import { ContractComplianceStateEnum, ReviewType } from '../../types/review';
import { ReleaseOfferReviewsType } from '.';
import { isExitReviewEnabled, isProgressReviewEnabled } from '../../lib/utils/reviews-config';
import { Rating } from 'react-simple-star-rating';
import { ExperienceLevelEnum } from '../../lib/constants/constants';
import { placeholder } from '../../types/grid';
type reviewTypes = {
    id?: string;
    avatar?: string;
    name?: string;
    text?: string | null;
    date?: Date;
    contractComplianceState?: ContractComplianceStateEnum;
    rating?: number | null;
    creatorId?: string | null;
    offerId?: string | null;
    reviewType?: number | null;
    reviewText?: string;
    contractViolationReason?: string;
};
export type OfferFormDataType = {
    jobTitle: string;
    offerExpiryDate: Date | null;
    jobStartDate: Date | null;
    file: ReactFilesFile | null;
};

type Props = {
    docValues: OfferFormDataType | null;
    setDocValues: (values: OfferFormDataType) => void;
    goPrev: () => void;
    goNext: () => void;
    candidate?: CandidateListType | null;
    contractCompliance?: number;
    candidateReviews: ReleaseOfferReviewsType | null;
    contractViolation?: number;
    reOfferState?: boolean;
    reviewItemsList?: {
        id?: string | null;
        avatar?: string;
        name?: string;
        text?: string | null;
        date?: Date;
        contractComplianceState?: ContractComplianceStateEnum;
        rating?: any;
        creatorId: string | null;
        offerId: string | null;
        reviewType?: number[] | null;
        reviewText?: string;
        contractViolationReason?: string;
        location?: string;
        onboardReviewList?: reviewTypes[];
        progressReviewList?: reviewTypes[];
        exitReviewList?: reviewTypes[];
    }[];
};

const initialFormData = {
    jobTitle: '',
    offerExpiryDate: null,
    jobStartDate: null,
    file: null,
};

const today = new Date();
const jobStartDateMaxDays = 120;
const maxDate = (date: Date) => moment(date).add('days', jobStartDateMaxDays).toDate();

const ReleaseOfferDocument: React.FC<Props> = ({
    docValues,
    setDocValues,
    goPrev,
    goNext,
    candidate,
    reviewItemsList,
    candidateReviews,
    reOfferState,
}) => {
    const [offerFormData] = useState(docValues || initialFormData);
    const initialErrors = useInitialErrors(offerFormData, getValidationSchema());

    return (
        <div className="p-4 lt-bg-white rounded">
            {candidate && (
                <>
                    <div className="w-100 d-flex mb-4 align-items-center">
                        <div>
                            <img src={candidate.avatarUrl || avatar} alt="" className="avatar mb-2 me-3 avatar-width" />
                        </div>
                        <div>
                            <h1 className="fs-20 fw-700 mb-1 text-capitalize">
                              {candidate.firstName.toLowerCase()} {candidate.lastName.toLowerCase()}
                            </h1>
                            <p className="fs-14 fw-400">{candidate.experienceLevel == ExperienceLevelEnum.Experienced ? candidate.jobTitle : ExperienceLevelEnum[ExperienceLevelEnum.Fresher]}</p>

                            <div className="me-3 dropend ox-reviews-dropend">
                                {!isProgressReviewEnabled && !isExitReviewEnabled && (
                                    <div className="d-inline-flex align-items-center">
                                        <span className="me-2 lt-text-primary-light fs-20 fw-600 mt-1">
                                            {candidate.rating}
                                        </span>
                                        <Rating
                                            allowFraction={true}
                                            size={22}
                                            fillColor="#4EB6FF"
                                            initialValue={candidate.rating}
                                            transition={true}
                                            emptyColor="transparent"
                                            SVGstrokeColor="#4EB6FF"
                                            SVGstorkeWidth="1"
                                            readonly={true}
                                            allowTitleTag={false}
                                        />
                                    </div>
                                )}
                                {(isProgressReviewEnabled || isExitReviewEnabled) && (
                                    <>
                                        <div
                                            className="d-inline-flex align-items-center dropdown-toggle cursor-pointer"
                                            data-bs-toggle="dropdown"
                                            data-bs-auto-close="outside"
                                        >
                                            <span className="me-2 lt-text-primary-light fs-20 fw-600 mt-1">
                                                {candidate.rating}
                                            </span>
                                            <Rating
                                                allowFraction={true}
                                                size={22}
                                                fillColor="#4EB6FF"
                                                initialValue={candidate.rating}
                                                transition={true}
                                                emptyColor="transparent"
                                                SVGstrokeColor="#4EB6FF"
                                                SVGstorkeWidth="1"
                                                readonly={true}
                                                allowTitleTag={false}
                                            />
                                            <i className="bi bi-chevron-right mt-1"></i>
                                        </div>
                                        <div className="dropdown-menu p-3 border-0 shadow dropdown-width">
                                            <div className="">
                                                <ReviewChart
                                                    title="Onboarding review"
                                                    reviewList={reviewItemsList?.map((x) => x.onboardReviewList).flat()}
                                                    ReviewTypeEnum={ReviewType.OnboardingReview}
                                                />
                                                <ReviewChart
                                                    title="Performance review"
                                                    reviewList={reviewItemsList
                                                        ?.map((x) => x.progressReviewList)
                                                        .flat()}
                                                    ReviewTypeEnum={ReviewType.ProgressReview}
                                                />
                                                <ReviewChart
                                                    title="Exit review"
                                                    reviewList={reviewItemsList?.map((x) => x.exitReviewList).flat()}
                                                    ReviewTypeEnum={ReviewType.ExitReview}
                                                />
                                            </div>
                                            <div>
                                                <ul className="list-group">
                                                    <p className="fs-12 fw-600 mb-2">Contract metrics</p>
                                                    <li className="d-flex align-items-center fs-13 mb-2">
                                                        <span className="lt-text-success">
                                                            <i className="bi bi-check-circle"></i>
                                                        </span>
                                                        <div className="lt-text-secondary-alt">
                                                            <span className="">
                                                                {candidateReviews?.contractComplianceQuantity}
                                                            </span>{' '}
                                                            <span className="">'Onboarded'</span>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex align-items-center fs-13">
                                                        <span className="lt-text-error">
                                                            <i className="bi bi-dash-circle"></i>
                                                        </span>
                                                        <div className="lt-text-secondary-alt">
                                                            <span className="">
                                                                {candidateReviews?.contractViolationQuantity}
                                                            </span>{' '}
                                                            <span className="">'Ghosted'</span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="d-flex align-items-center mb-0">
                                <span className="lt-text-success">
                                    <i className="bi bi-check-circle"></i>
                                </span>
                                <div className="lt-text-secondary-alt fs-12 fw-600"> 
                                    {candidateReviews?.contractComplianceQuantity}{' '}
                                    Onboarded
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-0">
                                <span className="lt-text-error">
                                    <i className="bi bi-dash-circle fs-16"></i>
                                </span>
                                <div className="lt-text-secondary-alt fs-12 fw-600">
                                    {candidateReviews?.contractViolationQuantity}{' '}
                                 Ghosted
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <Formik
                onSubmit={goNext}
                enableReinitialize
                initialValues={offerFormData}
                validationSchema={getValidationSchema()}
                initialErrors={initialErrors}
                validate={setDocValues}
            >
                {(formikProps: FormikProps<OfferFormDataType>) => {
                    const { handleSubmit, values, isSubmitting, setFieldTouched, setFieldValue } = formikProps;

                    const btnControls = (
                        <div>
                            {!reOfferState && (
                                <button
                                    type="button"
                                    onClick={goPrev}
                                    className="btn btn-outline-primary outline-p-hover me-3 release-btns"
                                    disabled={isSubmitting}
                                >
                                    Previous
                                </button>
                            )}

                            <button type="submit" className="btn btn-primary release-btns" disabled={isSubmitting}>
                                Next
                            </button>
                        </div>
                    );

                    return (
                        <form onSubmit={handleSubmit}>
                            <div className="release-offer-controls">
                                <div className="d-flex align-items-center justify-content-center">{btnControls}</div>
                            </div>
                            <div className="release-offer-controls-bottom">
                                <div className="d-flex align-items-center justify-content-center mt-3">
                                    {btnControls}
                                </div>
                            </div>

                            <h1 className="fw-700 fs-18 mb-4">
                                {reOfferState ? 'Revise offer details' : 'Add offer details'}
                            </h1>
                            <div className="mb-3">
                                <label className="fw-700 mb-2 fs-14">
                                    Job title <span className="lt-text-error">*</span>
                                </label>
                                <Field name="jobTitle">
                                    {(fieldProps: FieldProps) => {
                                        const { field, form } = fieldProps;
                                        const error =
                                            getValue(form.touched, field.name) && getValue(form.errors, field.name);
                                        return (
                                            <>
                                                <input
                                                    type="text"
                                                    maxLength={160}
                                                    value={field.value}
                                                    onChange={(ev) => {
                                                        setFieldTouched(field.name);
                                                        setFieldValue(field.name, ev.target.value);
                                                    }}
                                                    placeholder='Enter job title'
                                                    className={`form-control ${error ? 'is-invalid' : ''}`}
                                                />
                                                <small className="text-danger">{error}</small>
                                            </>
                                        );
                                    }}
                                </Field>
                            </div>
                            <div className="row">
                                <div className="col-12 col-sm mb-3">
                                    <label className="fw-700 mb-2 fs-14">
                                        Offer expiry date <span className="lt-text-error">* </span>
                                        <span className="lt-tooltip fw-400">
                                            <i className="bi bi-info-circle fs-14" />
                                            <span className="lt-tooltiptext lt-tooltiptext--right fs-12">
                                                Offer expiry date cannot be prior to offer
                                                <br /> release date and later to job start date
                                            </span>
                                        </span>
                                    </label>
                                    <Field name="offerExpiryDate">
                                        {(fieldProps: FieldProps) => {
                                            const { field, form } = fieldProps;
                                            const error =
                                                getValue(form.touched, field.name) && getValue(form.errors, field.name);
                                            return (
                                                <>
                                                    <div className={error ? 'react-datepicker-error' : ''}>
                                                        <DatePickerComponent
                                                            minDate={today}
                                                            startDate={field.value}
                                                            placeholder={'dd/mm/yyyy'}
                                                            onChange={(date) => {
                                                                setFieldTouched(field.name);
                                                                setFieldValue(field.name, date);
                                                            }}
                                                        />
                                                    </div>
                                                    <small className="text-danger">{error}</small>
                                                </>
                                            );
                                        }}
                                    </Field>
                                </div>
                                <div className="col-12 col-sm mb-3">
                                    <label className="fw-700 mb-2 fs-14">
                                        Job start date <span className="lt-text-error">* </span>
                                        <span className="lt-tooltip fw-400">
                                            <i className="bi bi-info-circle fs-14" />
                                            <span className="lt-tooltiptext lt-tooltiptext--right fs-12">
                                                Job start date cannot be prior to offer expiry date
                                            </span>
                                        </span>
                                    </label>
                                    <Field name="jobStartDate">
                                        {(fieldProps: FieldProps) => {
                                            const { field, form } = fieldProps;
                                            const error =
                                                getValue(form.touched, field.name) && getValue(form.errors, field.name);
                                            return (
                                                <>
                                                    <div className={error ? 'react-datepicker-error' : ''}>
                                                        <DatePickerComponent
                                                            minDate={
                                                                values.offerExpiryDate && values.offerExpiryDate > today
                                                                    ? values.offerExpiryDate
                                                                    : today
                                                            }
                                                            maxDate={
                                                                values.offerExpiryDate
                                                                    ? maxDate(values.offerExpiryDate)
                                                                    : undefined
                                                            }
                                                            startDate={field.value}
                                                            placeholder={'dd/mm/yyyy'}
                                                            onChange={(date) => {
                                                                setFieldTouched(field.name);
                                                                setFieldValue(field.name, date);
                                                            }}
                                                        />
                                                    </div>
                                                    <small className="text-danger">{error}</small>
                                                </>
                                            );
                                        }}
                                    </Field>
                                </div>
                            </div>
                            <div>
                                <label className="fw-700 mb-2 fs-14">
                                    Offer letter <span className="lt-text-error">*</span>
                                </label>
                                <Field name="file">
                                    {(fieldProps: FieldProps) => {
                                        const { field, form } = fieldProps;
                                        const error =
                                            getValue(form.touched, field.name) && getValue(form.errors, field.name);
                                        return values.file ? (
                                            <>
                                                <p className="fs-14">
                                                    {values.file.name}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFieldValue(field.name, null);
                                                        }}
                                                        className="ms-2 btn-link"
                                                    >
                                                        Replace
                                                    </button>
                                                </p>
                                                <div className="mt-3" />
                                                {values.file.extension === 'pdf' && (
                                                    <PdfViewer url={values.file.preview.url as string} />
                                                )}
                                                {values.file.extension === 'docx' && (
                                                    <DocxViewer url={values.file.preview.url as string} />
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <span className="fs-12 ms-3">
                                                    (Allowed file formats: pdf <span className="fw-400">Upto 5MB</span>)
                                                </span>
                                                <Files
                                                    className="files-dropzone"
                                                    multiple={false}
                                                    onChange={(files: ReactFilesFile[]) => {
                                                        if (files[0]) {
                                                            const file = files[0];
                                                            const fileSize = isLessThanTheMB(file.size, 5);
                                                            if (fileSize) {
                                                                if (!file.preview.url) {
                                                                    file.preview.url = URL.createObjectURL(file);
                                                                }
                                                                setFieldTouched(field.name);
                                                                setFieldValue(field.name, file);
                                                            } else {
                                                                toast.error(Messages.FileSizeExceedWarning);
                                                            }
                                                        }
                                                    }}
                                                    onError={(error: ReactFilesError) => {
                                                        if (error.code === 1) {
                                                        }
                                                    }}
                                                    accepts={['.pdf']}
                                                    clickable
                                                >
                                                    <div className="drag-drop-box mt-3">
                                                        <div className="text-center">
                                                            <i className="bi bi-upload fs-28" />
                                                            <p>
                                                                Drop your file to upload or{' '}
                                                                <a className="ox-browse">browse</a>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Files>
                                                <small className="text-danger">{error}</small>
                                            </>
                                        );
                                    }}
                                </Field>
                            </div>
                        </form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default ReleaseOfferDocument;

const getValidationSchema = () =>
    objectYup().shape({
        jobTitle: stringYup().required('Job Title is required.'),
        offerExpiryDate: dateYup()
            .nullable()
            .transform((current, orig) => (orig === '' ? null : current))
            .test('offerExpiryDateEarlier', 'Offer Expiry Date must be no earlier than today', function (value) {
                const today = new Date(new Date().setHours(0, 0, 0, 0));
                return value ? value >= today : true;
            })
            .required('Offer expiry date is required.'),
        jobStartDate: dateYup()
            .nullable()
            .transform((current, orig) => (orig === '' ? null : current))
            .required('Job start date is required.')
            .test('jobStartDateEarlier', 'Job Start Date must be no earlier than today', function (value) {
                const today = new Date(new Date().setHours(0, 0, 0, 0));
                return value ? value >= today : true;
            })
            .test(
                'jobStartDateMaxDays',
                'Job Start Date must be no later than 120 days after Offer Expiry Date.',
                function (value) {
                    return this.parent.offerExpiryDate && value ? value <= maxDate(this.parent.offerExpiryDate) : true;
                }
            )
            .test('jobStartDate', 'Job start date cannot be prior to offer expiry date.', function (value) {
                return value && this.parent.offerExpiryDate ? this.parent.offerExpiryDate <= value : true;
            }),
        file: mixedYup().required('Required field.'),
    });
