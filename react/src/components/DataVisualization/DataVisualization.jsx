import React from "react";
import DataTabs from "./DataTabs";
import SubTabs from "./SubTabs";
import "./dataVis.css";
import _ from "lodash";
import Affiliations from "./Affiliations";
import * as dataVisService from "../../services/dataVisService";
import CommonSubs from "./CommonSubs";
import Genders from "./Genders";
import Licenses from "./Licenses";
import Compliance from "./Compliance";
import Locations from "./Locations";
import logger from "sabio-debug";

const _logger = logger.extend("DataVisualization");

const tabs = {
  Practices: { entry: 1, subTabs: ["Locations"] },
  Providers: {
    entry: 0,
    subTabs: [
      "Affiliations",
      "Certifications",
      "Compliance",
      "Expertise",
      "Genders",
      "Insurance Plans",
      "Languages",
      "Licenses",
      "Specializations"
    ]
  }
};

const initialProviderCounts = {
  affiliations: { names: {}, types: {} },
  certifications: {},
  compliance: { counts: { compliant: 0, noncompliant: 0 }, dateAttested: [] },
  expertise: {},
  genders: {},
  gendersAccepted: {},
  insurancePlans: {},
  languages: {},
  licenses: {},
  specializations: {},
  total: 0
};

const initialPracticeCounts = { total: 0, locations: { total: 0, states: {} } };

class DataVisualization extends React.Component {
  state = {
    activeTab: "Providers",
    activeSubTab: 0,
    loading: true,
    data: {
      providers: initialProviderCounts
    }
  };

  componentDidMount() {
    this.fetchActiveTabResource();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeTab !== this.state.activeTab) {
      this.fetchActiveTabResource();
    }
  }

  fetchActiveTabResource = async () => {
    let res;
    switch (this.state.activeTab) {
      case "Providers":
        res = await dataVisService.getProviderData();
        this.tabulateProviderData(res);
        break;
      case "Practices":
        res = await dataVisService.getPracticeData();
        this.tabulatePracticeData(res);
        break;
      default:
        return;
    }
  };

  tabulateProviderData = ({ item }) => {
    const counts = { ...initialProviderCounts };
    item.forEach(
      ({
        gender,
        compliant,
        professional,
        affiliations,
        certifications,
        expertise,
        languages,
        licenses,
        specializations,
        dateAttested,
        insurancePlans
      }) => {
        counts.total++;
        if (gender) {
          if (!counts.genders[gender]) {
            counts.genders[gender] = 0;
          }
          counts.genders[gender]++;
        }
        if (dateAttested) {
          counts.compliance.dateAttested.push(dateAttested);
        }
        if (compliant) {
          counts.compliance.counts.compliant++;
        } else {
          counts.compliance.counts.noncompliant++;
        }
        if (professional) {
          let pGa = professional.gendersAccepted;
          let cGa = counts.gendersAccepted;
          if (pGa) {
            if (!cGa[pGa]) {
              cGa[pGa] = 0;
            }
            cGa[pGa]++;
          }
        }

        if (affiliations) {
          tabulateCommonResources(affiliations, "affiliations", "name", "type");
        }

        if (certifications) {
          tabulateCommonResources(certifications, "certifications", "name");
        }

        if (expertise) {
          tabulateCommonResources(expertise, "expertise", "name");
        }
        if (insurancePlans) {
          tabulateCommonResources(insurancePlans, "insurancePlans", "name");
        }
        if (languages) {
          tabulateCommonResources(languages, "languages", "name");
        }
        if (licenses) {
          tabulateCommonResources(licenses, "licenses", "state");
        }
        if (specializations) {
          tabulateCommonResources(specializations, "specializations", "name");
        }
      }
    );
    _logger("counts", counts);
    this.setState({
      data: { ...this.state.data, providers: { ...counts } },
      loading: false
    });

    function tabulateCommonResources(resources, resourcesType, ...keys) {
      resources.forEach(resource => {
        let cR = counts[resourcesType];
        if (keys.length === 1) {
          if (!cR[resource[keys[0]]]) {
            cR[resource[keys[0]]] = 0;
          }
          cR[resource[keys[0]]]++;
        } else {
          let pluralizedKey;
          for (let i = 0; i < keys.length; i++) {
            pluralizedKey = `${keys[i]}s`;
            if (!cR[pluralizedKey][resource[keys[i]]]) {
              cR[pluralizedKey][resource[keys[i]]] = 0;
            }
            cR[pluralizedKey][resource[keys[i]]]++;
          }
        }
      });
    }
  };

  tabulatePracticeData = ({ item }) => {
    const counts = { ...initialPracticeCounts };
    let { locations } = counts;

    item.forEach(practice => {
      counts.total++;
      if (practice.locations) {
        practice.locations.forEach(location => {
          locations.total++;
          if (!locations.states[location.name]) {
            locations.states[location.name] = 0;
          }
          locations.states[location.name]++;
        });
      }
    });

    this.setState(prevState => {
      return {
        data: { ...prevState.data, practices: { ...counts } },
        loading: false
      };
    });
  };

  handleTabChange = activeTab => {
    if (activeTab !== this.state.activeTab) {
      this.setState({ activeTab, activeSubTab: 0, loading: true });
    }
  };

  handleSubTabChange = activeSubTab => {
    this.setState({
      activeSubTab: tabs[this.state.activeTab].subTabs.indexOf(activeSubTab)
    });
  };

  getTabKeys = tabType => {
    return _.keys(tabType);
  };

  getTabValues = tabType => {
    return _.values(tabType);
  };

  renderLayout = () => {
    const {
      activeSubTab,
      activeTab,
      data: {
        practices,
        providers: {
          affiliations,
          certifications,
          compliance,
          expertise,
          genders,
          gendersAccepted,
          insurancePlans,
          languages,
          licenses,
          specializations
        }
      }
    } = this.state;

    const layout = tabs[activeTab].subTabs[activeSubTab];

    switch (layout) {
      case "Affiliations":
        return <Affiliations data={affiliations} />;
      case "Certifications":
        return <CommonSubs data={certifications} />;
      case "Compliance":
        return <Compliance data={compliance} />;
      case "Expertise":
        return <CommonSubs data={expertise} />;
      case "Genders":
        return (
          <Genders
            data={{
              genders: genders,
              gendersAccepted: gendersAccepted
            }}
          />
        );
      case "Insurance Plans":
        return <CommonSubs data={insurancePlans} />;
      case "Languages":
        return <CommonSubs data={languages} />;
      case "Licenses":
        return <Licenses data={licenses} />;
      case "Locations":
        return <Locations data={practices} />;
      case "Specializations":
        return <CommonSubs data={specializations} />;
      default:
        return;
    }
  };

  render() {
    return (
      <div>
        <DataTabs
          myTabs={this.getTabKeys(tabs)}
          onTabChange={this.handleTabChange}
        />
        <SubTabs
          activeSubTab={this.state.activeSubTab}
          onSubTabChange={this.handleSubTabChange}
          subTabs={this.getTabValues(tabs[this.state.activeTab].subTabs)}
        />
        {this.state.loading ? (
          <div className="lds-ripple">
            <div className="lds-pos"></div>
            <div className="lds-pos"></div>
          </div>
        ) : (
          <div className="chartsAndGraphs">{this.renderLayout()}</div>
        )}
      </div>
    );
  }
}

export default DataVisualization;
