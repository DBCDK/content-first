import React from 'react';
import Spinner from './Spinner.component';
import HoverImage from './HoverImage.component';
import T from '../base/T';

const UploadButton = ({
												fieldName,
												readFiles,
												baseImage,
												thumbnailImageHover
											}) => {
	return (
		<label>
			{baseImage && (
				<HoverImage src={baseImage} mouseOver={thumbnailImageHover} />
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
				name.toUpperCase() +
				T({component: 'profile', name: 'profilePictureTooLarge'});
		}
	}
	if (error.status === 400) {
		if (name) {
			retText =
				name.toUpperCase() +
				T({component: 'profile', name: 'saveProfilePictureError'});
		}
	}
	if (!error.status || error.status === 500) {
		if (name) {
			retText =
				name.toUpperCase() +
				T({component: 'profile', name: 'saveProfileGeneralPictureError'});
		}
	}
	return retText;
};

export default class ProfileUploadImage extends React.Component {
	readFiles = e => {
		const {files} = e.target;
		if (files && files[0]) {
			if (this.props.activateSaveButton) {
				this.props.activateSaveButton();
			}
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
			<div className="profile-picture">
				<div className="image-upload">
					<div className="image-upload-loader">
						{(this.props.loading && (
							<Spinner className="profile__spinner" />
						)) || (
							<UploadButton
								fieldName={this.props.fieldName}
								readFiles={this.readFiles}
								baseImage={baseImage}
								thumbnailImageHover={this.props.thumbnailImageHover}
							/>
						)}
					</div>
					<div style={{clear: 'both'}} />
					<div className="profile__image-errors">
						<Error error={this.props.error} name={this.state.imageName} />
					</div>
				</div>
			</div>
		);
	}
}