import React from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./contact.css";
import logger from "sabio-debug";
import Avatar from "./Avatar";
import { saveAs } from "file-saver";
import moment from "moment";
import { getByteArray } from "./utils";

const _logger = logger.extend("ContactCard");

class ContactCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };
    this.options = ["Visit Profile", "Download Chat History", "Remove Contact"];
  }

  componentDidMount() {
    this.props.hubConnection.on("DownloadChat", this.downloadHistory);
  }

  componentDidUpdate() {
    if (this.state.anchorEl) {
      document.addEventListener("mousedown", this.handleClose);
    }
  }

  componentWillUnmount() {
    _logger("unmounting");
    document.removeEventListener("mousedown", this.handleClose);
    this.props.unsubscribe("DownloadChat");
  }

  renderName = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName && !lastName) {
      return `${firstName}`;
    } else {
      return <small className="no-name">{this.props.contact.email}</small>;
    }
  };

  handleClick = e => {
    e.stopPropagation();
    this.setState({ anchorEl: e.target });
  };

  handleMenuAction = e => {
    const { value } = e.target.attributes.name;
    const { contact, hubConnection } = this.props;
    if (value === "Visit Profile") {
      this.props.history.push(`/providers/${contact.id}/details`);
    } else if (value === "Remove Contact") {
      hubConnection.invoke("DeleteContact", contact.id);
    } else if (value === "Download Chat History") {
      hubConnection.invoke("DownloadChatHistory", contact.id);
    }

    this.setState({
      anchorEl: null
    });
  };

  downloadHistory = (data, id) => {
    if (!data || this.props.contact.id !== id) {
      return;
    }
    const date = moment(new Date()).format("MM_DD_YYYY");
    const filename = `Chat_History_${date}.xlsx`;

    const byteArray = getByteArray(data);
    const blob = new Blob([byteArray], { type: "application/octet-stream" });

    saveAs(blob, filename);
  };

  handleClose = e => {
    if (!e.target.contains(this.state.anchorEl)) {
      this.setState({
        anchorEl: null
      });
    }
  };

  openChat = () => {
    const { contact, makeActiveContact } = this.props;
    makeActiveContact(contact);
  };

  render() {
    const {
      contact: { firstName, lastName, roles, avatarUrl, unreadCount, isOnline }
    } = this.props;
    return (
      <>
        <div className="message-center">
          <div>
            <IconButton
              aria-controls="long-menu"
              aria-haspopup="true"
              aria-label="more"
              className="contactList-more"
              id="iconButton-contactList"
              onClick={this.handleClick}
              size="small"
            >
              <MoreVertIcon />
            </IconButton>

            <Menu
              anchorEl={this.state.anchorEl}
              id="long-menu"
              keepMounted
              open={!!this.state.anchorEl}
              PaperProps={{
                style: {
                  maxHeight: 48 * 4.5,
                  width: 200
                }
              }}
            >
              {this.options.map(option => (
                <MenuItem
                  key={option}
                  onClick={this.handleMenuAction}
                  name={option}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </div>
          <li className="nav-item" onClick={this.openChat}>
            <span className="message-item">
              <span className="user-img">
                <Avatar
                  src={avatarUrl}
                  styles={{ className: "rounded-circle", width: "20px" }}
                />
                <span
                  className={`profile-status pull-right ${isOnline &&
                    "online"}`}
                ></span>
              </span>
              <div className="mail-content">
                <h5 className="message-title">
                  {this.renderName(firstName, lastName)}
                </h5>
                <div className="mail-desc">
                  {roles || <small>{`User hasn't set a profile role`}</small>}
                  {unreadCount > 0 && (
                    <div className="float-right unread-count">
                      {unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </span>
          </li>
        </div>
      </>
    );
  }
}
export default ContactCard;

ContactCard.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatarUrl: PropTypes.string,
    roles: PropTypes.string,
    unreadCount: PropTypes.number,
    email: PropTypes.string.isRequired,
    isOnline: PropTypes.bool.isRequired
  }),
  hubConnection: PropTypes.shape({
    invoke: PropTypes.func,
    off: PropTypes.func.isRequired,
    on: PropTypes.func.isRequired
  }),
  makeActiveContact: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }),
  unsubscribe: PropTypes.func.isRequired
};
