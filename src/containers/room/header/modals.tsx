import React, { useCallback, useMemo, useState } from 'react';
import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { object as objectYup, string as stringYup } from 'yup';
import { ManagerPermissionEnum, UserRoleEnum, UserType } from '../../../types/auth';
import { getPermissionText } from '../../../lib/utils/dictionary';
import useInitialErrors from '../../../hooks/formik-initial-errors';
import getValue from 'lodash/get';
import { managerService } from '../../../lib/api/manager';
import { getUser } from '../../../redux/user';
import { useDispatch } from 'react-redux';
import { arrayFromEnum } from '../../../lib/utils/emun';
import CreateInvite from '../../invitations/modals/create-candidate';
import { closeModal } from '../../../lib/utils/close-modal';
import ShowPopUp from '../../../components/custom-popup-alert';

type Props = {
    user: UserType;
};

type ManagerFormType = {
    firstName: string;
    middleName: string;
    lastName: string;
};

const HeaderModals: React.FC<Props> = ({ user }) => {
    return (
        <>
            <div
                className="modal fade"
                id="MyProfileDetails"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex={-1}
                aria-labelledby="MyProfileDetailsLabel"
                aria-hidden="true"
                style={{ zIndex: 1100 }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content lt-modal-content">
                        <div className="modal-header lt-modal-header">
                            <h5 className="modal-title w-100 fs-20 fw-700 mb-4" id="MyProfileDetailsLabel">
                                My profile
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                title="Close"
                                style={{ top: '-30px', right: '-13px' }}
                            />
                        </div>
                        <div className="modal-body lt-modal-body">
                            <div className="row">
                                <div className="col-12 col-sm fw-700">
                                    <div className="mb-3">First name</div>
                                </div>
                                <div className="col-12 col-sm text-sm-end">
                                    <div className="mb-3 text-capitalize">{user.firstName}</div>
                                </div>
                            </div>

                            {user.middleName && (
                                <div className="row">
                                    <div className="col-12 col-sm-6 fw-700">
                                        <div className="mb-3">Middle name</div>
                                    </div>
                                    <div className="col-12 col-sm-6 text-sm-end">
                                        <div className="mb-3 text-capitalize">{user.middleName}</div>
                                    </div>
                                </div>
                            )}
                            <div className="row">
                                <div className="col-12 col-sm fw-700">
                                    <div className="mb-3">Last name</div>
                                </div>
                                <div className="col-12 col-sm text-sm-end">
                                    <div className="mb-3 text-capitalize">{user.lastName}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 col-sm fw-700">
                                    <div className="mb-3">
                                        {user.role === UserRoleEnum.manager ? 'Role' : 'Job title'}
                                    </div>
                                </div>
                                <div className="col-12 col-sm text-sm-end">
                                    <div className="mb-3">
                                        {user.role === UserRoleEnum.manager
                                            ? user.permissionTypes && getPermissionText(user.permissionTypes[0])
                                            : user.jobTitle}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 col-sm fw-700">
                                    <div className="mb-3">Login email</div>
                                </div>
                                <div className="col-12 col-sm text-sm-end">
                                    <div className="mb-3">{user.email}</div>
                                </div>
                            </div>
                            {user.role === UserRoleEnum.manager && (
                                <button
                                    type="button"
                                    className="btn btn-outline-primary w-100 mt-3"
                                    data-bs-toggle="modal"
                                    data-bs-target="#EditProfileDetails"
                                >
                                    <i className="bi bi-pencil" /> Edit profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ManagerForm user={user} />

            <CreateInvite />
        </>
    );
};

const ManagerForm: React.FC<Props> = ({ user }) => {
    const dispatch = useDispatch();
    const [success, setSuccess] = useState(false);

    function handleCloseModal() {
        setTimeout(() => {
            success && setSuccess(false);
        }, 500);
    }

    const initialFormData = useMemo(
        () => ({
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
        }),
        [user]
    );
    const initialErrors = useInitialErrors(initialFormData, getValidationSchema());

    const submitForm = useCallback(
        async (values: ManagerFormType) => {
            try {
                await managerService.update(values);
                await dispatch(getUser());
                setSuccess(true);
            } catch (err) {}
        },
        [dispatch]
    );

    return (
        <div>
            <Formik
                onSubmit={submitForm}
                enableReinitialize
                initialValues={initialFormData}
                validationSchema={getValidationSchema()}
                initialErrors={initialErrors}
            >
                {(formikProps: FormikProps<ManagerFormType>) => {
                    const { handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm } = formikProps;

                    return (
                        <form onSubmit={handleSubmit}>
                            <div
                                className="modal fade"
                                id="EditProfileDetails"
                                data-bs-backdrop="static"
                                data-bs-keyboard="false"
                                tabIndex={-1}
                                aria-labelledby="EditProfileDetailsLabel"
                                aria-hidden="true"
                            >
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content lt-modal-content">
                                        {success ? (
                                            <ShowPopUp
                                                handleCloseModal={handleCloseModal}
                                                headerText="My profile"
                                                text="Profile updated successfully"
                                            />
                                        ) : (
                                            <>
                                                {isSubmitting && (
                                                    <div className='new-spinner p-absolute'><div><span className="spinner-border spinner-border-sm custom-spinner-border" /></div><p className='fs-14 custom-loading-text'>Loading</p></div>
                                                )}
                                                <div className="modal-header lt-modal-header">
                                                    <h5
                                                        className="modal-title w-100 fs-20 fw-700 mb-4"
                                                        id="EditProfileDetailsLabel"
                                                    >
                                                        Edit profile
                                                    </h5>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        data-bs-dismiss="modal"
                                                        title="Close"
                                                        aria-label="Close"
                                                        onClick={() => resetForm()}
                                                        style={{ top: '-30px', right: '-13px' }}
                                                    />
                                                </div>
                                                <div className="modal-body lt-modal-body">
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
                                                                            placeholder="Enter your first name"
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
                                                                            onChange={(ev) => {
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(
                                                                                    field.name,
                                                                                    ev.target.value
                                                                                );
                                                                            }}
                                                                            className="form-control"
                                                                            placeholder="Enter your middle name"
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
                                                                            placeholder="Enter your last name"
                                                                        />
                                                                        <small className="text-danger">{error}</small>
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
                                                    {user.permissionTypes && (
                                                        <div className="mb-3">
                                                            <label className="fw-700 mb-2 fs-14">
                                                                Role <span className="lt-text-error">*</span>
                                                            </label>
                                                            <select
                                                                value={user.permissionTypes[0]}
                                                                className="form-select"
                                                                disabled
                                                            >
                                                                <option value="">Select</option>
                                                                {arrayFromEnum(ManagerPermissionEnum).map((item) => (
                                                                    <option key={item} value={item}>
                                                                        {getPermissionText(item)}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                    <div className="mb-3">
                                                        <label className="fw-700 mb-2 fs-14">
                                                            Login email <span className="lt-text-error">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder=""
                                                            value={user.email}
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-12 col-sm">
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-primary outline-p-hover w-100 mt-3"
                                                                disabled={isSubmitting}
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#MyProfileDetails"
                                                                onClick={() => resetForm()}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                        <div className="col-12 col-sm">
                                                            
                                                            <button
                                                                type="submit"
                                                                className="btn btn-primary w-100 mt-3"
                                                                disabled={isSubmitting}
                                                            >
                                                                Update
                                                            </button>
                                                        </div>
                                                    </div>
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

            {/* {isReviewConfirmationModal && <ShowPopUp headerText='My Profile' text='Profile updated successfully' />} */}
        </div>
    );
};

export default HeaderModals;

const getValidationSchema = () =>
    objectYup().shape({
        firstName: stringYup()
            .required('First name is required and must be at least 3 characters.')
            .min(3, 'First name must be at least 3 characters.'),
        lastName: stringYup()
            .required('Last name is required and must be at least 3 characters.')
            .min(3, 'Last name must be at least 3 characters.'),
    });
