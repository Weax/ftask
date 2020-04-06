import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, Button, Card, CardContent } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  header: {
    textAlign: 'center'
  },
  card: {
    marginTop: theme.spacing(8),
    maxWidth: 450,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  feature: {
    textAlign: 'center'
  }
}));

export default function Main() {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} className={classes.header}>
            <Typography variant="h6" align="center">
              UserSystem
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.feature}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="primary"
              disableElevation
            >
              Register new user
          </Button>
          </Grid>
          <Grid item xs={12} className={classes.feature}>
            <Button
              component={Link}
              to="/list"
              variant="contained"
              color="secondary"
              disableElevation
            >
              User list
          </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
