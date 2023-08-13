import React, { useCallback, useMemo, useContext } from 'react';
import { Field, FieldProps, Formik, FormikProps } from 'formik';
import useInitialErrors from '../../../hooks/formik-initial-errors';
import { object as objectYup, string as stringYup } from 'yup';
import { ReplyType } from '../../../types/reply';
import { replyService } from '../../../lib/api/reply';
import { toast } from 'react-toastify';
import { reviewService } from '../../../lib/api/review';
import getValue from 'lodash/get';
import ReplyTypeList from '../component/reply-type';
import Context from '../../../context/update';

type Props = {
    id?: string;
    candidatePage?: boolean;
    hasCandidate?: boolean;
    avatar: string | null;
    ReviewCreatorId?: string | null;
    commentlength?: number;
    candidateName?: string;
    isMyProfile?: boolean;
    replys?: reply[];
};

type reply = {
    id?: string;
    companyReviewId?: string | null;
    candidateFirstName?: string;
    candidateId?: string | null;
    candidateLastName?: Date;
    replyText?: string;
    companyName?: string | null;
    date?: Date;
    offerId?: string | null;
};

const WriteReplyTypeList: React.FC<Props> = ({
    id,
    candidatePage,
    avatar,
    hasCandidate,
    ReviewCreatorId,
    commentlength,
    isMyProfile,
    candidateName,
    replys,
}) => {
    const { updateOffersList, updateProfile } = useContext(Context);

    const initialValues = useMemo(
        () => ({
            replyText: '',
        }),
        [id, ReviewCreatorId]
    );

    const submitForm = useCallback(
        async (values: ReplyType) => {
            let profanityresponse = await reviewService.checkProfanityFilter(values.replyText);

            if (profanityresponse.status === false) {
                try {
                    if (hasCandidate) {
                        await replyService.createCandidateReply({
                            ...values,
                            ReviewId: id,
                            candidateId: null,
                            companyId: ReviewCreatorId,
                        });
                    } else {
                        await replyService.createCompanyReply({
                            ...values,
                            ReviewId: id,
                            candidateId: ReviewCreatorId,
                            companyId: null,
                        });
                    }
                    toast.success('Your reply has been succesfully submitted');
                    updateOffersList && updateOffersList();
                    updateProfile && updateProfile();
                } catch (err: any) {
                } finally {
                }
            } else {
                toast.error('Use of foul/offensive words not allowed. Please rephrase your statement.');
            }
        },
        [id, ReviewCreatorId, commentlength]
    );

    const initialErrors = useInitialErrors(initialValues, getValidationSchema());

    return (
        <>
            <div>
                {commentlength ? (
                    <ReplyTypeList
                        replys={replys}
                        avatar={avatar}
                        hasCandidate={hasCandidate}
                        candidateName={candidateName}
                        isMyProfile={isMyProfile}
                    />
                ) : isMyProfile ? (
                    <>
                        <div
                            className="mt-3 lt-text-secondary cursor-pointer"
                            data-bs-toggle="collapse"
                            data-bs-target={'#replyDiv' + id}
                            aria-expanded="false"
                            aria-controls="replyDiv"
                        >
                            <i className="bi bi-reply"></i> <span className="fs-14 fw-600">Reply</span>
                        </div>
                        <div className="collapse reply-div" id={'replyDiv' + id}>
                            <Formik
                                onSubmit={submitForm}
                                enableReinitialize
                                initialValues={initialValues}
                                isInitialValid
                                initialErrors={initialErrors}
                                validationSchema={getValidationSchema()}
                            >
                                {(formikProps: FormikProps<ReplyType>) => {
                                    const { handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm } =
                                        formikProps;

                                    return (
                                        <form onSubmit={handleSubmit}>
                                            <div className='d-flex align-items-center'>
                                                <div className='custom-m-top'>
                                                    <i className='bi bi-arrow-return-right lt-text-secondary fs-28'></i>
                                                </div>
                                                <div className="d-flex my-3 ms-3 align-items-center w-100">
                                                    <div className="p-0 w-100">
                                                        <Field name="replyText">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field, form } = fieldProps;
                                                                const error =
                                                                    getValue(form.touched, field.name) &&
                                                                    getValue(form.errors, field.name);
                                                                return (
                                                                    <>
                                                                        <div className="position-relative">
                                                                            <textarea
                                                                                className="ox-review-boble shadow-sm w-100 form-control py-2"
                                                                                rows={2}
                                                                                maxLength={250}
                                                                                value={field.value}
                                                                                onChange={(ev) => {
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(field.name, ev.target.value);
                                                                                }}
                                                                                placeholder="Write a reply"
                                                                            />
                                                                        </div>
                                                                        <div className="d-flex justify-content-between">
                                                                            <small className="text-danger mt-2">{error}</small>
                                                                            <span className="mt-2 fs-14">
                                                                                {field.value.length}/250
                                                                            </span>
                                                                        </div>
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-end">
                                                <button
                                                    className="btn btn-outline-primary outline-p-hover me-3"
                                                    data-bs-toggle="collapse"
                                                    type='reset'
                                                    data-bs-target={'#replyDiv' + id}
                                                    aria-expanded="false"
                                                    aria-controls="replyDiv"
                                                    onClick={() => {resetForm()}}
                                                >
                                                    Cancel
                                                </button>
                                                {isSubmitting && <div className='new-spinner p-fixed'><div><span className="spinner-border spinner-border-sm custom-spinner-border" /></div><p className='fs-14 custom-loading-text'>Loading</p></div>}
                                                <button
                                                    className="btn btn-primary"
                                                    data-bs-toggle="collapse"
                                                    //data-bs-target="#postedDiv"
                                                    aria-expanded="false"
                                                    aria-controls="postedDiv"
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                >
                                                    Reply
                                                </button>
                                            </div>
                                        </form>
                                    );
                                }}
                            </Formik>
                        </div>
                    </>
                ) : (
                    ''
                )}
            </div>
            <hr />
        </>
    );
};

export default WriteReplyTypeList;

const getValidationSchema = () =>
    objectYup().shape({
        replyText: stringYup().required('Required field.').min(3, 'Description should be atleast 3 characters.'),
    });
