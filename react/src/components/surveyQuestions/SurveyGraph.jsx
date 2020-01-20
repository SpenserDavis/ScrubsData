import React from "react";
import PropTypes from "prop-types";
import * as surveysService from "../../services/surveysService";
import logger from "sabio-debug";

const _logger = logger.extend("SabioInit");

const colors = [
  "#FA6340",
  "#FB703F",
  "#FB7D3F",
  "#FB8A3E",
  "#FB983E",
  "#FBA53D",
  "#FBB33D",
  "#FBC13C",
  "#FBCE3C",
  "#FBDC3B",
  "#FBEA3B",
  "#FBF83A",
  "#F1FB3A",
  "#E3FC39",
  "#D5FC39",
  "#C6FC39",
  "#B8FC38",
  "#AAFC38",
  "#9CFC37",
  "#8DFC37",
  "#7FFC36",
  "#70FC36",
  "#61FC35",
  "#52FC35",
  "#43FC34",
  "#35FD34",
  "#33FD41",
  "#33FD4F",
  "#32FD5E",
  "#32FD6C",
  "#32FD7A",
  "#31FD89",
  "#31FD98",
  "#30FDA6",
  "#30FDB5",
  "#2FFDC4",
  "#2FFDD3",
  "#2EFEE2",
  "#2EFEF1",
  "#2DFCFE",
  "#2DEDFE",
  "#2CDDFE",
  "#2CCEFE",
  "#2BBFFE",
  "#2BB0FE",
  "#2AA0FE",
  "#2A91FE",
  "#2981FE",
  "#2971FE",
  "#2861FF"
];

const surveyGraph = WrappedComponent => {
  class SurveyGraph extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        data: {
          datasets: [{}]
        }
      };
    }

    componentDidMount() {
      this.getSurveyInstance();
    }

    getSurveyInstance = () => {
      surveysService
        .surveyInstance()
        .then(this.getSurveyInstanceSuccess)
        .catch(this.onError);
    };

    getSurveyInstanceSuccess = data => {
      surveysService
        .surveyResults(data.item)
        .then(this.getsurveyResultsSuccess)
        .catch(this.onError);
    };

    getsurveyResultsSuccess = data => {
      _logger(data);
      let labels = [" "];
      let answers = [0];
      for (let i = 0; i < data.items.length; i++) {
        const surveyResult = data.items[i];
        labels.push(surveyResult.answer);
        answers.push(surveyResult.results);
      }

      this.setState({
        data: {
          labels,
          datasets: [
            {
              data: answers,
              backgroundColor: colors
            }
          ]
        }
      });
    };

    onError = errResponse => {
      _logger(errResponse);
    };

    render() {
      return (
        <>
          <WrappedComponent data={this.state.data} />
        </>
      );
    }
  }
  return SurveyGraph;
};
export default surveyGraph;

surveyGraph.propTypes = {
  data: PropTypes.shape({}),
  width: PropTypes.number,
  height: PropTypes.number,
  id: PropTypes.string,
  legend: PropTypes.shape({}),
  options: PropTypes.shape({}),
  getDatasetAtEvent: PropTypes.func,
  getElementAtEvent: PropTypes.func,
  getElementsAtEvent: PropTypes.func,
  onElementsClick: PropTypes.func
};
