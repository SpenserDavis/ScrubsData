import React from "react";
import PropTypes from "prop-types";
import Avatar from "./Avatar";
import Message from "./Message";
import Dropzone from "./Dropzone";
import ImageList from "./ImageList";
import cuid from "cuid";
import "./contact.css";
import logger from "sabio-debug";

const _logger = logger.extend("MessageWindow");

class MessageWindow extends React.Component {
  constructor(props) {
    super(props);
    this.windowRef = React.createRef();
  }

  componentDidMount() {
    const { activeContact, modifyUnreadCount, hubConnection } = this.props;
    hubConnection
      .invoke("GetRecentMessages", activeContact.id)
      .catch(err => _logger(err));

    if (activeContact.unreadCount > 0) {
      hubConnection.invoke("UpdateDateRead", activeContact.id);
      modifyUnreadCount(activeContact.id, 0);
    }
  }

  componentDidUpdate(prevProps) {
    const { activeContact, hubConnection, modifyUnreadCount } = this.props;

    if (activeContact.unreadCount > 0) {
      hubConnection.invoke("UpdateDateRead", activeContact.id);
      modifyUnreadCount(activeContact.id, 0);
    }

    if (prevProps.messages !== this.props.messages) {
      this.scrollToBottom(!prevProps.messages.length);
    }
  }

  componentWillUnmount() {
    this.props.setLoading();
  }

  scrollToBottom = force => {
    let el = document.getElementById("chatWindow");
    let threshold = 100;
    let isPastThreshold =
      el.scrollTop > el.scrollHeight - el.offsetHeight - threshold;
    if (isPastThreshold || force) {
      this.windowRef.current.scrollIntoView({
        behavior: "auto",
        block: "end",
        inline: "nearest"
      });
    }
  };

  renderName = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName && !lastName) {
      return firstName;
    } else if (!firstName && lastName) {
      return lastName;
    } else {
      return this.props.activeContact.email;
    }
  };

  sendMessage = () => {
    this.props.sendMessage();
  };

  handleMessageInputChange = e => {
    const { value } = e.target;
    this.props.onMessageInputChange(value);
  };

  handleKeyDown = e => {
    if (e.keyCode === 13 && !e.shiftKey && this.props.message.length > 0) {
      e.preventDefault();
      this.props.sendMessage();
    } else if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
    }
  };

  handleFileDrop = filesDropped => {
    let files;
    filesDropped.forEach(file => {
      const reader = new FileReader();
      files = [...this.props.files];
      reader.onload = e => {
        files.push({
          id: cuid(),
          src: e.target.result,
          formFile: file
        });
        this.props.mapFilesToState(files);
      };
      reader.readAsDataURL(file);
    });
  };

  removeAttachment = e => {
    const { value } = e.currentTarget.attributes.idx;
    this.props.removeAttachment(value);
  };

  renderMessages = () => {
    if (this.props.messages.length === 0) {
      return;
    }
    const { messages, activeContact, hubConnection, unsubscribe } = this.props;
    let newMessages = messages;
    let messageJsx = newMessages.map(message => (
      <Message
        activeContact={activeContact}
        hubConnection={hubConnection}
        key={`message-${message.id}`}
        message={message}
        scroll={this.scrollToBottom}
        unsubscribe={unsubscribe}
      />
    ));

    return messageJsx;
  };

  render() {
    const {
      activeContact: { firstName, lastName, roles, avatarUrl },
      message,
      messages,
      files,
      dragCounter,
      isLoading
    } = this.props;

    const dropStyle = dragCounter
      ? {
          backgroundColor: "white",
          outlineStyle: "dashed",
          outlineColor: "blue"
        }
      : { backgroundColor: "#d3d3d3" };

    return (
      <div>
        <span className="bg-primary show-left-part text-white d-block d-lg-none">
          <i className="fas fa-chevron-right"></i>
        </span>
        <div>
          <div className="d-flex align-items-center p-3 border-bottom">
            <div className="mr-3">
              <Avatar
                src={avatarUrl}
                styles={{ className: "rounded-circle", width: "20px" }}
              />
            </div>
            <div>
              <h5 className="message-title mb-0">
                {this.renderName(firstName, lastName)}
              </h5>
              <p className="mb-0">
                {roles || "User hasn't set a profile role"}
              </p>
            </div>
          </div>
          <div className="scrollbar-container chat ps" id="chatWindow">
            <ul id="chat-list" className="chat-list p-4">
              {isLoading ? (
                <div className="lds-ripple">
                  <div className="lds-pos"></div>
                  <div className="lds-pos"></div>
                </div>
              ) : messages.length > 0 ? (
                this.renderMessages()
              ) : (
                <div id="chat-begin">--- Beginning of chat history ---</div>
              )}
              <div ref={this.windowRef}></div>
            </ul>
          </div>
          <form className="card-body border-top">
            <div className="d-flex message-input">
              <div id="dropzone-container" style={dropStyle}>
                <Dropzone onDrop={this.handleFileDrop} />
                {files && (
                  <ImageList
                    isAttachment
                    images={files}
                    removeAttachment={this.removeAttachment}
                  />
                )}
              </div>
              <textarea
                className={`form-control mr-2 form-control ${
                  dragCounter ? "drag" : ""
                }`}
                id="message-textarea"
                name="text"
                onChange={this.handleMessageInputChange}
                onKeyDown={this.handleKeyDown}
                placeholder="Type your message here..."
                rows={4}
                type="text"
                value={message}
              />
              <button
                className="btn btn-outline-secondary"
                disabled={!(message.length > 0 || files.length > 0)}
                id="message-button"
                onClick={this.sendMessage}
                type="button"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default MessageWindow;

MessageWindow.propTypes = {
  activeContact: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatarUrl: PropTypes.string,
    email: PropTypes.string.isRequired,
    roles: PropTypes.string,
    unreadCount: PropTypes.number
  }).isRequired,
  hubConnection: PropTypes.shape({
    on: PropTypes.func.isRequired,
    invoke: PropTypes.func.isRequired
  }),
  modifyUnreadCount: PropTypes.func.isRequired,
  message: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.shape({})),
  sendMessage: PropTypes.func.isRequired,
  onMessageInputChange: PropTypes.func.isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({})),
  mapFilesToState: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  dragCounter: PropTypes.number.isRequired,
  removeAttachment: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired
};
