import React from 'react';
import Spinner from './Spinner.component';

const Error = ({error, name}) => {
  if (!error) {
    return null;
  }
  if (error.status === 413) {
    return (
      <div className="error">
        {name} er for stor. Billedet må maks fylde 10mb
      </div>
    );
  }
  if (error.status === 400) {
    return (
      <div className="error">
        {name} er ikke et gyldigt billede. Upload en gyldig png eller jpg.
      </div>
    );
  }
  if (!error.status || error.status === 500) {
    return (
      <div className="error">
        Der er sket en fejl. {name.toUpperCase()} kan ikke uploades.
      </div>
    );
  }
};

export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageName: null
    };
  }
  readFiles = e => {
    const {files} = e.target;
    if (files && files[0]) {
      this.setState({imageName: files[0].name});
      this.props.onFile(files[0]);
    }
  };

  render() {
    return (
      <div className={'image-upload ' + this.props.className}>
        <div
          className="image-upload--zone"
          style={{
            width: '150px',
            height: '150px',
            overflow: 'hidden',
            ...this.props.style
          }}
        >
          {(this.props.loading && <Spinner />) ||
            (this.props.previewImage && (
              <div>
                {this.props.children}
                <img
                  onLoad={this.props.handleLoaded}
                  src={this.props.previewImage}
                  alt="User profile"
                  className="preview-img"
                />
              </div>
            )) || (
              <div className="d-flex align-items-center justify-content-center h-100 ">
                <i className="material-icons" style={{fontSize: 100}}>
                  image
                </i>
              </div>
            )}
          <div className="droppable-image-overlay">
            {this.props.overlayText || ''}
          </div>
        </div>
        <div style={{clear: 'both'}} />
        <label>
          <span className="btn btn-primary mt1">
            {this.props.buttonText || 'Upload billede'}
          </span>
          <Error error={this.props.error} name={this.state.imageName} />
          <input
            accept="image/png, image/jpeg"
            type="file"
            className="droppable-image-field--file-input"
            name={this.props.fieldName}
            onChange={this.readFiles}
          />
        </label>
      </div>
    );
  }
}
