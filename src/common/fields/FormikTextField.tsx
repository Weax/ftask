import React from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import { FormikProps, Field } from 'formik';

interface FormValues {
    [name: string]: string;
}

interface FieldProps {
    field: typeof Field;
    multiline: string | boolean;
    margin: TextFieldProps["margin"];
    form: FormikProps<FormValues>
}

const FormikTextField = ({
    field,
    field: { name },
    form: { errors, touched, isSubmitting },
    margin = "normal",
    multiline,
    ...props
}: FieldProps) => {
    const hasError = (errors[name] && touched[name]) || false;

    return (
        <TextField
            disabled={isSubmitting}
            error={hasError}
            helperText={hasError && errors[name]}
            variant="outlined"
            margin={margin}
            multiline={!!multiline}
            fullWidth
            {...props}
            {...field}
        />
    );
};

export default FormikTextField;