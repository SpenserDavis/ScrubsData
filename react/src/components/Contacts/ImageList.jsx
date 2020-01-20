import React from "react";
import PropTypes from "prop-types";
import logger from "sabio-debug";
import FileIcon, { defaultStyles } from "react-file-icon";
import cuid from "cuid";
import { detectMimeType } from "./utils";
import { Button } from "reactstrap";

const _logger = logger.extend("ImageList");

const Image = ({ image, removeAttachment, idx }) => {
  return (
    <>
      <Button close onClick={removeAttachment} idx={idx} />
      <div className="file-item attachment">
        <img alt={`img-${image.id}`} src={image.src} className="file-img" />
      </div>
    </>
  );
};

const Base64Image = ({ image, type, downloadFile, idx }) => {
  return (
    <div className="file-item" idx={idx} type={type} onClick={downloadFile}>
      <img
        alt={`img-attachment`}
        src={`data:image/${type};base64,${image}`}
        className="file-img"
      />
    </div>
  );
};

const File = ({ type, downloadFile, removeAttachment, idx }) => {
  return (
    <>
      {removeAttachment && (
        <Button close onClick={removeAttachment} idx={idx} />
      )}
      <div className="file-item" idx={idx} type={type} onClick={downloadFile}>
        <FileIcon
          className="file-img"
          extension={type}
          {...defaultStyles[type]}
        />
      </div>
    </>
  );
};

const ImageList = ({
  images,
  isAttachment,
  downloadFile,
  removeAttachment
}) => {
  const renderImage = (image, i) => {
    _logger(image);
    let index = image.src.indexOf(";base64,");
    let base64String = image.src.slice(index + 8, image.src.length);
    const imageFormats = ["gif", "png", "jpg"];
    let mimeType = detectMimeType(base64String);
    if (imageFormats.includes(mimeType)) {
      return (
        <Image
          idx={i}
          removeAttachment={removeAttachment}
          image={image}
          key={`imageList-${image.id}`}
        />
      );
    } else {
      return (
        <File
          idx={i}
          removeAttachment={removeAttachment}
          type={mimeType}
          key={`imageList-${cuid()}`}
        />
      );
    }
  };

  const renderFiles = (base64String, i) => {
    const imageFormats = ["gif", "png", "jpg"];
    let mimeType = detectMimeType(base64String);
    if (imageFormats.includes(mimeType)) {
      return (
        <Base64Image
          downloadFile={downloadFile}
          image={base64String}
          type={mimeType}
          idx={i}
          key={`messageAttachment-${cuid()}`}
        />
      );
    } else {
      return (
        <File
          downloadFile={downloadFile}
          type={mimeType}
          idx={i}
          key={`messageAttachment-${cuid()}`}
        />
      );
    }
  };

  return (
    <section className="file-list">
      {isAttachment ? images.map(renderImage) : images.map(renderFiles)}
    </section>
  );
};

export default ImageList;

ImageList.propTypes = {
  images: PropTypes.instanceOf(Object),
  isAttachment: PropTypes.bool,
  downloadFile: PropTypes.func,
  removeAttachment: PropTypes.func
};
Image.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired
  }).isRequired,
  removeAttachment: PropTypes.func,
  idx: PropTypes.number.isRequired
};
Base64Image.propTypes = {
  image: PropTypes.string.isRequired,
  type: PropTypes.string,
  downloadFile: PropTypes.func,
  idx: PropTypes.number.isRequired
};

File.propTypes = {
  type: PropTypes.string,
  downloadFile: PropTypes.func,
  idx: PropTypes.number.isRequired,
  removeAttachment: PropTypes.func
};
