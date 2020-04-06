import React from "react";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import UserEditForm from "../List/UserEditForm";
import {
  createUser,
  selectErrors,
  selectIsSuccess,
  selectIsSaving,
  resetFormSync,
  selectInitial
} from "./slice";

const useStyles = makeStyles(theme => ({
  successAlert: {
    margin: theme.spacing(1)
  },
  secondaryHeading: {
    marginTop: theme.spacing(1)
  },
  card: {
    marginTop: theme.spacing(8),
    maxWidth: 450,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  },
  dropdown: {
    width: "100%"
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function Register() {
  const classes = useStyles();
  const error = useSelector(selectErrors);
  const isSuccess = useSelector(selectIsSuccess);
  const isSaving = useSelector(selectIsSaving);
  const dispatch = useDispatch();

  const initial = useSelector(selectInitial);

  const formProps = { initial, submitAction: createUser, isSaving, error }

  return (
      <Card className={classes.card}>
        <CardContent>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <PersonAddIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Add user
            </Typography>
            {!isSuccess ? (
              <>
                <Typography align="center" className={classes.secondaryHeading}>
                  New user registration
                </Typography>
                <UserEditForm {...formProps} />
              </>
            ) : (
              <>
                <Alert className={classes.successAlert} severity="success">
                  User is successsfully added!
                </Alert>
                <Button
                  disableElevation
                  variant="contained"
                  className={classes.submit}
                  onClick={() => dispatch(resetFormSync())}
                >
                  Back to the form
                </Button>
              </>
            )}
            <Box mt={2}>
              or <Link href="/list">go to user list</Link>
            </Box>
          </div>
        </CardContent>
      </Card>
  );
}
