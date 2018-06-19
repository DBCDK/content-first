import React from 'react';
import {connect} from 'react-redux';
import {TAGID_REQUEST} from '../../redux/tagId';
import BooksBelt from './BooksBelt.container';

export class RecommendationsBelt extends React.Component {
  constructor() {
    super();
    this.state = {loadTags: true};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.recoPids.length > 0 && this.state.loadTags) {
      this.props.getTags(nextProps.recoPids);
      this.setState({loadTags: false});
    }
  }

  render() {
    if (this.props.tagIds.length > 0) {
      return (
        <div>
          <BooksBelt
            title={'Bedste forslag'}
            subtext={'især for ' + this.props.username}
            tags={this.props.tagIds}
          />
        </div>
      );
    } else {
      return <div />;
    }
  }
}

const mapStateToProps = state => {
  return {
    recoPids: state.interactionReducer.interactions.map(o => {
      return o.pid;
    }),
    tagIds: state.tagIdReducer.tags,
    username: state.userReducer.name
  };
};

export const mapDispatchToProps = dispatch => ({
  getTags: pids =>
    dispatch({
      type: TAGID_REQUEST,
      pids
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(
  RecommendationsBelt
);
