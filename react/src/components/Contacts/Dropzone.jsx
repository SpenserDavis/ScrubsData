import React from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";

const Dropzone = ({ onDrop, accept }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept
  });

  const getClassName = (className, isActive) => {
    if (!isActive) return className;
    return `${className} ${className}-active`;
  };

  return (
    <div className={getClassName("dropzone", isDragActive)} {...getRootProps()}>
      <input className="dropzone-input" {...getInputProps()} />
      <div className="text-center">
        {isDragActive ? (
          <p className="dropzone-content">Release to drop the files here</p>
        ) : (
          <p className="dropzone-content">
            {"Drag 'n' drop some files here, or click to select files"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Dropzone;

Dropzone.propTypes = { onDrop: PropTypes.func, accept: PropTypes.func };
