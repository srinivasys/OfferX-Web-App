import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../lib/api/auth';
import { UserType } from '../types/auth';
import { tokenManager } from '../lib/token-manager';

type InitialStateType = {
    loading: boolean;
    user: UserType | null;
};

const initialState: InitialStateType = {
    loading: true,
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setUser(state, action: PayloadAction<UserType>) {
            state.user = action.payload;
        },
        deleteUser(state) {
            state.user = initialState.user;
            sessionStorage.clear();
        },
    },
});

export function getUser() {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(userSlice.actions.setLoading(true));
            const user = await authService.getUser();
            if (user) {
                dispatch(userSlice.actions.setUser(user.resultObject));
            }
        } catch (err) {
        } finally {
            dispatch(userSlice.actions.setLoading(false));
        }
    };
}

export function signOut() {
    return async (dispatch: Dispatch) => {
        dispatch(userSlice.actions.deleteUser());
        tokenManager.removeToken();
    };
}

export function linkedInSignOut() {
    return async (dispatch: Dispatch) => {
        const linkedInSignOut = (url: any) => {
            const win = window.open(
                url,
                '_blank',
                'toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=10000, top=10000, width=5, height=5, visible=none'
            );
            setTimeout(() => {
                win?.close();
            }, 3000);
        };
        linkedInSignOut(`https://linkedin.com/m/logout`);
        dispatch(userSlice.actions.deleteUser());
        tokenManager.removeToken();
    };
}

export default userSlice.reducer;
export const { setLoading } = userSlice.actions;
