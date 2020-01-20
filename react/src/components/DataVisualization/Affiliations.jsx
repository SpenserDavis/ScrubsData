import React from "react";
import BaseCharts from "./BaseCharts";
import PropTypes from "prop-types";
import colorScheme from "./colorScheme";

const Affiliations = ({ data }) => {
  const { names, types } = data;
  let nameData = [],
    typeData = [],
    nameCount = 0,
    typeCount = 0;

  for (let key in names) {
    nameData.push({ key, data: names[key] });
    nameCount++;
  }
  for (let key in types) {
    typeData.push({ key, data: types[key] });
    typeCount++;
  }

  let nameColors = colorScheme(nameCount);
  let typeColors = colorScheme(typeCount);

  return (
    <>
      <div className="row">
        <h4 className="subTab-header">Affiliation Names</h4>
      </div>
      <div className="row">
        <h6 className="subTab-header">{`Total Affiliations: ${nameCount}`}</h6>
      </div>
      <div className="row">
        <BaseCharts colors={nameColors} data={nameData} />
      </div>
      <div className="row">
        <h4 className="subTab-header">Affiliation Types</h4>
      </div>
      <div className="row">
        <BaseCharts colors={typeColors} data={typeData} />
      </div>
    </>
  );
};

export default Affiliations;

Affiliations.propTypes = {
  data: PropTypes.shape({
    names: PropTypes.shape({}),
    types: PropTypes.shape({})
  })
};
