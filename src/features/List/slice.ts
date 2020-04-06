import { createSlice } from "@reduxjs/toolkit";
import { setSnackBarOpen } from "../../common/snackBarSlice";
import { RootState, AppThunk } from "../../app/store";
import { prepareItemForSave } from "../../utils/helpers";
import { usersApi, User } from "../../api/User";
import { QueryParams} from "../../api/apiBuilder";

const initialState = {
    items: [] as User[],
    isSaving: false,
    errors: null,
    success: false
}

export const slice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setFailure: (state, action) => {
            state.isSaving = false;
            state.errors = action.payload;
        },
        setIsSaving: (state, action) => {
            state.isSaving = action.payload;
        },
        setItemsSync: (state, action: {payload: User[]}) => {
            state.items = action.payload;
        },
        updateItemSync: (state, action: { payload: { id: number, user: User } }) => {
            state.isSaving = false;
            state.items[action.payload.id] = action.payload.user;
        },
    }
});

const {
    setFailure,
    setIsSaving,
    setItemsSync,
    updateItemSync
} = slice.actions;

export const loadItems = (query?: QueryParams): AppThunk => dispatch => {
    usersApi.query(query).then(res => {        
        if (res) {
            dispatch(setItemsSync(res))
        } else {
            dispatch(setFailure("No records found."))
        }
    }).catch(e => {
        if (e instanceof Error) {
            dispatch(setFailure(e.message));
        }
    });
};

export const updateUser = (id: number) => (userRaw: {}): AppThunk => dispatch => {
    const user = prepareItemForSave(userRaw) as User;
    dispatch(setIsSaving(true));
    usersApi.update(id, user).then(() => {
        dispatch(updateItemSync({ id, user }));
        dispatch(setSnackBarOpen("User successfully updated!", "success"));
    }).catch(e => {
        if (e instanceof Error) {
            dispatch(setIsSaving(false));
            dispatch(setSnackBarOpen(e.message));
        }
    });
};

export const selectItems = (state: RootState) => state.users.items;
export const selectErrors = (state: RootState) => state.users.errors;
export const selectIsSaving = (state: RootState) => state.users.isSaving;

export default slice.reducer;