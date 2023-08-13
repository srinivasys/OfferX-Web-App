import { digioEnv } from '../../config/constants';
import { offerService } from '../api/offer';

export async function digioSign(
    offerId: string,
    externalForSignatureDocId: string,
    email: string,
    successFunction: () => void,
    cancelFunction: () => void
) {
    const {
        resultObject: { id: token },
    } = await offerService.getExternalSignatureAccessToken(offerId);
    //@ts-ignore
    const digio = new Digio({
        environment: digioEnv,
        callback: function (response: any) {
            if (response.message === 'Signed Successfully') {
                successFunction();
            }
            if (response.error_code === 'CANCELLED') {
                cancelFunction();
            }
        },
        logo: `${window.location.origin}/offerx-logo.png`,
        is_iframe: true,
        theme: {
            primaryColor: '#ffffff',
            secondaryColor: '#323130',
        },
    });
    digio.init();
    digio.submit(externalForSignatureDocId, email, token);
}
