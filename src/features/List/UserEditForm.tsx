import React from "react";
import Button from "@material-ui/core/Button";
import FormikTextField from "../../common/fields/FormikTextField";
import FormikPlacesAutoComplete from "../../common/fields/FormikPlacesAutoComplete";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Field } from "formik";
import { useDispatch } from "react-redux";
import { isEmpty } from "ramda";
import { User } from "../../api/User";
import * as Yup from "yup";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    secondaryHeading: {
        marginTop: theme.spacing(1)
      },
    form: {
        width: "100%",
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

const RegisterUserSchema = Yup.object().shape({
    name: Yup.string().required("Please enter a name"),
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Please enter an email address")
});

interface FormProps {
    initial: User,
    submitAction: any,
    isSaving: boolean,
    error: string | null
}

const UserEditForm = ({ initial, submitAction, isSaving, error }: FormProps) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [showDetails, setShowDetails] = React.useState(false);

    React.useEffect(() => {
        //if any of address details defined, show details block
        Object.values(initial.address).forEach(function (v) {
            if (v) (v.length > 0) && setShowDetails(true);
        });
    }, [initial]);

    return (
        <Formik
            enableReinitialize
            initialValues={initial}
            validationSchema={RegisterUserSchema}
            onSubmit={(values, { setSubmitting }) => {
                dispatch(submitAction(values));
                setSubmitting(false);
            }}
        >
            {({ values, errors, isSubmitting, handleSubmit, setFieldValue }) => (
                <form
                    noValidate
                    className={classes.form}
                    onSubmit={handleSubmit}
                >
                    <Field
                        component={FormikTextField}
                        required={true}
                        label="Name"
                        name="name"
                        type="text"
                        value={values.name}
                    />
                    <Field
                        component={FormikTextField}
                        label="Surname"
                        name="surname"
                        type="text"
                        value={values.surname}
                    />
                    <Field
                        component={FormikTextField}
                        required={true}
                        label="Email"
                        name="email"
                        type="email"
                        value={values.email}
                    />

                <Typography align="center" className={classes.secondaryHeading}>
                  Enter address below to autocomplete
                </Typography>
                  
                    <Field
                        component={FormikPlacesAutoComplete}
                        label="Enter address"
                        name="address"
                        onChange={(value: any) => {  
                            setFieldValue(
                              "address",
                              value !== null ? value : ""
                            );
                            value !== null && setShowDetails(true);
                          }}
                          value=""
                    />

                    {showDetails &&
                    <>
                    <Field
                        component={FormikTextField}
                        label="Country"
                        name="address.country"
                        type="text"
                        value={values.address.country}
                    />
                    <Field
                        component={FormikTextField}
                        label="City"
                        name="address.city"
                        type="text"
                        value={values.address.city}
                    />
                    <Field
                        component={FormikTextField}
                        label="House"
                        name="address.house"
                        type="text"
                        value={values.address.house}
                    />
                    <Field
                        component={FormikTextField}
                        label="Code"
                        name="address.code"
                        type="text"
                        value={values.address.code}
                    />
                    </>
                    }

                    <Button
                        type="submit"
                        fullWidth
                        disableElevation
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={isSubmitting || isSaving || !isEmpty(errors)}
                    >
                        Save
                      </Button>
                    {error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : null}
                </form>
            )}
        </Formik>
    )
}

export default UserEditForm;