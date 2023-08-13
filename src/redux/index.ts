import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';
import history from '../history';
import user from './user';
import reducer from './reducer';
import registration from './registration';

export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
    router: connectRouter(history),
    registration,
    user,
    toolkit: reducer,
});

export const store = configureStore({
    reducer: rootReducer,
});
