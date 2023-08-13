import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { object as objectYup, string as stringYup, array as arrayYup } from 'yup';
import { ManagerPermissionEnum } from '../../../types/auth';
import useInitialErrors from '../../../hooks/formik-initial-errors';
import { emailRegexp } from '../../../lib/utils/validation';
import { EmployeeFormType, EmployeeType } from '../../../types/employee';
import getValue from 'lodash/get';
import { getPermissionText } from '../../../lib/utils/dictionary';
import { employeeService } from '../../../lib/api/employee';
import { arrayFromEnum } from '../../../lib/utils/emun';
import ShowPopUp from '../../../components/custom-popup-alert';
import { companyService } from '../../../lib/api/company';
import { getEmailDomainWithDot, personalAccountDomains } from '../../../lib/constants/constants';
import { toast } from 'react-toastify';
import { Messages } from '../../../lib/utils/messages';

type Props = {
    activeEmployee?: EmployeeType | null;
    onInviteUserComplete?: Function;
    getList?: () => Promise<void> | null;
    id: string;
};

const CreateUserInvitation: React.FC<Props> = ({ activeEmployee, id, onInviteUserComplete, getList }) => {
    const [success, setSuccess] = useState(false);

    const editMode = useMemo(() => !!activeEmployee, [activeEmployee]);

    function handleCloseModal() {
        setTimeout(() => {
            success && setSuccess(false);
            activeEmployee = null;
            if (onInviteUserComplete) {
                onInviteUserComplete();
            }
        }, 500);
    }

    const initialFormData = useMemo(
        () => ({
            firstName: activeEmployee?.firstName || '',
            middleName: activeEmployee?.middleName || '',
            lastName: activeEmployee?.lastName || '',
            email: activeEmployee?.email || '',
            permissionTypeList: activeEmployee?.permissionTypeList || [],
        }),
        [activeEmployee]
    );

    const initialErrors = useInitialErrors(initialFormData, getValidationSchema());

    const getProfile = useCallback(async () => {
        try {
            const company = await companyService.getProfile();
            sessionStorage.setItem('Website', company.resultObject.webSite);
        } catch (err: any) {
        }
    }, []);

    const submitForm = useCallback(
        async (values: EmployeeFormType) => {
            let emailDomain = getEmailDomainWithDot(values?.email as string);
            let isPersonalAcount = personalAccountDomains.includes(emailDomain);
            if (isPersonalAcount) {
                toast.error(Messages.EmployeeInviteFailed);
                return;
            }

            try {
                if (activeEmployee) {
                    await employeeService.update({ ...values, id: activeEmployee.id });
                } else {
                    await employeeService.create(values);
                }
                if (getList) {
                    await getList();
                }
                setSuccess(true);
            } catch (err) {
            }
        },
        [activeEmployee]
    );

    useEffect(() => {
        getProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <Formik
                onSubmit={submitForm}
                enableReinitialize
                initialValues={initialFormData}
                validationSchema={getValidationSchema()}
                initialErrors={initialErrors}
            >
                {(formikProps: FormikProps<EmployeeFormType>) => {
                    const { handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm } = formikProps;

                    return (
                        <form onSubmit={handleSubmit}>
                            <div
                                className="modal fade"
                                id={id == 'AddNewEmployee' ? 'AddNewEmployee' : 'AddEmployee'}
                                data-bs-backdrop="static"
                                data-bs-keyboard="false"
                                tabIndex={-1}
                                aria-labelledby="AddEmployeeLabel"
                                aria-hidden="true"
                            >
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content lt-modal-content">
                                        {success ? (
                                            <ShowPopUp
                                                handleCloseModal={() => {
                                                    handleCloseModal();
                                                    resetForm();
                                                }}
                                                headerText={editMode ? 'Edit an Employee' : 'Invite an User'}
                                                text={
                                                    editMode
                                                        ? 'Employee details updated successfully'
                                                        : 'User invited successfully'
                                                }
                                            />
                                        ) : (
                                            <>
                                                {isSubmitting && (
                                                    <div className='new-spinner p-absolute'><div><span className="spinner-border spinner-border-sm custom-spinner-border" /></div><p className='fs-14 custom-loading-text'>Loading</p></div>
                                                )}
                                                <div className="modal-header lt-modal-header">
                                                    <h5
                                                        className="modal-title w-100 fs-20 fw-700 mb-4"
                                                        id="InviteaFriendLabel"
                                                    >
                                                        {editMode ? 'Edit an Employee' : 'Invite an Employee'}
                                                    </h5>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        data-bs-dismiss="modal"
                                                        title="Close"
                                                        aria-label="Close"
                                                        onClick={() => resetForm()}
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
                                                                            maxLength={50}
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
                                                                            maxLength={50}
                                                                            value={field.value}
                                                                            onChange={(ev) => {
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(
                                                                                    field.name,
                                                                                    ev.target.value
                                                                                );
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
                                                                                setFieldValue(
                                                                                    field.name,
                                                                                    ev.target.value
                                                                                );
                                                                            }}
                                                                            className={`form-control ${
                                                                                error ? 'is-invalid' : ''
                                                                            }`}
                                                                            placeholder="Enter last name"
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
                                                                            Email{' '}
                                                                            <span className="lt-text-error">*</span>
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={field.value}
                                                                            maxLength={320}
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
                                                                            placeholder="Enter Email"
                                                                            disabled={editMode}
                                                                        />
                                                            <small className="text-danger">{error}</small>
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>

                                                    
                                                    <div className="mb-3">
                                                        <label className="fw-700 mb-2 fs-14">
                                                            Roles <span className="lt-text-error">*</span>
                                                        </label>
                                                        <Field name="permissionTypeList">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                    
                                                                return (
                                                                    <>
                                                                    <div className="d-flex">
                                                                        
                                                                        {arrayFromEnum(ManagerPermissionEnum)
                                                                            .filter(
                                                                                (valueEnum) =>
                                                                                    valueEnum !==
                                                                                    ManagerPermissionEnum.owner
                                                                                    
                                                                            )
                                                                            
                                                                            .map((valueEnum) => (
                                                                                <div key={valueEnum} className="me-4">
                                                                                    <input
                                                                                        type="radio"
                                                                                        checked={field.value.includes(
                                                                                            valueEnum
                                                                                        )}
                                                                                        onChange={() => {
                                                                                            setFieldTouched(field.name);
                                                                                            const hasValue =
                                                                                                field.value.includes(
                                                                                                    valueEnum
                                                                                                );
                                                                                            const newValue = hasValue
                                                                                                ? []
                                                                                                : [valueEnum];
                                                                                            setFieldValue(
                                                                                                field.name,
                                                                                                newValue
                                                                                            );
                                                                                        }}
                                                                                        id={getPermissionText(
                                                                                            valueEnum
                                                                                        )}
                                                                                        className="me-2"
                                                                                    />
                                                                                    
                                                                                    <label
                                                                                        htmlFor={getPermissionText(
                                                                                            valueEnum
                                                                                        )}
                                                                                        // className={
                                                                                        //     error ? 'text-danger' : ''
                                                                                        // }
                                                                                    >
                                                                                        {getPermissionText(valueEnum)}
                                                                                    </label>

                                                                               {  getPermissionText(valueEnum)==="Admin"  ? <i className="bi bi-info-circle lt-tooltip ms-2">
                                                                            <span className="lt-tooltiptext lt-shadow-md fw-400 fs-14 bottom-tip">
                                                                            Admin Role: Manages all actions in OfferX.
                                                                            </span>
                                                                        </i> : <i className="bi bi-info-circle lt-tooltip ms-2">
                                                                            <span className="lt-tooltiptext lt-shadow-md fw-400 fs-14 bottom-tip">
                                                                            Offer Manager Role: Manages all actions in the OfferX, <br/>except for manage employees and editing the company profile.
                                                                            </span>
                                                                        </i>}


                                                                                </div>
                                                                            ))}
                                                                    </div>
                                                                    <div><small className="text-danger">{error}</small></div>
                                                                    </>
                                                                    
                                                                );
                                                                
                                                            }}
                                                        </Field>
                                                    </div>
                                                    {editMode && (
                                                        <div className="alert alert-warning p-2 mb-0 fs-12">
                                                            Note: Any modification in assigned role(s) will be reflected
                                                            only after employee re-login
                                                        </div>
                                                    )}
                                                    <div className="row">
                                                        <div className="col-12 col-sm">
                                                            <button
                                                                type="button"
                                                                data-bs-dismiss="modal"
                                                                onClick={() => resetForm()}
                                                                className="btn btn-outline-primary outline-p-hover w-100 mt-3"
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
                                                                {editMode ? 'Update' : 'Invite'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>{' '}
                        </form>
                    );
                }}
            </Formik>

            {/* {isReviewConfirmationModal && <ShowPopUp headerText={editMode ? 'Edit an Employee' : 'Add User'} text={editMode ? 'Employee details updated successfully' : 'User added successfully'} />} */}
        </div>
    );
};

export default CreateUserInvitation;

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
        permissionTypeList: arrayYup().min(1, 'Please select a role.')
    });
