import { createSlice } from "@reduxjs/toolkit";
import { clone } from "ramda";
import { prepareItemForSave } from "../../utils/helpers";
import { RootState, AppThunk } from "../../app/store";
import { usersApi, User, emptyUser } from "../../api/User";

const initialState = {
    initial: emptyUser,
    isSaving: false,
    errors: null,
    success: false
}

export const slice = createSlice({
    name: "register",
    initialState,
    reducers: {
        resetFormSync: state => {
            state.success = false;
            state.initial = clone(emptyUser);
        },
        startSaving: state => {
            state.isSaving = true;
            state.success = false;
        },
        setFailure: (state, action) => {
            state.isSaving = false;
            state.errors = action.payload;
        },
        addItemSync: (state, action: { payload: User }) => {
            state.initial = action.payload;
            state.isSaving = false;
            state.success = true;
        }
    }
});

const {
    startSaving,
    setFailure,
    addItemSync,
} = slice.actions;

export const {
    resetFormSync,
} = slice.actions;

export const createUser = (userRaw: {}): AppThunk => dispatch => {
    const user = prepareItemForSave(userRaw) as User;
    dispatch(startSaving());
    usersApi.create(user).then(() => {
        dispatch(addItemSync(user));
    }).catch(e => {
        if (e instanceof Error) {
            dispatch(setFailure(e.message));
        }
    });
};

export const selectInitial = (state: RootState) => state.register.initial;
export const selectErrors = (state: RootState) => state.register.errors;
export const selectIsSuccess = (state: RootState) => state.register.success;
export const selectIsSaving = (state: RootState) => state.register.isSaving;

export default slice.reducer;