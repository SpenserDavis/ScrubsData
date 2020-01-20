import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import logger from "sabio-debug";

const _logger = logger.extend("SubTabs");

const useStyles = makeStyles({
  root: { backgroundColor: "#85CCFF", flexGrow: 1 },
  subTab: {
    textTransform: "capitalize",
    color: "white"
  }
});

const SubTabs = ({ subTabs, onSubTabChange, activeSubTab }) => {
  _logger("subTabs==", subTabs);
  _logger("activeSubTab==", activeSubTab);

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    setValue(activeSubTab);
  }, [subTabs, activeSubTab]);

  const handleChange = e => {
    const { textContent } = e.currentTarget;
    onSubTabChange(textContent);
  };

  const renderTabs = () => {
    return subTabs.map((tab, i) => (
      <Tab label={tab} key={`subtab-${i}`} className={classes.subTab} />
    ));
  };

  return (
    <Paper className={classes.root}>
      <Tabs
        scrollButtons="auto"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="primary"
      >
        {renderTabs()}
      </Tabs>
    </Paper>
  );
};

export default SubTabs;

SubTabs.propTypes = {
  subTabs: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onSubTabChange: PropTypes.func.isRequired,
  activeSubTab: PropTypes.number.isRequired
};
