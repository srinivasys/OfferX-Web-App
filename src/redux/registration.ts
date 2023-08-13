import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SocialEnum } from '../types/auth';

export type ReduxCandidateListType = {
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    authType: SocialEnum;
};

type InitialStateType = {
    profile: ReduxCandidateListType | null;
};

const initialState: InitialStateType = {
    profile: null,
};

const registrationSlice = createSlice({
    name: 'registration',
    initialState,
    reducers: {
        setReduxProfile(state, action: PayloadAction<ReduxCandidateListType>) {
            state.profile = action.payload;
        },
        deleteReduxProfile(state) {
            state = initialState;
        },
    },
});

export default registrationSlice.reducer;
export const { setReduxProfile, deleteReduxProfile } = registrationSlice.actions;
