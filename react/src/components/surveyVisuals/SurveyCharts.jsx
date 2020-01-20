import React from "react";
import PropTypes from "prop-types";
import SurveyGraphs from "./SurveyGraphs";
import "./surveyVisuals.css";
import logger from "sabio-debug";

const _logger = logger.extend("SurveyCharts");

const SurveyCharts = ({ section, chartStyle }) => {
  _logger("section props=", section);
  const showGraphs = () => {
    return section.questions.map((q, i) => {
      return (
        <React.Fragment key={`survey-graph-${q.id}-${i}`}>
          <div className="row survey-question-container">
            <div className="row survey-question-header">
              <h6>{q.question}</h6>
            </div>
            {q.answers ? (
              <SurveyGraphs
                chartStyle={chartStyle}
                data={q.answers.map(a => a.totalCount)}
                labels={q.answers.map(a => a.answerOption)}
              />
            ) : (
              <div className="row">
                <span className="survey-answer-span">
                  {` No answer options exist for this question.`}
                </span>
              </div>
            )}
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div className="survey-section-container">
      <div className="row survey-section-title">
        <h5>{section.title || "Untitled Section"}</h5>
      </div>
      {section.questions ? (
        <div className="survey-graph-container">{showGraphs()}</div>
      ) : (
        "This section doesn't have any questions yet."
      )}
    </div>
  );
};

export default SurveyCharts;

SurveyCharts.propTypes = {
  section: PropTypes.shape({
    title: PropTypes.string,
    questions: PropTypes.arrayOf(PropTypes.shape({}))
  }).isRequired,
  chartStyle: PropTypes.string.isRequired
};
