import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import useInitialErrors from '../../hooks/formik-initial-errors';
import { object as objectYup, string as stringYup } from 'yup';
import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { CandidateListType } from '../../types/candidate';
import getValue from 'lodash/get';
import { routes } from '../routes/routes-names';
import { arrayFromEnum } from '../../lib/utils/emun';
import { getAutomaticReminderText } from '../../lib/utils/dictionary';
import { AutomaticReminderEnum } from '../../types/offer';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { UserType } from '../../types/auth';
import { OfferFormDataType } from './document';
import { tinyApiKey } from '../../config/constants';

export type OfferFormEmailType = {
    emailSubject: string ;
    emailMessage: () => string | undefined;
    automaticReminder: number;
};

type Props = {
    candidate: CandidateListType;
    docValues: OfferFormDataType;
    emailValues: OfferFormEmailType | null;
    setEmailValues: (values: OfferFormEmailType | null) => void;
    goPrev: () => void;
    submitForm: () => void;
    loading: boolean;
    reofferState?: boolean;
};

const ReleaseOfferEmail: React.FC<Props> = ({
    candidate,
    emailValues,
    docValues,
    setEmailValues,
    goPrev,
    submitForm,
    loading,
    reofferState
}) => {
    const { user } = useSelector((state: RootState) => state.user);
    const hasUser = user as UserType;

    const emailSubjectContent = () => {

        if (reofferState == null || !reofferState)
        {
            return (`Employment offer`)
        }

        if (reofferState)
        {
            return (`Revised employment offer`)
        } 

    }

const emailMessageContent = () => {

    if (reofferState == null || !reofferState)
    {
      return ( `<p style="text-transform:capitalize">Dear ${candidate.firstName.toLowerCase()} ${candidate.lastName.toLowerCase()},</p><p>Congratulations! ${
            hasUser.companyName
        } is excited to extend this job offer for the position of ${
            docValues.jobTitle
        }! Please review and sign the offer letter by ${docValues.offerExpiryDate?.toLocaleString('en-in', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })}.<br />
        <br>The Non-Disclosure terms & conditions still hold as per Non-Disclosure agreement agreed by us on either party. <br />
        <br>${
            hasUser.companyName
        } looks forward to bringing you on board! If you have any questions, feel free to write to me at ${
            hasUser.email
        }.<br />
           <br>Looking towards a long term relationship and wishing you all the success at ${hasUser.companyName}.
           <br />
           </p>`
      );
    }

    if (reofferState)
    {
        return (`<p style="text-transform:capitalize">Dear ${candidate.firstName.toLowerCase()} ${candidate.lastName.toLowerCase()},</p><p>The 
               email is to inform you that the offer of ${
               docValues.jobTitle
           } has been revised. Please review and sign the offer letter by ${docValues.offerExpiryDate?.toLocaleString('en-in', {
               day: 'numeric',
               month: 'short',
               year: 'numeric',
           })}.<br />
           <br>The Non-Disclosure terms & conditions still hold as per Non-Disclosure agreement agreed by us on either party. <br />
           <br>${
               hasUser.companyName
           } looks forward to bringing you on board! If you have any questions, feel free to write to me at ${
               hasUser.email
           }.<br />
              <br>Looking towards a long term relationship and wishing you all the success at ${hasUser.companyName}.
              <br />
              </p>`);
    }

}



    const initialFormData = useMemo(
        () => ({
            emailSubject: `${emailSubjectContent()} for the position of ${docValues.jobTitle} from ${hasUser.companyName}`,
            emailMessage: emailMessageContent,
            automaticReminder: 0,
        }),
        [hasUser, docValues, candidate]
    );

    const [offerEmailData] = useState(emailValues || initialFormData);
    const initialErrors = useInitialErrors(offerEmailData, getValidationSchema());

    return (
        <>
            <Formik
                onSubmit={submitForm}
                enableReinitialize
                initialValues={initialFormData}
                validationSchema={getValidationSchema()}
                initialErrors={initialErrors}
                validate={setEmailValues}
            >
                {(formikProps: FormikProps<OfferFormEmailType>) => {
                    const { handleSubmit, isSubmitting, setFieldTouched, setFieldValue } = formikProps;

                    const btnControls = (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    setEmailValues(null);
                                    goPrev();
                                }}
                                className="btn btn-outline-primary outline-p-hover me-3 release-btns"
                                disabled={isSubmitting}
                            >
                                Previous
                            </button>
                            {(isSubmitting || loading) && (
                                <div className='new-spinner p-fixed'><div><span className="spinner-border spinner-border-sm custom-spinner-border" /></div><p className='fs-14 custom-loading-text'>Loading</p></div>
                            )}
                            <button
                                type="submit"
                                className="btn btn-primary release-btns"
                                disabled={isSubmitting || loading}
                            >
                                Release offer
                            </button>
                        </>
                    );

                    return (
                        <form onSubmit={handleSubmit}>
                            <div className="release-offer-controls">
                                <div className="d-flex align-items-center justify-content-center">
                                    {/* <Link to={routes.offers} className="lt-icon-button me-4">
                                        <i className="bi bi-trash" />
                                        <span className='fs-14'>Discard Offer</span>
                                    </Link> */}
                                    {btnControls}
                                </div>
                            </div>
                            <div className="release-offer-controls-bottom">
                                <div className="d-flex align-items-center justify-content-center">{btnControls}</div>
                            </div>
                            <h1 className="fw-700 fs-18 mb-4">Please provide below details:</h1>
                            <div className="mb-3">
                                <label className="fw-700 mb-2 fs-14">Candidate email</label>
                                <input type="text" value={candidate?.email} className="form-control" disabled />
                            </div>
                            <div className="mb-3">
                                <label className="fw-700 mb-2 fs-14">
                                    Email subject <span className="lt-text-error">*</span>
                                </label>
                                <Field name="emailSubject">
                                    {(fieldProps: FieldProps) => {
                                        const { field, form } = fieldProps;
                                        const error =
                                            getValue(form.touched, field.name) && getValue(form.errors, field.name);
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
                                                />
                                                <small className="text-danger">{error}</small>
                                            </>
                                        );
                                    }}
                                </Field>
                            </div>
                            <div className="mb-3">
                                <label className="fw-700 mb-2 fs-14">
                                    Email message <span className="lt-text-error">*</span>
                                </label>
                                <Field name="emailMessage">
                                    {(fieldProps: FieldProps) => {
                                        const { field, form } = fieldProps;
                                        const error =
                                            getValue(form.touched, field.name) && getValue(form.errors, field.name);
                                        return (
                                            <>
                                                <div className={error ? 'tinymce-danger' : ''}>
                                                    <Editor
                                                        apiKey={tinyApiKey}
                                                        onEditorChange={(value) => {
                                                            setFieldTouched(field.name);
                                                            setFieldValue(field.name, value);
                                                        }}
                                                        initialValue={offerEmailData.emailMessage()}
                                                        init={{
                                                            menubar: false,
                                                            statusbar: false,
                                                            plugins: ['table'],
                                                            height: '350',
                                                            toolbar:
                                                                'undo redo | styleselect | fontselect | forecolor bold italic underline strikethrough subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | table | removeformat',
                                                        }}
                                                    />
                                                </div>
                                                <small className="text-danger">{error}</small>
                                            </>
                                        );
                                    }}
                                </Field>
                            </div>
                            <div className="col-lg-4 col-md-8 col-12">
                                <label className="fw-700 mb-2 fs-14">Automatic reminder</label>
                                <Field name="automaticReminder">
                                    {(fieldProps: FieldProps) => {
                                        const { field } = fieldProps;
                                        return (
                                            <select
                                                value={field.value}
                                                onChange={(ev) => {
                                                    setFieldTouched(field.name);
                                                    setFieldValue(field.name, ev.target.value);
                                                }}
                                                className="form-select"
                                            >
                                                {arrayFromEnum(AutomaticReminderEnum).map((item) => (
                                                    <option key={item} value={item}>
                                                        {getAutomaticReminderText(item)}
                                                    </option>
                                                ))}
                                            </select>
                                        );
                                    }}
                                </Field>
                            </div>
                        </form>
                    );
                }}
            </Formik>
        </>
    );
};

export default ReleaseOfferEmail;

const getValidationSchema = () =>
    objectYup().shape({
        emailSubject: stringYup().required('Email subject is required.'),
        emailMessage: stringYup().required('Email message is required.'),
    });
