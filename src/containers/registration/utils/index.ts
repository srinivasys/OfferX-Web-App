import { Dispatch } from '@reduxjs/toolkit';
import { tokenManager } from '../../../lib/token-manager';
import { getUser } from '../../../redux/user';
import history from '../../../history';
import { routes } from '../../routes/routes-names';
import { AuthResponseType } from '../../../types/auth';

export async function goToRoom(data: AuthResponseType, dispatch: Dispatch<any>) {
    const close = document.querySelector('[data-close]') as HTMLButtonElement;
    tokenManager.setToken(data.resultObject.accessToken);
    await dispatch(getUser());
    close.click();
    history.push(routes.pendingOffers);
}
