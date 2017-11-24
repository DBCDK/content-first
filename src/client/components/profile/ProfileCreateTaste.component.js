import React from 'react';
import {ON_PROFILE_CREATE_TASTE, ON_PROFILE_SELECT_TASTE} from '../../redux/profile.reducer';

class ProfileCreateTaste extends React.Component {
  constructor() {
    super();
    this.state = {
      tastyName: ''
    };
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.dispatch({type: ON_PROFILE_CREATE_TASTE, name: this.state.tastyName});
  }
  getImagesFromBelt(beltName, profile) {
    return this.props.belts[beltName].filter(({label}) => profile[beltName].includes(label)).map(({image}) => image);
  }
  getTasteCardBackground(taste) {
    const profile = this.props.profiles[taste];
    const images = [
      ...this.getImagesFromBelt('genres', profile),
      ...this.getImagesFromBelt('moods', profile),
      ...this.getImagesFromBelt('authors', profile)
    ];
    if (images.length < 4) {
      return images.slice(0, 1);
    }
    return images.slice(0, 4);
  }

  renderImages (taste) {
    const images = this.getTasteCardBackground(taste);
    if (images.length > 1) {
      return (
        <div className="card-background flex-grid flex-grid-2 square closed">
          {images.map(image => (
            <div key={image}>
              <div className="card-image">
                <img src={image} alt={taste} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="card-background">
        <img src={images[0]} alt={taste} />
      </div>
    );
  }
  renderTaste(taste) {

    return (<div className="card" key={taste} onClick={() => this.props.dispatch({type: ON_PROFILE_SELECT_TASTE, name: taste})}>
      <div className="card-container">
        {this.renderImages(taste)}
        <span className="card-label">{taste}</span>
      </div>
    </div>
    );
  }

  renderTasteGroup(profiles) {
    const tastes = Object.keys(profiles);
    if (tastes.length > 0) {
      return (
        <div>
          <h2>Mine smagsprofiler</h2>
          <div className="flex-grid flex-grid-8 flex-grid-6-m square">
            {Object.keys(this.props.profiles).map(taste => this.renderTaste(taste))}
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="profile-create">
        <h2>Opret en smagsprofil</h2>
        <form className="form-inline text-center" action="" onSubmit={e => this.onSubmit(e)}>
          <input className="form-control" name="tastyName" value={this.state.tastyName} placeholder="Opret en smagsprofil"
            onChange={e => this.setState({tastyName: e.currentTarget.value})} />
          <input className="btn btn-primary" type="submit" value="Opret smagsprofil" />
        </form>
        {this.renderTasteGroup(this.props.profiles)}
      </div>
    );
  }
}
export default ProfileCreateTaste;
