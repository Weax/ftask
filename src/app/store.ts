import { configureStore, combineReducers, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import userListReducer from "../features/List/slice";
import registerReducer from "../features/Register/slice";
import snackBarReducer from "../common/snackBarSlice";

const rootReducer = combineReducers({
    register: registerReducer,
    users: userListReducer,
    snackBar: snackBarReducer
});
const store = configureStore({
    reducer: rootReducer
});

export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;