import React from "react";
import PropTypes from "prop-types";
import BaseCharts from "./BaseCharts";
import colorScheme from "./colorScheme";
import logger from "sabio-debug";

const _logger = logger.extend("Licenses");

const Licenses = ({ data }) => {
  let states = [],
    stateCount = 0;
  for (let key in data) {
    states.push({ key, data: data[key] });
    stateCount++;
  }
  _logger(states);

  let colors = colorScheme(stateCount);

  return (
    <div className="row">
      <BaseCharts colors={colors} data={states} />
    </div>
  );
};

export default Licenses;

Licenses.propTypes = {
  data: PropTypes.shape({})
};
