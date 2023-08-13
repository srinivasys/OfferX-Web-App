import React, { useCallback, useRef, useState } from 'react';

import { LoginSocialGoogle, IResolveParams, TypeCrossFunction } from 'reactjs-social-login';

// CUSTOMIZE ANY UI BUTTON
import { GoogleLoginButton } from 'react-social-login-buttons';

//const REDIRECT_URI = 'http://localhost:3000/account/login';

const Google = () => {
    const [provider, setProvider] = useState('');
    const [profile, setProfile] = useState<any>();
    const googleRef = useRef<TypeCrossFunction>(null!);

    const onLoginStart = useCallback(() => {
        alert('login start');
    }, []);

    const onLogoutFailure = useCallback(() => {
        alert('logout fail');
    }, []);

    const onLogoutSuccess = useCallback(() => {
        setProfile(null);
        setProvider('');
        alert('logout success');
    }, []);

    /*const onLogout = useCallback(() => {
    switch (provider) {
      case 'google':
        googleRef.current?.onLogout();
        break;
      default:
        break;
    }
  }, [provider]);*/

    return (
        <>
            {/*{provider && profile && (
                <User provider={provider} profile={profile} onLogout={onLogout} />
            )}*/}
            <div className={`App ${provider && profile ? 'hide' : ''}`}>
                <h1 className="title">ReactJS Social Login</h1>

                <LoginSocialGoogle
                    ref={googleRef}
                    client_id={'737063221398-fdn92at7qkkcj6t2lpas5pek175uj38c.apps.googleusercontent.com'}
                    onLogoutFailure={onLogoutFailure}
                    onLoginStart={onLoginStart}
                    onLogoutSuccess={onLogoutSuccess}
                    onResolve={({ provider, data }: IResolveParams) => {
                        setProvider(provider);
                        setProfile(data);
                    }}
                    onReject={(err) => {
                    }}
                    
                >
                    <GoogleLoginButton />
                </LoginSocialGoogle>
            </div>
        </>
    );
};

export default Google;
