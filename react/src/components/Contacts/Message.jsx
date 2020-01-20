import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Linkify from "react-linkify";
import LinkifyIt from "linkify-it";
import Avatar from "./Avatar";
import cuid from "cuid";
import ImageList from "./ImageList";
import { saveAs } from "file-saver";
import logger from "sabio-debug";
import { getByteArray } from "./utils";

const _logger = logger.extend("Message");

export default class Message extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { meta: [], metaExists: false };
    this.imageRef = React.createRef();
    this.guid = cuid();
  }

  componentDidMount() {
    if (this.imageRef.current) {
      this.imageRef.current.addEventListener("load", this.scrollOnImageLoad);
    }
    this.props.hubConnection.on("ReceiveMetaData", this.receiveMetaData);
    this.getEmbeddedUrls();
  }

  componentDidUpdate() {
    if (this.state.metaExists && this.state.meta.length === 0) {
      const linky = LinkifyIt();
      const { message, hubConnection } = this.props;
      let matches = linky.match(message.text);

      matches.forEach(match => {
        hubConnection.invoke("GetMetaData", match.url, message.id, this.guid);
      });
    }
  }

  componentWillUnmount() {
    _logger(this.props.message.fileData);
    this.props.unsubscribe("ReceiveMetaData");
  }

  scrollOnImageLoad = () => {
    setTimeout(() => {
      this.props.scroll();
    }, 100);
  };

  receiveMetaData = (metaData, id, guid) => {
    if (!metaData || id !== this.props.message.id || guid !== this.guid) {
      return;
    }

    let meta = [...this.state.meta];
    meta.push(metaData);
    this.setState({ meta });
  };

  getEmbeddedUrls = () => {
    const linky = LinkifyIt();
    const { message } = this.props;
    let linkExists = linky.test(message.text);

    if (linkExists && this.state.meta.length === 0) {
      this.setState({ metaExists: true });
    }
  };

  downloadFile = e => {
    const { type, idx } = e.currentTarget.attributes;

    const byteArray = getByteArray(this.props.message.fileData[idx.value]);
    const blob = new Blob([byteArray], {
      type: "application/octet-stream"
    });
    let filename = `chat_${this.guid}_${idx.value}.${type.value}`;

    saveAs(blob, filename);
  };

  renderMeta = () => {
    return this.state.meta.map(
      ({ title, description, imageUrl, url }, i) =>
        (title || description || imageUrl) && (
          <a
            className="message-anchor"
            key={`meta-${i}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ul className="meta-list">
              <hr></hr>
              {title && (
                <li>
                  <h5>{title}</h5>
                </li>
              )}
              {description && <li>{`${description.slice(0, 45)}...`}</li>}
              {imageUrl && (
                <li>
                  <img
                    ref={this.imageRef}
                    className="meta-img"
                    src={imageUrl}
                    alt="metaImg"
                  />
                </li>
              )}
            </ul>
          </a>
        )
    );
  };

  renderFiles = () => {
    return (
      <ImageList
        downloadFile={this.downloadFile}
        images={this.props.message.fileData}
      />
    );
  };

  renderCommonJsx = () => {
    const { dateSent, text, fileData } = this.props.message;
    let formattedText = text.split("\n").map((char, key) => {
      return (
        <span key={key}>
          {char}
          <br />
        </span>
      );
    });

    return (
      <div className="chat-content">
        <div className="box bg-light-info message">
          <Linkify>{formattedText}</Linkify>
          {fileData && this.renderFiles()}
          {this.state.meta.length > 0 && this.renderMeta()}
          <div className="message-date">
            {moment(dateSent).format("MM-DD-YYYY")}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {
      message: { id, recipient },
      activeContact
    } = this.props;

    if (recipient.id === activeContact.id) {
      return (
        <li key={`message-${id}`} className="chat-item odd">
          {this.renderCommonJsx()}
        </li>
      );
    } else {
      return (
        <li key={`message-${id}`} className="chat-item d-flex">
          <div className="chat-img">
            <Avatar src={activeContact.avatarUrl} />
          </div>
          <div className="pl-3">{this.renderCommonJsx()}</div>
        </li>
      );
    }
  }
}

Message.propTypes = {
  hubConnection: PropTypes.shape({
    on: PropTypes.func.isRequired,
    off: PropTypes.func.isRequired,
    invoke: PropTypes.func.isRequired
  }).isRequired,
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    urls: PropTypes.string,
    fileData: PropTypes.arrayOf(PropTypes.string),
    dateSent: PropTypes.string.isRequired,
    recipient: PropTypes.shape({ id: PropTypes.number })
  }).isRequired,
  activeContact: PropTypes.shape({
    id: PropTypes.number.isRequired,
    avatarUrl: PropTypes.string
  }),
  unsubscribe: PropTypes.func.isRequired,
  scroll: PropTypes.func.isRequired
};
