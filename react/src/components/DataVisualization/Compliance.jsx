import React from "react";
import PropTypes from "prop-types";
import BaseCharts from "./BaseCharts";
import moment from "moment";
import { LineChart } from "react-chartkick";
import "chart.js";
import colorScheme from "./colorScheme";
import logger from "sabio-debug";

const _logger = logger.extend("Compliance");

const Compliance = ({ data }) => {
  const complianceCounts = [];

  for (let key in data.counts) {
    complianceCounts.push({ key, data: data.counts[key] });
  }
  _logger(data.dateAttested);

  let dates = {};
  for (let i = 12; i > 0; i--) {
    dates[
      moment()
        .subtract(i, "months")
        .format("MMM YYYY")
    ] = 0;
  }

  data.dateAttested.forEach(date => {
    var monthYear = moment(date).format("MMM") + " " + moment(date).year();
    _logger(monthYear);
    if (dates.hasOwnProperty(monthYear)) {
      dates[monthYear] += 1;
    }
  });

  const colors = colorScheme(2);

  return (
    <>
      <div className="row">
        <BaseCharts colors={colors} data={complianceCounts} />
      </div>
      <div className="row" id="compliance-dateChart">
        <LineChart
          xtitle="Date Last Attested"
          ytitle="# Attestants"
          data={dates}
        />
      </div>
    </>
  );
};

export default Compliance;

Compliance.propTypes = {
  data: PropTypes.shape({
    counts: PropTypes.shape({}),
    dateAttested: PropTypes.arrayOf(PropTypes.string)
  })
};
