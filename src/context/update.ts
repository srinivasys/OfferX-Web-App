import React from 'react';

type ContextProps = {
    updateOffersList?: () => void;
    updateProfile?: () => void;
    updateOffersCount?: () => void;
};

export default React.createContext<ContextProps>({
    updateOffersList: () => {},
    updateProfile: () => {},
    updateOffersCount: () => {},
});
