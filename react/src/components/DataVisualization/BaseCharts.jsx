import React from "react";
import {
  PieChart,
  PieArcSeries,
  Gridline,
  GridlineSeries,
  BarChart,
  BarSeries
} from "reaviz";
import PropTypes from "prop-types";

const BaseCharts = props => {
  return (
    <>
      <PieChart
        height={350}
        width={500}
        data={props.data}
        series={<PieArcSeries colorScheme={props.colors || "cybertron"} />}
      />
      <BarChart
        width={350}
        height={300}
        data={props.data}
        series={<BarSeries colorScheme={props.colors || "cybertron"} />}
        gridlines={<GridlineSeries line={<Gridline direction="all" />} />}
      />
    </>
  );
};

export default BaseCharts;

BaseCharts.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()),
  colors: PropTypes.arrayOf(PropTypes.string)
};
