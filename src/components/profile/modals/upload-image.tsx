import React, { SyntheticEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
//@ts-ignore
import Files from 'react-files';
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { ReactFilesError, ReactFilesFile } from '../../../types/files';
import { ReactComponent as IconTrash } from '../../../assets/icons/trash.svg';
import { candidateService } from '../../../lib/api/candidate';
import { closeModal } from '../../../lib/utils/close-modal';
import { companyService } from '../../../lib/api/company';
import Context from '../../../context/update';
import DeleteImage from './delete-image';
import getCroppedImg from '../../../lib/utils/get-cropped-img';

type Props = {
    candidatePage: boolean;
    hasBanner: boolean;
    hasAvatar: boolean;
    imageModalType: 'banner' | 'avatar';
    setCroppedImage: (url: string | null) => void;
};

const UploadImage: React.FC<Props> = ({ candidatePage, hasBanner, hasAvatar, imageModalType, setCroppedImage }) => {
    const { updateProfile } = useContext(Context);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [image, setImage] = useState<ReactFilesFile | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const aspect = useMemo(() => (imageModalType === 'banner' ? 110 / 17 : 1), [imageModalType]);

    const upload = useCallback(async () => {
        if (!croppedBlob || !image) return;
        try {
            setLoading(true);
            let formData = new FormData();
            formData.append(
                imageModalType === 'banner' ? 'bannerFile' : 'avatarFile',
                new File([croppedBlob], image.name)
            );
            candidatePage && imageModalType === 'banner' && (await candidateService.updateBanner(formData));
            candidatePage && imageModalType === 'avatar' && (await candidateService.updateAvatar(formData));
            !candidatePage && imageModalType === 'banner' && (await companyService.updateBanner(formData));
            !candidatePage && imageModalType === 'avatar' && (await companyService.updateAvatar(formData));
            updateProfile && updateProfile();
            closeModal('BannerPic');
        } catch (err: any) {
        } finally {
            setLoading(false);
        }
    }, [image, updateProfile, candidatePage, imageModalType, croppedBlob]);

    useEffect(() => {
        (async function () {
            if (!imgRef.current || !image?.preview.url || !completedCrop) return;
            const blob = await getCroppedImg(
                image.preview.url,
                imgRef.current.clientWidth,
                imgRef.current.clientHeight,
                completedCrop
            );
            if (blob) {
                setCroppedBlob(blob);
                setCroppedImage(URL.createObjectURL(blob));
            }
        })();
    }, [imgRef, image, completedCrop, setCroppedImage]);

    function onImageLoad(ev: SyntheticEvent<HTMLImageElement>) {
        const { width, height } = ev.currentTarget;
        const crop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 100,
                },
                aspect,
                width,
                height
            ),
            width,
            height
        );
        setCrop(crop);
    }

    function clearCrop() {
        setError('');
        setImage(null);
        setCroppedImage(null);
        setCrop(undefined);
    }

    return (
        <>
            <div
                className="modal fade"
                id="BannerPic"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex={1}
                aria-labelledby="BannerPicLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content lt-modal-content">
                        <div className="modal-header lt-modal-header">
                            <h5 className="modal-title w-100 text-center fw-700 mb-3" id="BannerPicLabel">
                                {imageModalType === 'banner' ? 'Upload banner image' : 'Upload profile pic'}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                title="Close"
                                aria-label="Close"
                                onClick={clearCrop}
                                style={{ top: '-26px', right: '-13px' }}
                            />
                        </div>
                        <div key={image?.name} className="modal-body lt-modal-body">
                            {image ? (
                                <>
                                    <div className="text-center">
                                        <ReactCrop
                                            crop={crop}
                                            onChange={setCrop}
                                            onComplete={setCompletedCrop}
                                            aspect={aspect}
                                        >
                                            <img ref={imgRef} src={image.preview.url} onLoad={onImageLoad} alt="" />
                                        </ReactCrop>
                                    </div>
                                    <p className="d-flex align-items-center mt-1">
                                        <strong>Uploaded:</strong>
                                        <span className="ms-1 word-break">{image.name}</span>
                                        <button type="button" onClick={clearCrop} className="ms-2 lh-1" title="Delete">
                                            <IconTrash />
                                        </button>
                                    </p>
                                </>
                            ) : (
                                <Files
                                    className="files-dropzone"
                                    onChange={(files: ReactFilesFile[]) => {
                                        if (files[0]) {
                                            setImage(files[0]);
                                            if (error) {
                                                setError('');
                                            }
                                        }
                                    }}
                                    multiple={false}
                                    maxFiles={1}
                                    onError={(error: ReactFilesError) => {
                                        setTimeout(() => setError(error.message), 100);
                                    }}
                                    accepts={['.png', '.jpg', '.jpeg']}
                                    clickable
                                >
                                    {' '}
                                    <p className="fs-14">
                                        Allowed file format: .png, .jpg and .jpeg{' '}
                                        <span className="fw-400">(Upto 5MB)</span>
                                    </p>
                                    <div className="drag-drop-box mt-3">
                                        <div className="text-center">
                                            <i className="bi bi-upload fs-28" />
                                            <p>
                                                Drop your file to upload or <a className="ox-browse">browse</a>
                                            </p>
                                        </div>
                                    </div>
                                </Files>
                            )}
                            <small className="text-danger mt-1">{error}</small>
                        </div>
                        <div className="modal-footer lt-modal-footer mt-3">
                            {((imageModalType === 'banner' && hasBanner) ||
                                (imageModalType === 'avatar' && hasAvatar)) && (
                                <button
                                    type="button"
                                    data-bs-toggle="modal"
                                    data-bs-target="#DeleteBannerPic"
                                    className="btn btn-danger"
                                >
                                    Delete {imageModalType === 'banner' ? 'banner' : 'avatar'}
                                </button>
                            )}

                            {loading && <div className='new-spinner p-absolute'><div><span className="spinner-border spinner-border-sm custom-spinner-border" /></div><p className='fs-14 custom-loading-text'>Loading</p></div>}
                            <button
                                type="button"
                                disabled={!image || loading}
                                onClick={upload}
                                className="btn btn-primary m-0"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteImage candidatePage={candidatePage} imageModalType={imageModalType} clearCrop={clearCrop} />
        </>
    );
};

export default UploadImage;
