import { createSlice } from "@reduxjs/toolkit";
import {Color} from "@material-ui/lab";
import { RootState } from "../app/store";

export interface SnackBarState {
  isOpened: boolean;
  message: string;
  severity: Color;
}

const initialState: SnackBarState = {
  isOpened: false,
  message: "An error has occurred",
  severity: "error"
}

export const slice = createSlice({
  name: "snackBar",
  initialState: initialState,
  reducers: {
    setOpenState: (state, action) => {
      state.isOpened = action.payload.isOpened;
      state.message = action.payload.message || state.message;
      state.severity = action.payload.severity || state.severity;
    }
  }
});

const { setOpenState } = slice.actions;

export const setSnackBarOpen = (message: string, severity = "error") => setOpenState({ isOpened: true, message, severity });
export const setSnackBarClose = () => setOpenState({ isOpened: false });

export const selectSnackBarIsOpened = (state: RootState ) => state.snackBar.isOpened;
export const selectSnackBarMessage = (state: RootState) => state.snackBar.message;
export const selectSnackBarSeverity = (state: RootState) => state.snackBar.severity;

export default slice.reducer;
