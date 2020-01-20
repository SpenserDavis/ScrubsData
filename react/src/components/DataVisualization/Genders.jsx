import React from "react";
import PropTypes from "prop-types";
import BaseCharts from "./BaseCharts";
import colorScheme from "./colorScheme";
import logger from "sabio-debug";

const _logger = logger.extend("Genders");

const Genders = ({ data: { genders, gendersAccepted } }) => {
  let genderData = [],
    gendersAcceptedData = [],
    genderCount = 0,
    gendersAcceptedCount = 0;

  for (let key in genders) {
    genderData.push({ key, data: genders[key] });
    genderCount++;
  }
  for (let key in gendersAccepted) {
    gendersAcceptedData.push({ key, data: gendersAccepted[key] });
    gendersAcceptedCount++;
  }

  let greaterGenderCount =
    genderCount > gendersAcceptedCount ? genderCount : gendersAcceptedCount;

  _logger(genderData, gendersAcceptedData);
  const colors = colorScheme(greaterGenderCount);
  return (
    <>
      <div className="row">
        <h4 className="subTab-header">Provider Genders</h4>
      </div>
      <div className="row">
        <BaseCharts colors={colors} data={genderData} />
      </div>
      <div className="row">
        <h4 className="subTab-header">Patient Genders Accepted</h4>
      </div>
      <div className="row">
        <BaseCharts colors={colors} data={gendersAcceptedData} />
      </div>
    </>
  );
};

export default Genders;

Genders.propTypes = {
  data: PropTypes.shape({
    genders: PropTypes.shape({}),
    gendersAccepted: PropTypes.shape({})
  })
};
