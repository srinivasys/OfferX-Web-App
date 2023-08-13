// Get Column Index and Title based on The Offer State
import { OfferStateEnum } from '../../../types/offer';

export const getColumnByOfferState = (state: OfferStateEnum) => {
    switch (state) {
        case OfferStateEnum.pending:
            return { dataIndex: 'offerExpiryDate', title: 'Expiry date' };
        case OfferStateEnum.accepted || OfferStateEnum.onboarded ||  OfferStateEnum.ghosted:
            return { dataIndex: 'acceptedDate', title: 'Accepted date' };
        case OfferStateEnum.rejected:
            return { dataIndex: 'rejectedDate', title: 'Declined date' };
        case OfferStateEnum.retracted:
            return { dataIndex: 'retractedDate', title: 'Retracted date' };
        case OfferStateEnum.expired:
            return { dataIndex: 'expiredDate', title: 'Expired date' };
        default:
            return { dataIndex: 'acceptedDate', title: 'Accepted date' };
    }
};
