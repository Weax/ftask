import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import {
    selectSnackBarIsOpened,
    selectSnackBarMessage,
    selectSnackBarSeverity,
    setSnackBarClose
} from "./snackBarSlice";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    }
}));

export default function Main({ children }: { children?: JSX.Element[] | JSX.Element }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const snackBarOpen = useSelector(selectSnackBarIsOpened);
    const snackBarMessage = useSelector(selectSnackBarMessage);
    const snackBarSeverity = useSelector(selectSnackBarSeverity);

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <Container maxWidth="xl">{children}</Container>
            </div>
            <Snackbar
                onClick={() => dispatch(setSnackBarClose())}
                open={snackBarOpen}
                autoHideDuration={5000}
                onClose={(e, reason) => {
                    if (reason === "clickaway") {
                        return;
                    }
                    dispatch(setSnackBarClose());
                }}
            >
                <MuiAlert elevation={6} variant="filled" severity={snackBarSeverity}>
                    {snackBarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
}
