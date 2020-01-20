import React from "react";
import BaseCharts from "./BaseCharts";
import PropTypes from "prop-types";
import colorScheme from "./colorScheme";
import logger from "sabio-debug";

const _logger = logger.extend("Locations");

const Locations = ({ data }) => {
  _logger(data);
  let locationData = [],
    stateCount = 0;
  const { states, total } = data.locations;
  for (let key in states) {
    locationData.push({ key, data: states[key] });
    stateCount++;
  }

  const colors = colorScheme(stateCount);

  return (
    <>
      <h4 className="subTab-header">{`Total Practices: ${data.total}`}</h4>
      <h4 className="subTab-header">{`Total Locations: ${total}`}</h4>
      <div className="row">
        <BaseCharts colors={colors} data={locationData} />
      </div>
    </>
  );
};

export default Locations;

Locations.propTypes = {
  data: PropTypes.shape({
    total: PropTypes.number,
    locations: PropTypes.shape({
      total: PropTypes.number,
      states: PropTypes.shape({})
    })
  })
};
