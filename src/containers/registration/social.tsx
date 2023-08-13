import React, { useCallback, useRef, useState } from 'react';
import { IResolveParams, LoginSocialGoogle, LoginSocialMicrosoft, TypeCrossFunction } from 'reactjs-social-login';
//import { useLinkedIn } from 'react-linkedin-login-oauth2';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { ReduxCandidateListType, setReduxProfile } from '../../redux/registration';
import { SocialEnum, SocialEnumKeyType } from '../../types/auth';
import { authService } from '../../lib/api/auth';
import { goToRoom } from './utils';
import { googleClientId, linkedInClientId, microsoftClientId } from '../../config/constants';
import MediaLayout from './media-layout';
import { routes } from '../routes/routes-names';
import lock from '../../assets/img/padlock.png';
import { Messages } from '../../lib/constants/messages';
import { authType } from '../../lib/auth-type';
import microsoftLogo from '../../assets/img/Microsoft.png';
import googleLogo from '../../assets/img/Google.png';

type AuthSocialProps = {
    goToRegistration: () => void;
};

const AuthSocial: React.FC<AuthSocialProps> = ({ goToRegistration }) => {
    const googleRef = useRef<TypeCrossFunction>(null!);
    const microsoftRef = useRef<TypeCrossFunction>(null!);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState('');
    const [suspended, setSuspended] = useState(false);

    // const { linkedInLogin } = useLinkedIn({
    //     clientId: linkedInClientId,
    //     scope: 'r_liteprofile r_emailaddress',
    //     redirectUri: `${window.location.origin}/linkedin`,
    //     onSuccess: async (code) => {
    //         const { resultObject } = await authService.linkedin(code);
    //         signIn('linkedIn', { ...resultObject, id_token: resultObject.accessToken });
    //     },
    //     onError: (error) => {
    //         console.log(error);
    //     },
    // });

    const signIn = useCallback(
        async (provider: SocialEnumKeyType, profile) => {
            const email = getEmail(provider, profile);
            try {
                setLoading(provider);
                const data = await authService.socialSignIn({
                    Email: email,
                    AuthType: SocialEnum[provider],
                    Token: profile.id_token,
                });
                if (data) {
                    authType.setAuthType(provider);
                    await goToRoom(data, dispatch);
                }
            } catch (err: any) {
                if (err.response.status === 401) {
                    const fullName = getFullName(provider, profile);
                    const profileSocial: ReduxCandidateListType = {
                        ...fullName,
                        email,
                        token: profile.id_token,
                        authType: SocialEnum[provider],
                    };
                    dispatch(setReduxProfile(profileSocial));
                    goToRegistration();
                } else if (err.response.status === 400) {
                    setSuspended(true);
                } else {
                    toast.error(Messages.AuthenticationError);
                    setLoading('');
                }
            }
        },
        [dispatch, goToRegistration]
    );

    return (
        <MediaLayout>
            {suspended ? (
                <div className="w-100 p-4 text-center">
                    <img src={lock} className="img-fluid mb-4" alt="OfferX Logo" />
                    <h4 className="fs-24 fw-700">Your account is suspended</h4>
                    <p className="mb-2 fs-16">Please reach out to our customer support team at</p>
                    <a href="mailto:support@offerx.in" className="btn-link me-4 text-decoration-none">
                        <i className="bi bi-envelope" /> support@offerx.in
                    </a>
                    {/*<a href="tel:+914048512310" className="btn-link text-decoration-none">
                        <i className="bi bi-telephone" /> +91 40 48512310
                    </a>*/}
                </div>
            ) : (
                <>
                    <div className="w-100 pb-4 text-center">
                        <h1 className="fw-700 fs-18">Sign in or Sign up with</h1>
                    </div>
                    <div className="d-sm-flex d-lg-block d-xl-flex justify-content-center mb-4">
                        <div className="mx-3">
                            {loading === 'microsoft' ? (
                                <>
                                <button type="button" className="btn login-btn microsoft-btn" disabled>
                                    <span className="microsoft-icon">
                                        <img src={microsoftLogo} width={20} />
                                    </span>
                                    <span>Microsoft</span>
                                </button>
                                <div className='new-spinner p-absolute'><div><span className="spinner-border spinner-border-sm custom-spinner-border" /></div><p className='fs-14 custom-loading-text'>Loading</p></div>
                                </>
                            ) : (
                                <LoginSocialMicrosoft
                                    ref={microsoftRef}
                                    client_id={microsoftClientId}
                                    redirect_uri={window.location.origin}
                                    onResolve={({ provider, data }: IResolveParams) => {
                                        if (provider === 'microsoft') {
                                            signIn(provider, data);
                                        }
                                    }}
                                    onReject={(err: any) => {
                                    }}
                                    scope="profile openid email User.Read"
                                >
                                    <button type="button" className="btn login-btn microsoft-btn">
                                        <span className="microsoft-icon">
                                            <img src={microsoftLogo} width={20} />
                                        </span>
                                        <span>Microsoft</span>
                                    </button>
                                </LoginSocialMicrosoft>
                            )}
                        </div>
                        <div className="mx-3">
                            {loading === 'google' ? (
                                <>
                                <button type="button" className="btn login-btn google-btn" disabled>
                                    <span className="google-icon">
                                        <img src={googleLogo} width={20} />
                                    </span>
                                    <span className='google-text-margin'>Google</span>
                                </button>
                                <div className='new-spinner p-absolute'><div><span className="spinner-border spinner-border-sm custom-spinner-border" /></div><p className='fs-14 custom-loading-text'>Loading</p></div>
                                </>
                            ) : (
                                <LoginSocialGoogle
                                    ref={googleRef}
                                    client_id={googleClientId}
                                    onResolve={({ provider, data }: IResolveParams) => {
                                        if (provider === 'google') {
                                            signIn(provider, data);
                                        }
                                    }}
                                    onReject={(err) => {
                                    }}
                                >
                                    <button type="button" className="btn login-btn google-btn">
                                        <span className="google-icon">
                                            <img src={googleLogo} width={20} />
                                        </span>
                                        <span className='google-text-margin'>Google</span>
                                    </button>
                                </LoginSocialGoogle>
                            )}
                        </div>
                        {/* <div className="mx-3">
                            {loading === 'linkedIn' ? (
                                <button type="button" className="btn btn-info login-btn linkedin-btn" disabled>
                                    <span className="linkedin-icon">
                                        <span className="spinner-border spinner-border-sm" />
                                    </span>{' '}
                                    LinkedIn
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={linkedInLogin}
                                    className="btn btn-info login-btn linkedin-btn"
                                >
                                    <span className="linkedin-icon">
                                        <i className="bi bi-linkedin" />
                                    </span>{' '}
                                    LinkedIn
                                </button>
                            )}
                        </div> */}
                    </div>
                    <div className="w-100 m-auto fs-12 text-center">By clicking sign in or sign up, you agree to the OfferX <a className="text-decoration-none" target="_blank" href="/legal/terms">Terms &amp; Conditions</a>, <br /><a className="text-decoration-none" target="_blank" href="/legal/privacy">Privacy</a> and <a className="text-decoration-none" target="_blank" href="/legal/privacy#Item-6">Cookie policies.</a></div>
                </>
            )}
        </MediaLayout>
    );
};

export default AuthSocial;

function getEmail(provider: SocialEnumKeyType, profile: any) {
    return SocialEnum[provider] === SocialEnum.google
        ? profile.email
        : SocialEnum[provider] === SocialEnum.microsoft
        ? profile.userPrincipalName
        : SocialEnum[provider] === SocialEnum.linkedIn
        ? profile.emailAddress
        : '';
}

function getFullName(provider: SocialEnumKeyType, profile: any) {
    return SocialEnum[provider] === SocialEnum.google || SocialEnum[provider] === SocialEnum.linkedIn
        ? { firstName: profile.firstName, lastName: profile.lastName }
        : SocialEnum[provider] === SocialEnum.microsoft
        ? { firstName: profile.givenName, lastName: profile.surname }
        : { firstName: '', lastName: '' };
}
