import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Avatar extends Component {
  constructor(props) {
    super(props);
    this.state = { didImageFail: false };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.src !== this.props.src) {
      this.setState({ didImageFail: false });
    }
  }

  handleFailedImageLoad = () => {
    this.setState({
      didImageFail: true
    });
  };

  getProperSource = src => {
    let anon =
      "https://www.pngfind.com/pngs/m/42-428449_anonymous-avatar-face-book-hd-png-download.png";
    if (!src) {
      return anon;
    } else {
      if (this.state.didImageFail) {
        return anon;
      } else {
        return this.props.src;
      }
    }
  };

  render() {
    return (
      <img
        src={this.getProperSource(this.props.src)}
        onError={this.handleFailedImageLoad}
        alt="avatar"
        {...this.props.styles}
      />
    );
  }
}

Avatar.propTypes = {
  src: PropTypes.string,
  styles: PropTypes.shape({})
};
