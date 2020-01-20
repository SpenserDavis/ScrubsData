import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import logger from "sabio-debug";

const _logger = logger.extend("DataTabs");

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
}));

const SimpleTabs = ({ myTabs, onTabChange }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTabClick = e => {
    const { textContent } = e.currentTarget;
    _logger("curr", e.currentTarget.textContent);
    onTabChange(textContent);
  };

  const renderTabs = () => {
    return myTabs.map((tab, i) => (
      <Tab
        label={tab}
        key={`tab-${i}`}
        {...a11yProps(i)}
        onClick={handleTabClick}
      />
    ));
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} centered>
          {renderTabs()}
        </Tabs>
      </AppBar>
    </div>
  );
};

SimpleTabs.propTypes = {
  myTabs: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onTabChange: PropTypes.func.isRequired
};

export default SimpleTabs;
