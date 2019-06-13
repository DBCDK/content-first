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
import Divider from '../../base/Divider';
import {createGetUserSelector} from '../../../redux/users';

import {FETCH_COMMENTS} from '../../../redux/comment.reducer';
import {createCountComments} from '../../../redux/selectors';

import {withList, withLists} from '../../hoc/List';

import './ListCard.css';

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
    if (
      this.props.list &&
      this.props.list._id &&
      !this.props.list.isLoading &&
      !this.commentsFetched
    ) {
      // this.props.fetchComments(this.props.list._id);
      // if (this.props.list.list) {
      //   this.props.list.list.forEach(el => {
      //     this.props.fetchComments(el._id);
      //   });
      // }
      this.commentsFetched = true;
    }
  }

  renderBookCover(id, img) {
    const POSITIONS = [
      'align-self-start',
      'align-self-center',
      'align-self-end'
    ];
    const SIZES = [
      'list-card-brick-sm',
      'list-card-brick-md',
      'list-card-brick-lg'
    ];
    return img ? (
      <img alt="" src={'v1/image/' + img + '/250/200'} />
    ) : (
      <div
        className="list-card-coverTemplate"
        style={{background: toColor(id), height: '100%'}}
      >
        <div
          className={`list-card-brick ${toColor(
            id + 'size-0',
            SIZES
          )} ${toColor(id + 'pos-0', POSITIONS)}`}
        />
        <div
          className={`list-card-brick ${toColor(
            id + 'size-1',
            SIZES
          )} ${toColor(id + 'pos-1', POSITIONS)}`}
        />
        <div
          className={`list-card-brick ${toColor(
            id + 'size-2',
            SIZES
          )} ${toColor(id + 'pos-2', POSITIONS)}`}
        />
      </div>
    );
  }

  render() {
    const {list, style, className = '', commentCount} = this.props;
    const skeleton = this.props.skeleton || !list || list.isLoading;

    // if no elements detected, show skeleton cards
    if (skeleton) {
      return (
        <div className={'ListCard__skeleton p-0 mr-4 ' + className}>
          <div className="ListCard__skeleton__cover" />
          <div className="p-3">
            <SkeletonText lines={3} color="#e9eaeb" />
            <SkeletonUser
              name={true}
              pulse={false}
              styles={{marginTop: '20px'}}
            />
          </div>
        </div>
      );
    }

    return (
      <div className={'list-card mr-4 align-top ' + className} style={style}>
        <Link href={`/lister/${list._id}`}>
          <div className="list-card-wrap">
            <div className="list-card-cover">
              {this.renderBookCover(list._id, list.image)}
            </div>
            <div className="p-3">
              <div className="list-card-summary">
                <TruncateMarkup lines={3}>
                  <span>
                    <Text className="list-card-about mb-1" type="large">
                      {list.title}
                    </Text>
                    <Text className="list-card-about" type="body">
                      {list.description}
                    </Text>
                  </span>
                </TruncateMarkup>
              </div>
              {/* <Divider variant="thin" /> */}
              <div className="list-card-bottom">
                {/* <ProfileImage
                  key={'profile-img-' + list._id}
                  user={this.props.profile}
                  namePosition={'right'}
                  type="list"
                />

                <div className="d-flex align-self-center">
                  <Divider
                    type="vertical"
                    variant="thick"
                    className="align-self-center mx-2"
                    style={{height: 30}}
                  />
                  <div className="list-card-interactions align-self-center">
                    <Icon
                      className="md-small"
                      name="chat_bubble_outline"
                      style={{paddingTop: 3}}
                    />
                    <Text className="ml-2" type="body">
                      <strong>{commentCount}</strong>
                    </Text>
                  </div>
                </div> */}
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
    const list = ownProps.list;
    if (!list || !list.list) {
      return {};
    }
    const ids = [list._id, ...list.list.map(e => e._id)];
    const isLoading = !list || list.isLoading;
    return {
      commentCount: countComments(state, {ids}),
      profile: !isLoading ? getUser(state, {id: list._owner}) : null,
      isLoading
    };
  };
};

export const mapDispatchToProps = dispatch => ({
  fetchComments: id => dispatch({type: FETCH_COMMENTS, id})
});

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(ListCard);
