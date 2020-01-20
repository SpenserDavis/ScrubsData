import React from "react";
import PropTypes from "prop-types";
import BaseCharts from "./BaseCharts";
import colorScheme from "./colorScheme";
import logger from "sabio-debug";

const _logger = logger.extend("CommonSubs");

const CommonSubs = ({ data }) => {
  let names = [],
    subCount = 0;

  for (let key in data) {
    names.push({ key, data: data[key] });
    subCount++;
  }
  _logger(names);

  let colors = colorScheme(subCount);

  return (
    <>
      <div className="row">
        <h5 className="subTab-header">{`Total: ${subCount}`}</h5>
      </div>
      <div className="row">
        <BaseCharts colors={colors} data={names} />
      </div>
    </>
  );
};

export default CommonSubs;

CommonSubs.propTypes = {
  data: PropTypes.shape({})
};
