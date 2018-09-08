import React from 'react';
import Spinner from './Spinner.component';
import Button from '../base/Button';
import Icon from '../base/Icon';

const UploadButton = ({buttonText, fieldName, readFiles, style, className}) => (
  <label style={style} clasName={className}>
    <Button type="tertiary" size="medium" Tag="span">
      <Icon name="photo" className="align-middle" />
      <span className="align-middle ml-2">
        {buttonText || 'Upload billede'}
      </span>
    </Button>
    <input
      accept="image/png, image/jpeg"
      type="file"
      className="droppable-image-field--file-input"
      name={fieldName}
      onChange={readFiles}
    />
  </label>
);
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
          className="image-upload--zone position-relative"
          style={{
            width: '150px',
            height: '150px',
            overflow: 'hidden',
            ...this.props.style
          }}
        >
          {this.props.loading && (
            <Spinner
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                margin: 'auto'
              }}
              size="50px"
            />
          )}
          {(this.props.previewImage && (
            <div>
              {this.props.children}
              <img
                onLoad={this.props.handleLoaded}
                src={this.props.previewImage}
                alt="User profile"
                className="preview-img w-100"
                style={{opacity: this.props.loading ? 0.2 : 1}}
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
          {this.props.buttonPosition === 'inside' && (
            <UploadButton
              buttonText={this.props.buttonText}
              fieldName={this.props.fieldName}
              readFiles={this.readFiles}
              style={{position: 'absolute', bottom: 5, left: 10}}
            />
          )}
        </div>
        <div style={{clear: 'both'}} />
        {this.props.buttonPosition !== 'inside' && (
          <UploadButton
            buttonText={this.props.buttonText}
            fieldName={this.props.fieldName}
            readFiles={this.readFiles}
          />
        )}
        <Error error={this.props.error} name={this.state.imageName} />
      </div>
    );
  }
}
