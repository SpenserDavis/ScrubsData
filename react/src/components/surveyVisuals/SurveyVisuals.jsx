import React from "react";
import * as visualsService from "../../services/surveyVisualsService";
import Swal from "sweetalert2";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import SurveyCharts from "./SurveyCharts";
import _ from "lodash";
import debug from "sabio-debug";

const logger = debug.extend("SurveyVisuals");

class SurveyVisuals extends React.Component {
  state = {
    selectedSurvey: [],
    selectedSection: null,
    chartStyle: "Doughnut",
    surveyTitlesAndSections: [],
    surveyData: {},
    surveyFetchInProgress: true
  };

  componentDidMount() {
    this.initializeSurveyOptions();
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedSurvey } = this.state;
    if (selectedSurvey !== prevState.selectedSurvey) {
      visualsService
        .getSurveyDetails(selectedSurvey[0].id)
        .then(this.getSurveyDetailsSuccess)
        .catch(this.onError);
    }
  }

  initializeSurveyOptions = () => {
    visualsService
      .getSurveyTitlesAndSections()
      .then(this.mapSurveysToState)
      .catch(this.onError);
  };

  mapSurveysToState = ({ items }) => {
    let surveyTitlesAndSections = items.filter(s => s.sections);
    this.setState({ surveyTitlesAndSections, surveyFetchInProgress: false });
  };

  getSurveyDetailsSuccess = ({ item }) => {
    this.setState({ surveyData: item, surveyFetchInProgress: false });
  };

  handleSurveyInputChange = selectedSurvey => {
    if (selectedSurvey.length > 0) {
      this.setState({
        selectedSurvey,
        selectedSection: selectedSurvey[0].sections[0].id,
        surveyFetchInProgress: true
      });
    }
  };

  handleSectionDropdownChange = e => {
    const { value } = e.target;
    this.setState({ selectedSection: value });
  };

  handleChartStyleChange = e => {
    const { value } = e.target;
    this.setState({ chartStyle: value });
  };

  onError = errResponse => {
    Swal.fire("error", "Oops", "That doesn't seem to be working right now.");
    logger(errResponse);
  };

  loadSection = () => {
    const { surveyData, selectedSection } = this.state;
    return _.find(surveyData.sections, function(o) {
      return o.id === parseInt(selectedSection);
    });
  };

  renderSectionDropdown = () => {
    const { selectedSection, selectedSurvey } = this.state;
    return (
      <div className="col-xs-12 col-md-3">
        <select
          className="p-2"
          style={{ border: "none" }}
          value={selectedSection.id}
          onChange={this.handleSectionDropdownChange}
        >
          {selectedSurvey[0].sections.map((section, i) => {
            logger("choicesection=", section);
            return (
              <option value={section.id} key={`surveyMenuSection-${i}`}>
                {section.title || `Untitled Section ${i + 1}`}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  renderChartStyle = () => {
    const chartStyles = [
      "Doughnut",
      "Polar"
      //bar doesn't work for some reason
      //,"Bar"
    ];

    return (
      <div className="col-xs-12 col-4">
        <h6>Graph/Chart Style</h6>
        {chartStyles.map((s, i) => (
          <button
            key={`chartStyles-menu-${i}`}
            className="btn"
            value={s}
            onClick={this.handleChartStyleChange}
          >
            {s}
          </button>
        ))}
      </div>
    );
  };

  render() {
    const {
      selectedSurvey,
      surveyTitlesAndSections,
      chartStyle,
      selectedSection,
      surveyData,
      surveyFetchInProgress
    } = this.state;

    return (
      <>
        <div className="row text-center">
          <div className="col-xs-12 col-md-5">
            <Typeahead
              id="typeahead-bootstrap"
              onChange={this.handleSurveyInputChange}
              options={surveyTitlesAndSections}
              labelKey="name"
              selected={selectedSurvey}
              placeholder="select a survey to start"
            />
          </div>
          {selectedSurvey.length > 0 && this.renderSectionDropdown()}
          {selectedSection && this.renderChartStyle()}
        </div>
        {selectedSection &&
          Object.entries(surveyData).length !== 0 &&
          !surveyFetchInProgress && (
            <SurveyCharts
              section={this.loadSection()}
              chartStyle={chartStyle}
            />
          )}
      </>
    );
  }
}

export default SurveyVisuals;
