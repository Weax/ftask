import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadItems, selectItems } from "./slice";
import EnhancedTable, { HeadCell } from "../../common/table";
import { Grid, Typography, Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import UserEditForm from "./UserEditForm";
import { User, emptyUser } from "../../api/User";
import {
  updateUser,
  selectErrors,
  selectIsSaving
} from "./slice";
import { Alert } from "@material-ui/lab";
import { prepareItemForForm, flattenObject } from "../../utils/helpers";

const cols: HeadCell[] = [
  { id: "name", label: "Name" },
  { id: "surname", label: "Surname" },
  { id: "email", label: "Email" },
  { id: "address.country", label: "Country" },
  { id: "address.city", label: "City" },
  { id: "address.house", label: "House" },
  { id: "address.code", label: "Code" },
];

const useStyles = makeStyles((theme) => ({
  header: {
    marginTop: theme.spacing(8),
    textAlign: 'center'
  },
  responsive: {
    flex: 1
  },
}));

export default function List() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const rows = useSelector(selectItems);
  const [selectedItem, setSelectedItem] = useState<string>();

  const [initial, setInitial] = useState<User>(emptyUser);
  const asyncErrors = useSelector(selectErrors);
  const isSaving = useSelector(selectIsSaving);

  const formProps = { initial, submitAction: updateUser(Number(selectedItem)), isSaving, error: null }

  const handleSelect = (selectedItems: string[]) => {
    const singleSelectedItemKey = selectedItems[0];
    setSelectedItem(singleSelectedItemKey);

    //pass empty strings to undefined user properties
    const key = Number(singleSelectedItemKey);
    if (!isNaN(key)) {
      const user = prepareItemForForm(emptyUser, rows[key]);
      setInitial(user);
    }
  };

  useEffect(() => {
    dispatch(loadItems());
  }, [dispatch]);

  return (
    <Grid container spacing={2} className={classes.header}>
      <Grid container spacing={2}>
        <Grid item className={classes.responsive}>
          <EnhancedTable
            headCells={cols}
            rows={rows.map(row => flattenObject(row))}
            multiSelect={false}
            handleSelect={handleSelect}
            title="User list"
          />
          {asyncErrors && (
            <Alert severity="error">{asyncErrors}</Alert>
          )}
        </Grid>
        {selectedItem && (
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <UserEditForm {...formProps} />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
