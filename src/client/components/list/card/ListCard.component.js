import React from 'react';
import {connect} from 'react-redux';
import TruncateMarkup from 'react-truncate-markup';
import ProfileImage from '../../general/ProfileImage.component';
import Link from '../../general/Link.component';
import toColor from '../../../utils/toColor';
import Text from '../../base/Text';
import Icon from '../../base/Icon';
import SkeletonText from '../../base/Skeleton/Text';
import SkeletonUser from '../../base/Skeleton/User';
import {createGetUserSelector} from '../../../redux/users';

import {FETCH_COMMENTS} from '../../../redux/comment.reducer';
import {LIST_LOAD_REQUEST} from '../../../redux/list.reducer';
import {createCountComments} from '../../../redux/selectors';

class ListCard extends React.Component {
  isSkeleton = props => {
    return props.skeleton || !props.list;
  };
  componentDidMount() {
    this.fetch();
  }
  componentDidUpdate() {
    this.fetch();
  }
  fetch() {
    if (this.fetched !== this.props._id && !this.props.skeleton) {
      this.props.loadList();
      this.fetched = this.props._id;
    }
    if (
      this.props.list &&
      !this.props.list.isLoading &&
      !this.commentsFetched
    ) {
      this.props.fetchComments(this.props._id);
      if (this.props.list.list) {
        this.props.list.list.forEach(el => {
          this.props.fetchComments(el._id);
        });
      }
      this.commentsFetched = true;
    }
  }

  renderBookCover(id, img) {
    return img ? (
      <img alt="" src={'v1/image/' + img + '/250/200'} />
    ) : (
      <div
        className="list-card-coverTemplate"
        style={{background: toColor(id), height: '100%'}}
      >
        <div className="list-card-brick" />
        <div className="list-card-brick" />
        <div className="list-card-brick" />
      </div>
    );
  }

  render() {
    const {list, style, className = '', commentCount} = this.props;
    const skeleton = this.props.skeleton || !list || list.isLoading;

    // if no elements detected, show skeleton cards
    if (skeleton) {
      return (
        <div className={'ListCard__skeleton pt1 mr1 ml1 ' + className}>
          <div className="ListCard__skeleton__cover" />
          <SkeletonText lines={3} color="#e9eaeb" />
          <SkeletonUser
            name={true}
            pulse={false}
            styles={{marginTop: '20px'}}
          />
        </div>
      );
    }

    return (
      <div className={'list-card mr1 ml1 ' + className} style={style}>
        <Link href={`/lister/${list._id}`}>
          <div className="list-card-wrap">
            <div className="list-card-cover">
              {this.renderBookCover(list._id, list.image)}
            </div>
            <div className="list-card-summary mt1">
              <TruncateMarkup lines={3}>
                <span>
                  <Text className="list-card-about mt0 mb0" type="large">
                    {list.title}
                  </Text>
                  <Text className="list-card-about mt0 mb0" type="body">
                    {list.description}
                  </Text>
                </span>
              </TruncateMarkup>
            </div>
            <div className="list-card-bottom">
              <ProfileImage
                key={'profile-img-' + list._id}
                user={this.props.profile}
                namePosition={'right'}
                type="list"
              />
              <div className="list-card-interactions">
                <span className="list-card-interaction">
                  <Icon className="md-small" name="chat_bubble_outline" /> (
                  {commentCount})
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}
const makeMapStateToProps = () => {
  const getUser = createGetUserSelector();
  const countComments = createCountComments();
  return (state, ownProps) => {
    const list = state.listReducer.lists[ownProps._id]; // selector not used, since the book expanded list is not needed
    if (!list || !list.list) {
      return {};
    }
    const ids = [list._id, ...list.list.map(e => e._id)];
    const isLoading = !list || list.isLoading;
    return {
      list,
      commentCount: countComments(state, {ids}),
      profile: !isLoading ? getUser(state, {id: list._owner}) : null,
      isLoading
    };
  };
};
export const mapDispatchToProps = (dispatch, ownProps) => ({
  loadList: () => dispatch({type: LIST_LOAD_REQUEST, _id: ownProps._id}),
  fetchComments: id => dispatch({type: FETCH_COMMENTS, id})
});

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(ListCard);
