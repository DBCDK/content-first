import React from 'react';
import Spinner from './Spinner.component';
import HoverButton from './HoverButton.component';

const UploadButton = ({
  fieldName,
  readFiles,
  baseImage,
  thumbnailImageHover
}) => {
  return (
    <label>
      {baseImage && (
        <HoverButton
          src={baseImage}
          mouseOver={thumbnailImageHover}
          mouseOut={baseImage}
        />
      )}
      <input
        accept="image/png, image/jpeg"
        type="file"
        className="droppable-image-field--file-input"
        name={fieldName}
        onChange={readFiles}
      />
    </label>
  );
};

const Error = ({error, name}) => {
  let retText = '';
  if (!error) {
    return null;
  }
  if (error.status === 413) {
    if (name) {
      retText =
        name.toUpperCase() + ' er for stor. Billedet må maks fylde 10mb';
    }
  }
  if (error.status === 400) {
    if (name) {
      retText =
        name.toUpperCase() +
        ' er ikke et gyldigt billede. Upload en gyldig png eller jpg.';
    }
  }
  if (!error.status || error.status === 500) {
    if (name) {
      retText =
        'Der er sket en fejl. ' + name.toUpperCase() + ' kan ikke uploades.';
    }
  }
  return retText;
};

export default class ProfileUploadImage extends React.Component {
  readFiles = e => {
    const {files} = e.target;
    if (files && files[0]) {
      this.setState({imageName: files[0].name});
      this.props.onFile(files[0]);
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      imageName: null,
      basePictureDefault: false,
      tempPictureLoaded: false,
      savedPictureLoaded: true
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading !== this.props.loading) {
      this.setState({
        basePictureDefault:
          !this.props.tempPersonalImage && !this.props.personalImage
            ? true
            : false,
        tempPictureLoaded:
          this.props.tempPersonalImage && this.props.personalImage
            ? true
            : false,
        savedPictureLoaded:
          !this.props.tempPersonalImage && this.props.personalImage
            ? true
            : false
      });
    }
  }

  componentDidMount() {
    this.setState({
      basePictureDefault:
        !this.props.tempPersonalImage && !this.props.personalImage
          ? true
          : false,
      tempPictureLoaded:
        this.props.tempPersonalImage && this.props.personalImage ? true : false,
      savedPictureLoaded:
        !this.props.tempPersonalImage && this.props.personalImage ? true : false
    });
  }

  render() {
    let baseImage;

    if (this.state.savedPictureLoaded) {
      baseImage = this.props.personalImage;
    }
    if (this.state.tempPictureLoaded) {
      baseImage = this.props.tempPersonalImage;
    }
    if (this.state.basePictureDefault) {
      baseImage = this.props.thumbnailImage;
    }
    return (
      <div>
        <div
          className="profile-picture"
          style={{
            width: '57px',
            paddingTop: '12px'
          }}
        >
          <div className={'image-upload ' + this.props.className}>
            <div
              style={{
                width: '46px',
                height: '46px',
                overflow: 'hidden',
                ...this.props.style
              }}
            >
              {(this.props.loading && (
                <Spinner className="profile__spinner" />
              )) || (
                <div>
                  <UploadButton
                    fieldName={this.props.fieldName}
                    readFiles={this.readFiles}
                    baseImage={baseImage}
                    thumbnailImageHover={this.props.thumbnailImageHover}
                  />
                </div>
              )}
            </div>
            <div style={{clear: 'both'}} />
            <div className="profile__image-errors">
              <Error error={this.props.error} name={this.state.imageName} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
