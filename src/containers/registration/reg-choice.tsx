import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as IconCandidate } from '../../assets/icons/candidate.svg';
import { ReactComponent as IconManager } from '../../assets/icons/manager.svg';
import { getEmailDomainWithDot, personalAccountDomains } from '../../lib/constants/constants';
import { RootState } from '../../redux';
import MediaLayout from './media-layout';

type RegChoiceProps = {
    handleSelect: (key: string) => void;
};

const RegChoice: React.FC<RegChoiceProps> = ({ handleSelect }) => {
    const ssoUserProfile = useSelector((state: RootState) => state.registration.profile);
    const [validationMessage, setValidationMessage] = useState<string>();

    const onRegTypeSelected = (key: string) => {
        let emailDomain = getEmailDomainWithDot(ssoUserProfile?.email as string);
        let isPersonalAcount = personalAccountDomains.includes(emailDomain);

        if (key === 'candidates-form' && !isPersonalAcount) {
            setValidationMessage('Sorry, Only Personal accounts are allowed for a candidate registration.');
            return;
        }
        else if (key === 'manager-form' && isPersonalAcount) {
            setValidationMessage('Sorry, Personal accounts are not allowed for an employer registration.');
            return;
        }
        handleSelect(key);
    }


    return (
        <MediaLayout>
            <div className="w-100 pb-3 text-center">
                <h1 className="fw-700 fs-18">I am</h1>
            </div>
            <div className="d-flex justify-content-center mb-4">
                <div className="mx-3">
                    <div
                        onClick={() => onRegTypeSelected('candidates-form')}
                        className="op-card-box flex-column bd-highlight"
                    >
                        <IconCandidate />
                        <div className="fs-14 fw-600 text-center mb-2">Candidate</div>
                    </div>
                </div>
                <div className="mx-3">
                    <div onClick={() => onRegTypeSelected('manager-form')} className="op-card-box flex-column bd-highlight">
                        <IconManager />
                        <div className="fs-14 fw-600 text-center mb-2">Employer</div>
                    </div>
                </div>
            </div>
            <div className='text-danger'>
                {validationMessage}
            </div>
        </MediaLayout>
    );
};

export default RegChoice;
