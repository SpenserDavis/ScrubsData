import * as providersService from "../../../services/providersService";
import DataTable from "react-data-table-component";
import { saveAs } from "file-saver";
import React, { Component } from "react";
import Swal from "sweetalert2";
import logger from "sabio-debug";
import Toggle from "react-toggle";
import _ from "lodash";
import "react-toggle/style.css";
import "./report.css";
import SpeedDial from "@material-ui/lab/SpeedDial";
// import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SearchIcon from "@material-ui/icons/Search";
import {
  Tooltip,
  Zoom,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  Checkbox,
  MenuItem,
  TextField
} from "@material-ui/core";
import {
  ViewColumn as ViewColumnIcon,
  PictureAsPdf as PageIcon
} from "@material-ui/icons";
import * as pdfExport from "./providerReportPdf";
import PropTypes from "prop-types";

const baseHeaders = [
  {
    name: "Title",
    selector: "title",
    sortable: true,
    maxWidth: "1px",
    // eslint-disable-next-line react/display-name
    cell: row => row.title || <small>-</small>
  },
  {
    name: "First Name",
    selector: "firstName",
    wrap: true,
    // eslint-disable-next-line react/display-name
    cell: row => row.firstName || <small>-</small>
  },
  {
    name: "M.I.",
    selector: "mi",
    maxWidth: "1px",
    // eslint-disable-next-line react/display-name
    cell: row => row.mi || <small>-</small>
  },
  {
    name: "Last Name",
    selector: "lastName",
    sortable: true,
    wrap: true,
    // eslint-disable-next-line react/display-name
    cell: row => row.lastName || <small>-</small>
  },
  {
    name: "Gender",
    selector: "gender",
    sortable: true,
    // eslint-disable-next-line react/display-name
    cell: row => row.gender || <small>-</small>
  },
  {
    name: "Phone",
    selector: "phone",
    wrap: true,
    // eslint-disable-next-line react/display-name
    cell: row => row.phone || <small>-</small>
  },
  {
    name: "Fax",
    selector: "fax",
    wrap: true,
    // eslint-disable-next-line react/display-name
    cell: row => row.fax || <small>-</small>
  },
  {
    name: "Email",
    selector: "email",
    wrap: true,
    minWidth: "220px",
    maxWidth: "250px",
    // eslint-disable-next-line react/display-name
    cell: row => row.email || <small>-</small>
  }
];

class ProvidersReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: {
        affiliations: false,
        certifications: false,
        expertise: false,
        languages: false,
        licenses: false,
        practices: false,
        professional: false,
        specializations: false
      },
      columnListIsOpen: false,
      dialMenuIsOpen: false,
      pageIndex: 0,
      pageSize: 10,
      providerData: [],
      searchIsOpen: false,
      searchTerm: "",
      tableColumns: [...baseHeaders],
      totalPages: 1
    };
    this.buttonRef = React.createRef();
    this.searchButton = React.createRef();
    this.searchInput = React.createRef();
  }

  componentDidMount() {
    this.getProviderReport();
  }

  getProviderReport = () => {
    const { pageSize, pageIndex, categories } = this.state;
    providersService
      .getPagedProviderReport(pageIndex, pageSize, categories)
      .then(this.mapProvidersToState)
      .catch(this.handleGetRequestFailure);
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      pageSize,
      pageIndex,
      categories,
      searchIsOpen,
      searchTerm
    } = this.state;
    if (
      pageSize !== prevState.pageSize ||
      pageIndex !== prevState.pageIndex ||
      categories !== prevState.categories
    ) {
      searchTerm.length > 0
        ? providersService
            .searchPagedProviderReport(
              pageIndex,
              pageSize,
              searchTerm,
              categories
            )
            .then(this.mapProvidersToState)
            .catch(this.onError)
        : providersService
            .getPagedProviderReport(pageIndex, pageSize, categories)
            .then(this.mapProvidersToState)
            .catch(this.handleGetRequestFailure);
    }
    if (searchIsOpen && searchIsOpen !== prevState.searchIsOpen) {
      this.searchInput.current.focus();
    }
  }

  mapProvidersToState = res => {
    const { pagedItems, totalPages } = res.item;

    this.setState({
      providerData: [...pagedItems],
      totalPages
    });
  };

  handleGetRequestFailure = err => {
    logger(err);
    Swal.fire({
      icon: "error",
      title: "Uh oh.",
      text: "You have no providers to report. Try adding some."
    });
  };

  handleToggle = e => {
    e.stopPropagation();
    const { value } = e.currentTarget.attributes.name;
    let colExists = this.state.categories[value];
    let tableColumns = [...this.state.tableColumns];
    if (colExists) {
      tableColumns.splice(
        _.findIndex(tableColumns, function(col) {
          return col.selector === value;
        }),
        1
      );
    } else {
      tableColumns.push({
        name: value[0].toUpperCase() + value.slice(1, value.length),
        selector: value,
        wrap: true,
        minWidth: "200px",
        // eslint-disable-next-line react/display-name
        cell: row => {
          if (row[value]) {
            switch (value) {
              case "professional":
                return `NPI: ${row["professional"].npi}, Genders Accepted: ${row["professional"].gendersAccepted}`;
              default:
                let concatVals = "";
                for (let i = 0; i < row[value].length; i++) {
                  if (concatVals !== "") {
                    concatVals += ", ";
                  }
                  concatVals +=
                    row[value][i][value === "licenses" ? "state" : "name"];
                }
                return concatVals;
            }
          } else {
            return <small>-</small>;
          }
        }
      });
    }
    this.setState(prevState => ({
      categories: {
        ...prevState.categories,
        [value]: !prevState.categories[value]
      },
      tableColumns
    }));
  };

  formatCategory = category => {
    let formattedCategory = "";
    for (let i = 0; i < category.length; i++) {
      if (i === 0) {
        formattedCategory += category[i].toUpperCase();
      } else if (category[i] === category[i].toUpperCase()) {
        formattedCategory += ` ${category[i]}`;
      } else {
        formattedCategory += category[i];
      }
    }
    return formattedCategory;
  };

  handleChangeRows = newRows => {
    this.setState({ pageSize: newRows });
  };

  handlePageTurn = page => {
    this.setState({ pageIndex: page - 1 });
  };

  handleDownloadRequest = () => {
    providersService
      .getFullProviderReport(this.state.categories)
      .then(this.downloadReport)
      .catch(this.handleGetRequestFailure);
  };

  handleDownloadPdf = () => {
    providersService
      .getProviderReportPdf(this.state.categories)
      .then(this.downloadPdf)
      .catch(this.handleGetRequestFailure);
  };
  downloadPdf = ({ items }) => {
    pdfExport.providerReportPdf(items);
  };

  downloadReport = response => {
    let filename = response.headers["content-disposition"]
      .split(";")
      .find(n => n.includes("filename="))
      .replace("filename=", "")
      .trim();
    let url = window.URL.createObjectURL(new Blob([response.data]));
    saveAs(url, filename);
    window.URL.revokeObjectURL(url);
  };

  handleRowClicked = e => {
    const { id } = e;
    this.props.history.push(`/providers/${id}/details`);
  };

  renderToggleButtons = () => {
    let toggleButtons = [];
    for (let category in this.state.categories) {
      let formattedCategory = this.formatCategory(category);
      toggleButtons.push(
        <div key={`toggle-${category}`} className="toggle-div">
          <Toggle
            name={category}
            className="pr-toggle"
            defaultChecked={this.state.categories[category]}
            onChange={this.handleToggle}
          />
          <div className="toggle-span">{`${formattedCategory}`}</div>
        </div>
      );
    }
    return toggleButtons;
  };

  renderExpandableTable = () => {
    const {
      categories,
      providerData,
      totalPages,
      pageSize,
      tableColumns
    } = this.state;
    let enabledCategories = [];
    for (let category in categories) {
      if (categories[category]) {
        enabledCategories.push(category);
      }
    }
    return (
      <DataTable
        title={this.renderHeader()}
        columns={tableColumns}
        data={providerData}
        fixedHeader
        onChangePage={this.handlePageTurn}
        onChangeRowsPerPage={this.handleChangeRows}
        onRowClicked={this.handleRowClicked}
        pagination
        paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
        paginationServer
        paginationTotalRows={totalPages * pageSize}
        className="card p-3"
        pointerOnHover
        responsive
      />
    );
  };

  renderHeader = () => {
    return (
      <div className="row">
        <h3 className="col-7">Providers Report</h3>
        <div className="col-5">{this.renderDialMenu()}</div>
      </div>
    );
  };

  handleDialClose = (e, reason) => {
    if (reason === "toggle") {
      this.setState({
        dialMenuIsOpen: false,
        columnListIsOpen: false,
        searchIsOpen: false
      });
    }
  };

  handleDialOpen = (e, reason) => {
    if (reason === "toggle") {
      this.setState({ dialMenuIsOpen: true });
    }
  };

  closeColumnList = e => {
    if (!this.buttonRef.current || !this.buttonRef.current.contains(e.target)) {
      this.setState({ columnListIsOpen: false });
    }
  };

  closeSearchBar = () => {
    this.setState({ searchIsOpen: false });
  };

  toggleColumnList = () => {
    this.setState({ columnListIsOpen: !this.state.columnListIsOpen });
  };

  handleDialButtonClick = e => {
    switch (e.currentTarget.name) {
      case "columns":
        this.toggleColumnList();
        break;
      case "search":
        this.toggleSearch();
        break;
      case "download":
        this.handleDownloadRequest();
        break;
      case "pdf":
        this.handleDownloadPdf();
        break;
      default:
        break;
    }
  };

  renderColumnList = () => {
    const { categories } = this.state;
    let items = [];

    for (let category in categories) {
      let formattedCategory =
        category.charAt(0).toUpperCase() + category.slice(1, category.length);
      items.push(
        <MenuItem
          checked={categories[category]}
          className="force-lowerCase"
          key={`category-${category}`}
          name={category}
          onClick={this.handleToggle}
        >
          <Checkbox
            checked={categories[category]}
            color="primary"
            name={`checkbox-${category}`}
          />
          {`${formattedCategory}`}
        </MenuItem>
      );
    }
    return items;
  };

  renderColumnPopper = () => {
    return (
      <>
        <Popper
          anchorEl={this.buttonRef.current}
          className="column-popper"
          disablePortal
          open={this.state.columnListIsOpen}
          style={{ zIndex: 9, marginTop: 16 }}
          transition
        >
          {({ TransitionProps, placement }) => (
            <Zoom
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper id="menu-list-grow">
                <ClickAwayListener
                  onClickAway={e => {
                    this.closeColumnList(e);
                  }}
                >
                  <MenuList>{this.renderColumnList()}</MenuList>
                </ClickAwayListener>
              </Paper>
            </Zoom>
          )}
        </Popper>
      </>
    );
  };

  updateSearch = e => {
    const { value } = e.target;
    this.setState({ searchTerm: value });
  };

  searchProviders = () => {
    const { searchTerm, categories, pageSize } = this.state;
    this.setState(prevState => {
      return {
        ...prevState,
        pageIndex: 0
      };
    });
    this.state.searchTerm.length > 0
      ? providersService
          .searchPagedProviderReport(0, pageSize, searchTerm, categories)
          .then(this.mapProvidersToState)
          .catch(this.onError)
      : providersService
          .getPagedProviderReport(0, pageSize, categories)
          .then(this.mapProvidersToState)
          .catch(this.handleGetRequestFailure);
  };

  onError = err => {
    logger(err);
  };

  toggleSearch = () => {
    this.setState(prevState => ({ searchIsOpen: !prevState.searchIsOpen }));
  };

  handleSearchInputClick = e => {
    e.stopPropagation();
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  handleKeyDown = e => {
    if (e.keyCode === 13) {
      this.searchProviders();
    }
  };

  handleKeyUp = e => {
    e.preventDefault();
  };

  renderSearchPopper = () => {
    return (
      <Popper
        anchorEl={this.searchButton.current}
        className={
          this.state.searchIsOpen
            ? "searchAnimationInputActive search-input"
            : "searchAnimationInput search-input"
        }
        disablePortal
        onClick={this.searchProviders}
        open={this.state.searchIsOpen}
        placement="left"
      >
        <ClickAwayListener
          onClickAway={e => {
            this.closeSearchBar(e);
          }}
        >
          <TextField
            inputRef={this.searchInput}
            onChange={this.updateSearch}
            onClick={this.handleSearchInputClick}
            onKeyDown={this.handleKeyDown}
            onKeyUp={this.handleKeyUp}
            placeholder="Search..."
            value={this.state.searchTerm}
          />
        </ClickAwayListener>
      </Popper>
    );
  };

  renderDialMenu = () => {
    const actions = [
      {
        icon: <i className="mdi mdi-file-excel excel-report-icon"></i>,
        name: "Download Excel",
        compName: "download"
      },
      {
        icon: <PageIcon color="primary" />,
        name: "Download PDF",
        compName: "pdf"
      },
      {
        icon: (
          <Tooltip
            disableFocusListener
            disableHoverListener
            title=""
            TransitionComponent={Zoom}
          >
            <span>
              <ViewColumnIcon ref={this.buttonRef} color="primary" />
              {this.renderColumnPopper()}
            </span>
          </Tooltip>
        ),
        name: "Columns",
        compName: "columns"
      },
      {
        icon: (
          <span>
            <SearchIcon ref={this.searchButton} color="primary" />
            {this.renderSearchPopper()}
          </span>
        ),
        name: "Search",
        compName: "search"
      }
    ];

    return (
      <SpeedDial
        className="speedDial needForSpeed"
        ariaLabel="Menu"
        // icon={<SpeedDialIcon />}
        // onClose={this.handleDialClose}
        // onOpen={this.handleDialOpen}
        open={true}
        direction="left"
      >
        {actions.map(action => (
          <SpeedDialAction
            arrow
            icon={action.icon}
            key={action.name}
            name={action.compName}
            onClick={this.handleDialButtonClick}
            placement="top"
            tooltipPlacement="top"
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    );
  };

  render() {
    return (
      <>
        {/* {this.state.providerData.length > 0 && this.renderDialMenu()} */}
        {this.renderExpandableTable()}
      </>
    );
  }
}

ProvidersReport.propTypes = {
  currentUser: PropTypes.shape({
    roles: PropTypes.arrayOf(PropTypes.string),
    id: PropTypes.number
  }),
  history: PropTypes.shape({ push: PropTypes.func.isRequired })
};

export default ProvidersReport;
