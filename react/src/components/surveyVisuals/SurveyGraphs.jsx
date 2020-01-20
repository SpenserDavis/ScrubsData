import React from "react";
import {
  Doughnut,
  Polar
  //  ,Bar
} from "react-chartjs-2";
import PropTypes from "prop-types";
import logger from "sabio-debug";

const _logger = logger.extend("SurveyGraphs");

const backgroundColor = [
  "#e6194b",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#46f0f0",
  "#f032e6",
  "#bcf60c",
  "#fabebe",
  "#008080",
  "#e6beff",
  "#9a6324",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075",
  "#808080",
  "#ffffff",
  "#000000",
  "#FA6340",
  "#FB983E",
  "#D5FC39",
  "#8DFC37",
  "#43FC34",
  "#32FD6C",
  "#30FDB5",
  "#2DFCFE",
  "#2BB0FE",
  "#2861FF"
];

const SurveyGraph = ({ labels, data, chartStyle }) => {
  const surveyData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor
      }
    ]
  };

  const chartStyles = {
    Doughnut,
    Polar
    //bar doesn't work for some reason
    // ,Bar
  };

  let GraphComponent = chartStyles[chartStyle];
  _logger("graph=", GraphComponent);
  return (
    <>
      <div className="col-6 p-3 survey-graph">
        <GraphComponent
          data={surveyData}
          options={{
            maintainAspectRatio: true
          }}
        />
      </div>
    </>
  );
};
export default SurveyGraph;

SurveyGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  labels: PropTypes.arrayOf(PropTypes.string),
  chartStyle: PropTypes.string.isRequired
};
