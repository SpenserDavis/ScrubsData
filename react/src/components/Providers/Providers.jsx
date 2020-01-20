import React from "react";
import * as providersService from "../../services/providersService";
import ProviderForm from "./ProviderForm";
import logger from "sabio-debug";
import Pagination from "rc-pagination";
import ProviderList from "./ProviderList";
import PropTypes from "prop-types";
import { Route, Link } from "react-router-dom";
import ProviderCard from "./ProviderCard";
import ProviderDetailsPage from "./ProviderDetailsPage";
import localeInfo from "rc-pagination/lib/locale/en_US";
import "rc-pagination/assets/index.css";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";

const _logger = logger.extend("Providers");

class Providers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      pageSize: 5,
      filterId: 0,
      totalPages: 1,
      searchTerm: "",
      modalIsOpen: false,
      deleteTarget: { id: null },
      deleteInputConfirm: "",
      providerData: [],
      components: { providers: [], searched: [] }
    };
  }

  componentDidMount() {
    _logger("Component Mounted");
    this.initializeByPath();
  }

  componentDidUpdate(prevProps, prevState) {
    _logger("Component Updated");
    this.initializeByPath(prevProps, prevState);
  }

  initializeByPath = (prevProps, prevState) => {
    const { pageIndex, pageSize } = this.state;
    const { id } = this.props.match.params;
    const { pathname } = this.props.location;
    const noMaterialChange =
      prevProps &&
      prevProps.location.pathname === pathname &&
      pageIndex === prevState.pageIndex &&
      prevProps.match.params.id === id
        ? true
        : false;

    if (noMaterialChange) {
      return;
    }
    switch (pathname) {
      case "/providers/current":
        providersService
          .getProvidersByCreatedBy(pageIndex, pageSize)
          .then(this.mapProvidersToState)
          .catch(this.handleGetRequestFailure);
        break;
      case `/providers/${id}/details`:
        providersService
          .getProviderDetails(id)
          .then(this.mapProvidersToState)
          .catch(this.handleGetRequestFailure);
        break;
      case "/providers/details":
        providersService
          .getAllProviderDetails(pageIndex, pageSize)
          .then(this.mapProvidersToState)
          .catch(this.handleGetRequestFailure);
        break;
      case `/providers/expertise/${id}`:
        providersService
          .getProvidersByExpertise(id, pageIndex, pageSize)
          .then(this.mapProvidersToState)
          .catch(this.handleGetRequestFailure);
        break;
      case `/providers/insuranceplans/${id}`:
        providersService
          .getProvidersByInsurancePlan(id, pageIndex, pageSize)
          .then(this.mapProvidersToState)
          .catch(this.handleGetRequestFailure);
        break;
      case `/providers/specializations/${id}`:
        providersService
          .getProvidersBySpecialization(id, pageIndex, pageSize)
          .then(this.mapProvidersToState)
          .catch(this.handleGetRequestFailure);
        break;
      case `/providers/states/${id}`:
        providersService
          .getProvidersByState(id, pageIndex, pageSize)
          .then(this.mapProvidersToState)
          .catch(this.handleGetRequestFailure);
        break;
      case `/providers/${id}`:
        this.showSingleProvider(id);
        break;
      default:
        providersService
          .getAllProviders(pageIndex, pageSize)
          .then(this.mapProvidersToState)
          .catch(this.handleGetRequestFailure);
    }
  };

  showSingleProvider = id => {
    let targetProvider = this.state.providerData.find(
      provider => provider.id === id
    );
    if (targetProvider) {
    } else {
      providersService
        .getProviderById(id)
        .then(this.mapProvidersToState)
        .catch(this.handleGetRequestFailure);
    }
  };

  mapProvidersToState = res => {
    const { item } = res;
    let providerCards;
    if (item.pagedItems) {
      //if multiple providers are returned
      providerCards = item.pagedItems.map((provider, i) => (
        <ProviderCard
          onDeleteRequest={this.handleDeleteRequest}
          key={`provider-${i}`}
          provider={provider}
        />
      ));
      this.setState({
        providerData: [...item.pagedItems],
        totalPages: item.totalPages,
        components: { ...this.state.components, providers: [...providerCards] }
      });
    } else {
      //if a single provider is returned
      providerCards = (
        <ProviderCard
          onDeleteRequest={this.handleDeleteRequest}
          key={`provider-${item.id}`}
          provider={item}
        />
      );
      this.setState({
        providerData: [item],
        components: { ...this.state.components, providers: [providerCards] }
      });
    }
  };

  handleDeleteRequest = id => {
    _logger("delete requested - provider id: ", id);
    this.setState({ deleteTarget: { id } });
    this.showModal();
  };

  handleSearchInputChange = e => {
    this.setState({ searchTerm: e.target.value });
  };

  handleSearchSubmit = e => {
    if (e.key === "Enter") {
      _logger("search stuff");
    }
  };

  handleGetRequestFailure = err => {
    _logger("err=", err);
    Swal.fire({
      type: "error",
      title: "Uh oh",
      text: "That doesn't seem to be working right now"
    });
  };

  handlePageTurn = current => {
    this.setState({ pageIndex: current - 1 });
  };

  hideModal = () => {
    this.setState({ modalIsOpen: false });
  };

  showModal = () => {
    this.setState({ modalIsOpen: true });
  };

  renderDetailToggleButton = () => {
    const { pathname } = this.props.location;
    const { id } = this.props.match.params;
    const detailRoutes = ["/providers/details", `/providers/${id}/details`];
    const nonDetailRoutes = ["/providers", `/providers/${id}`];

    return (
      detailRoutes.concat(nonDetailRoutes).includes(pathname) && (
        <div className="col-6">
          {nonDetailRoutes.includes(pathname) ? (
            <Link
              to={
                pathname === "/providers"
                  ? "/providers/details"
                  : `/providers/${id}/details`
              }
            >
              <button type="btn" className="btn btn-primary">
                Show Details
              </button>
            </Link>
          ) : (
            <Link
              to={
                pathname === "/providers/details"
                  ? "/providers"
                  : `/providers/${id}`
              }
            >
              <button type="btn" className="btn btn-primary">
                Hide Details
              </button>
            </Link>
          )}
        </div>
      )
    );
  };

  handleDeleteInputChange = e => {
    this.setState({ deleteInputConfirm: e.target.value });
  };

  handleDeleteButtonClick = () => {
    _logger("delete button clicked");
  };

  renderPagination = () => {
    const { pathname } = this.props.location;
    const { components } = this.state;
    const componentHasData = components.providers.length > 0 ? true : false;
    const isSearching = components.searched.length > 0 ? true : false;
    const id = new RegExp(/^\d+$/);
    const isSingleProviderView =
      pathname === `/providers/${id}` || pathname === `/providers/${id}/details`
        ? true
        : false;

    return (
      !isSingleProviderView &&
      (componentHasData || isSearching) && (
        <Pagination
          onChange={this.handlePageTurn}
          defaultCurrent={1}
          total={this.state.totalPages * 10}
          showLessItems
          current={this.state.pageIndex + 1}
          showTitle={false}
          locale={localeInfo}
        />
      )
    );
  };

  //move modal to a separate component
  renderModal = () => {
    const { id } = this.state.deleteTarget;
    const { deleteInputConfirm } = this.state;
    //ideally this would be firstName + lastName instead of id
    return (
      <Modal
        size="lg"
        show={this.state.modalIsOpen}
        onHide={this.hideModal}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            {`Are you sure you wish to delete ${id}?`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{`You must type 'DELETE' in the field below to confirm.`}</p>
          <input
            className="form-control"
            type="text"
            onChange={this.handleDeleteInputChange}
            value={deleteInputConfirm}
          />
        </Modal.Body>
        <button
          className="btn btn-danger"
          onClick={this.handleDeleteButtonClick}
          disabled={
            deleteInputConfirm.toLowerCase() === "delete" ? false : true
          }
        >
          DELETE
        </button>
      </Modal>
    );
  };

  //redacted

  render() {
    //redacted
    return (
      <div className="col-sm-12">
        <div className="card">
          <div
            className="m-0 p-3 border-bottom bg-light card-title"
            style={{ fontWeight: "500", width: "100%" }}
          >
            Providers
          </div>
          {!formIsOpen && (
            <div className="card-body">
              <div className="react-bs-table-tool-bar">
                <div className="row">
                  <div className="col-sm-6 btn-group btn-group-sm">
                    <Link to="/providers/new">
                      <button
                        type="button"
                        className="btn btn-success react-bs-table-add-btn "
                        onClick={this.onSelectedAddItem}
                      >
                        <span>
                          <i className="fa glyphicon glyphicon-plus fa-plus" />{" "}
                          New
                        </span>
                      </button>
                    </Link>
                    {this.renderDetailToggleButton()}
                  </div>
                  <div className="col-sm-6">
                    <input
                      value={this.state.searchTerm}
                      name="searchTerm"
                      onChange={this.handleSearchInputChange}
                      onKeyDown={this.handleSearchSubmit}
                      className="form-control"
                      type="text"
                      placeholder="Search for a provider"
                    />
                  </div>
                </div>
              </div>
              <Route
                exact
                path={[`/providers/:id/details`]}
                render={props => (
                  <ProviderDetailsPage
                    prevPath={this.props.prevPath}
                    {...props}
                  />
                )}
              />
              <div className="tab-content mt-3 text-center">
                <div className="tab-pane active">
                  <div className="row">
                    <div className="col-sm-12">
                      <div>
                        <div className="table-responsive">
                          <table className="v-middle table table-striped table-bordered table-hover">
                            <thead className="table-header-wrapper">
                              <tr>{this.renderHeaders()}</tr>
                            </thead>
                            <tbody>
                              <ProviderList
                                searched={this.state.components.searched}
                                providers={this.state.components.providers}
                              />
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="row justify-content-center">
                        {this.renderPagination()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {this.state.modalIsOpen && this.renderModal()}
          <Route
            exact
            path={[`/providers/new`, `/providers/:id/edit`]}
            render={props => (
              <ProviderForm prevPath={this.props.prevPath} {...props} />
            )}
          />
        </div>
      </div>
    );
  }
}

export default Providers;

Providers.propTypes = {
  location: PropTypes.shape({ pathname: PropTypes.string }),
  match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }),
  prevPath: PropTypes.string
};
