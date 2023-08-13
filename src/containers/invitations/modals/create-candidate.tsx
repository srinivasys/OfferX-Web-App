import React, { useCallback, useState } from 'react';
import { Field, FieldProps, Formik, FormikHelpers, FormikProps } from 'formik';
import getValue from 'lodash/get';
import { object as objectYup, string as stringYup } from 'yup';
import { emailRegexp } from '../../../lib/utils/validation';
import useInitialErrors from '../../../hooks/formik-initial-errors';
import { CreateInviteRequestType } from '../../../types/invitations';
import { invitationsService } from '../../../lib/api/invitations';
import { getEmailDomainWithDot, personalAccountDomains } from '../../../lib/constants/constants';
import { toast } from 'react-toastify';
import { Messages } from '../../../lib/utils/messages';

type Props = {
    id?: string;
    getList?: () => void;
};

const initialFormData = {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    emailSubject: '',
    emailMessage: '',
};

const CreateCandidateInvite: React.FC<Props> = ({ id = 'AddInvite', getList }) => {
    const initialErrors = useInitialErrors(initialFormData, getValidationSchema());
    const [success, setSuccess] = useState(false);

    const submitForm = useCallback(
        async (values: CreateInviteRequestType, { resetForm }: FormikHelpers<CreateInviteRequestType>) => {
            let emailDomain = getEmailDomainWithDot(values?.email as string);
            let isPersonalAcount = personalAccountDomains.includes(emailDomain);
            if (!isPersonalAcount){
                toast.error(Messages.CandidateInviteFailed);
                return;
            }

            try {
                await invitationsService.create(values);
                if (getList) {
                    await getList();
                }
                setSuccess(true);
                resetForm({ values: initialFormData });
            } catch (err) {
            }
        },
        [getList]
    );

    return (
        <div
            className="modal fade"
            id={id}
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content lt-modal-content">
                    <Formik
                        onSubmit={submitForm}
                        enableReinitialize
                        initialValues={initialFormData}
                        validationSchema={getValidationSchema()}
                        initialErrors={initialErrors}
                    >
                        {(formikProps: FormikProps<CreateInviteRequestType>) => {
                            const { handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm } =
                                formikProps;

                            return (
                                <>
                                    {isSubmitting && (
                                        <div className='new-spinner p-absolute'><div><span className="spinner-border spinner-border-sm custom-spinner-border" /></div><p className='fs-14 custom-loading-text'>Loading</p></div>
                                    )}
                                    <div className="modal-header lt-modal-header">
                                        <h5 className="modal-title w-100 fs-20 fw-700 mb-4" id="InviteaFriendLabel">
                                            Invite a candidate
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-close
                                            data-bs-dismiss="modal"
                                            title="Close"
                                            aria-label="Close"
                                            onClick={() => {
                                                resetForm();
                                                setTimeout(() => {
                                                    success && setSuccess(false);
                                                }, 500);
                                            }}
                                        />
                                    </div>
                                    <div className="modal-body lt-modal-body">
                                        {success ? (
                                            <Success setSuccess={setSuccess} />
                                        ) : (
                                            <form onSubmit={handleSubmit}>
                                                <div className="mb-3">
                                                    <Field name="firstName">
                                                        {(fieldProps: FieldProps) => {
                                                            const { field, form } = fieldProps;
                                                            const error =
                                                                getValue(form.touched, field.name) &&
                                                                getValue(form.errors, field.name);
                                                            return (
                                                                <>
                                                                    <label className="fw-700 mb-2 fs-14">
                                                                        First name{' '}
                                                                        <span className="lt-text-error">*</span>
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={field.value}
                                                                        maxLength={50}
                                                                        onChange={(ev) => {
                                                                            setFieldTouched(field.name);
                                                                            setFieldValue(field.name, ev.target.value);
                                                                        }}
                                                                        className={`form-control ${error ? 'is-invalid' : ''
                                                                            }`}
                                                                        placeholder="Enter First name"
                                                                    />
                                                                    <small className="text-danger">{error}</small>
                                                                </>
                                                            );
                                                        }}
                                                    </Field>
                                                </div>
                                                <div className="mb-3">
                                                    <Field name="middleName">
                                                        {(fieldProps: FieldProps) => {
                                                            const { field } = fieldProps;
                                                            return (
                                                                <>
                                                                    <label className="fw-700 mb-2 fs-14">
                                                                        Middle name
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={field.value}
                                                                        maxLength={50}
                                                                        onChange={(ev) => {
                                                                            setFieldTouched(field.name);
                                                                            setFieldValue(field.name, ev.target.value);
                                                                        }}
                                                                        className="form-control"
                                                                        placeholder="Enter Middle name"
                                                                    />
                                                                </>
                                                            );
                                                        }}
                                                    </Field>
                                                </div>
                                                <div className="mb-3">
                                                    <Field name="lastName">
                                                        {(fieldProps: FieldProps) => {
                                                            const { field, form } = fieldProps;
                                                            const error =
                                                                getValue(form.touched, field.name) &&
                                                                getValue(form.errors, field.name);
                                                            return (
                                                                <>
                                                                    <label className="fw-700 mb-2 fs-14">
                                                                        Last name{' '}
                                                                        <span className="lt-text-error">*</span>
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={field.value}
                                                                        maxLength={50}
                                                                        onChange={(ev) => {
                                                                            setFieldTouched(field.name);
                                                                            setFieldValue(field.name, ev.target.value);
                                                                        }}
                                                                        className={`form-control ${error ? 'is-invalid' : ''
                                                                            }`}
                                                                        placeholder="Enter Last name"
                                                                    />
                                                                    <small className="text-danger">{error}</small>
                                                                </>
                                                            );
                                                        }}
                                                    </Field>
                                                </div>
                                                <div className="mb-3">
                                                    <Field name="email">
                                                        {(fieldProps: FieldProps) => {
                                                            const { field, form } = fieldProps;
                                                            const error =
                                                                getValue(form.touched, field.name) &&
                                                                getValue(form.errors, field.name);
                                                            return (
                                                                <>
                                                                    <label className="fw-700 mb-2 fs-14">
                                                                        Email <span className="lt-text-error">*</span>
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={field.value}
                                                                        maxLength={320}
                                                                        onChange={(ev) => {
                                                                            setFieldTouched(field.name);
                                                                            setFieldValue(field.name, ev.target.value);
                                                                        }}
                                                                        className={`form-control ${error ? 'is-invalid' : ''
                                                                            }`}
                                                                        placeholder="Enter Email"
                                                                    />
                                                                    <small className="text-danger">{error}</small>
                                                                </>
                                                            );
                                                        }}
                                                    </Field>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary w-100 mt-3"
                                                    disabled={isSubmitting}
                                                >
                                                    Invite
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

const Success: React.FC<{ setSuccess: (success: boolean) => void }> = ({ setSuccess }) => {
    return (
        <div className="text-center">
            <i className="bi bi-check-circle lt-text-success-alt fs-68" />
            <h1 className="fw-700 fs-20">Success</h1>
            <p className="mb-3">Invitation sent successfully.</p>
            <button
                type="button"
                onClick={() => {
                    setTimeout(() => {
                        setSuccess(false);
                    }, 500);
                }}
                className="btn btn-primary w-50"
                data-bs-dismiss="modal"
                title="Close"
            >
                OK
            </button>
        </div>
    );
};

export default CreateCandidateInvite;

const getValidationSchema = () =>
    objectYup().shape({
        firstName: stringYup()
            .required('First name is required and must be at least 3 characters.')
            .min(3, 'First name must be at least 3 characters.'),
        lastName: stringYup()
            .required('Last name is required and must be at least 3 characters.')
            .min(3, 'Last name must be at least 3 characters.'),
        email: stringYup().required('Email is required.').matches(emailRegexp, {
            message: 'Invalid email format.',
        }),
    });
