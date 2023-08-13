import React, { useEffect, useState } from 'react';
import PageLoader from '../../components/loader';
import DocumentSuccess from './success';
import { Link, useHistory } from 'react-router-dom';
import { routes } from '../routes/routes-names';
import { UserRoleEnum, UserType } from '../../types/auth';
import { generateLink } from '../../lib/utils/generate-link';
import { OfferCreationEnum, OfferDataType, OfferStateEnum } from '../../types/offer';
import { digioSign } from '../../lib/utils/digio-sign';
import { getFileExtension } from '../../lib/utils/file-extension';
import PdfViewer from '../../components/pdf-viewer';
import DocxViewer from '../../components/docx-viewer';
import RejectOffer from './modals/reject';
import Error404 from '../../components/errors/404';
import { useScript } from '../../hooks/script';
import { digioAckEmail, digioUrl } from '../../config/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { offerService } from '../../lib/api/offer';
import { ReactComponent as IconRepeat } from '../../assets/icons/arrow-repeat.svg';
import { closeModal } from '../../lib/utils/close-modal';
import ShowMoreText from 'react-show-more-text';
import { Button } from 'react-bootstrap';
import history from '../../../src/history';
import { GridConstants } from '../../lib/constants/constants';

type Props = {
    id: string;
    modal?: boolean;
    offerLetter?: boolean;
};

const DocumentContent: React.FC<Props> = ({ id, modal, offerLetter }) => {
    const digioReady = useScript(digioUrl);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [loadingAccept, setLoadingAccept] = useState(false);
    const [data, setData] = useState<OfferDataType | null>(null);
    const { user } = useSelector((state: RootState) => state.user);
    const hasUser = user as UserType;

    async function accept() {
        try {
            await offerService.accept(id);
            setSuccess(true);
        } catch (err: any) {
            setLoadingAccept(false);
        }
    }

    window.onpopstate = (event) => {
        sessionStorage.setItem(GridConstants.AreFiltersApplicable, GridConstants.True);
    };

    useEffect(() => {
        (async function () {
            try {
                const { resultObject } = await offerService.get(id);
                setData(resultObject);
            } catch (err: any) {
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);
    return loading ? (
        <PageLoader />
    ) : success ? (
        <DocumentSuccess />
    ) : data ? (
        <div className="accept-offer">
            {!modal && (
                <div className="row mb-3 mt-4">
                    <nav aria-label="breadcrumb">
                        <span className="mt-3 text-secondary">
                            <span onClick={() => history.goBack()} className="cursor-pointer">
                                <i className="bi bi-chevron-left lt-text-secondary-alt me-0"></i> Back
                            </span>
                        </span>
                    </nav>
                </div>
            )}
            <div className={`d-flex align-items-center ${modal && 'mt-3'}`}>
                <div className="col-sm col-12 col-lg">
                    <div className="d-md-flex align-items-center">
                        <div className="d-flex fs-20 fw-600  lt-text-secondary-alt text-ellipsis">
                            <div className="d-flex">
                                <div className="w-100">
                                    <span>
                                        Offer letter to{' '}
                                        <span className="text-capitalize">
                                            {data.candidateFirstName} {data.candidateLastName}
                                        </span>{' '}
                                        from <span className="text-capitalize">{data.companyName}</span>
                                    </span>
                                </div>
                            </div>
                            <div>
                                {data.offerCreationType === OfferCreationEnum.reOffer && (
                                    <div className="lt-status lt-status-primary lt-status-pill fw-400 fs-12 py-0 px-2 ms-2">
                                        {/* <IconRepeat /> */}
                                        Revised offer
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {hasUser.role === UserRoleEnum.candidate && ((data.offerState === OfferStateEnum.accepted) || (data.offerState === OfferStateEnum.onboarded) ||(data.offerState === OfferStateEnum.ghosted)) && (
 <a
 className="me-3 btn btn-outline-primary outline-p-hover"
 href={data.offerDocumentUrl}
 download={`${data.offerDocumentUrl}`}
 
 title="Download offer letter"
>
 <i className="bi bi-download" />
</a>
                )}
                {hasUser.role === UserRoleEnum.candidate && data.offerState === OfferStateEnum.pending && (
                    <div className="col-sm-5 col-lg-3 col-12">
                        <div className="d-flex justify-content-sm-end mt-4 mt-sm-0 lt-offer-buttons">
                          {!modal && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!digioReady || !data) return;
                                        setLoadingAccept(true);
                                        digioSign(
                                            data.id,
                                            data.externalForSignatureDocId,
                                            digioAckEmail,
                                            accept,
                                            setLoadingAccept.bind(null, false)
                                        );
                                    }}
                                    className="btn btn-success"
                                    disabled={loadingAccept}
                                >
                                    {loadingAccept && <span className="spinner-border spinner-border-sm" />} Accept
                                    offer
                                </button>
                            )}
                            <button
                                type="button"
                                className="btn btn-outline-danger outline-d-hover ms-3"
                                data-bs-toggle="modal"
                                data-bs-target="#RejectOffer"
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {data.offerRejectionReasons.length != 0 && (
                <div style={{ color: '#D83B01' }} className="mt-3">
                    <b className="pb-1">
                        {data.candidateFirstName} {data.candidateLastName} has declined the offer for the following
                        reason{data.offerRejectionReasons.length > 1 && 's'}:
                    </b>
                    <ol className="pt-2 ps-4 reasons-ht card">
                        {data.offerRejectionReasons
                            .sort((a, b) => (a.order > b.order ? 1 : -1))
                            .map((reason, index) => (
                                <li key={index}>
                                    {' '}
                                    {reason.reason} {reason.reasonText ? ': ' + reason.reasonText : reason.reasonText}
                                </li>
                            ))}
                    </ol>
                </div>
            )}

            {data.offerRetractReasons.length != 0 && (
                <div style={{ color: '#D83B01' }} className="mt-3">
                    <b className="pb-1">
                        {data.companyName} has retracted the offer for the following reason
                        {data.offerRetractReasons.length > 1 && 's'}:
                    </b>
                    <ol className="pt-2 ps-4 reasons-ht card">
                        {data.offerRetractReasons
                            .sort((a, b) => (a.order > b.order ? 1 : -1))
                            .map((reason, index) => (
                                <li key={index}>
                                    {' '}
                                    {reason.reason} {reason.reasonText ? ': ' + reason.reasonText : reason.reasonText}
                                </li>
                            ))}
                    </ol>
                </div>
            )}

            <div className="row">
                <div className="card p-3 mb-4">
                    <div className="alert alert-warning p-2">
                        <ShowMoreText lines={1} more="Read more" less="Read less">
                            <div className="showMoreText">
                                This Non-Disclosure Agreement is entered into by and between {data.companyName} and{' '}
                                {data.candidateFirstName} {data.candidateLastName} for the purpose of preventing the
                                unauthorized disclosure of Confidential Information as defined below. The parties agree
                                to enter into a confidential relationship with respect to the disclosure of certain
                                proprietary and confidential information.{' '}
                                offerRejectionReasons {data.offerRejectionReasons.length}
                                offerRetractReasons {data.offerRetractReasons.length}
                            </div>
                        </ShowMoreText>
                    </div>
                    <div className={(data.offerState === OfferStateEnum.rejected || data.offerState === OfferStateEnum.retracted)  ? 'doc-full-size-retract' : 'doc-full-size'}>
                        {getFileExtension(data.offerDocumentUrl) === 'pdf' && (
                            <PdfViewer url={data.offerDocumentUrl} scale={!modal ? 2 : 1.5} />
                        )}
                        {getFileExtension(data.offerDocumentUrl) === 'docx' && (
                            <DocxViewer url={data.offerDocumentUrl} />
                        )}
                    </div>
                </div>
            </div>

            {hasUser.role === UserRoleEnum.candidate && data.offerState === OfferStateEnum.pending && (
                <RejectOffer id={data.id} />
            )}
        </div>
    ) : (
        <Error404 />
    );
};

export default DocumentContent;
