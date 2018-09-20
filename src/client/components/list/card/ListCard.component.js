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

import {FETCH_COMMENTS} from '../../../redux/comment.reducer';

class ListCard extends React.Component {
  componentWillMount() {
    if (!this.props.skeleton) {
      this.updateComments();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.skeleton !== this.props.skeleton) {
      this.updateComments();
    }
  }

  updateComments() {
    this.props.fetchComments(this.props.list._id);

    if (this.props.list.list && this.props.list.list.length > 0) {
      this.props.list.list.forEach(el => {
        this.props.fetchComments(el._key + '-' + el.pid);
      });
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
    const {list, style, skeleton, className = ''} = this.props;
    let commentCount = 0;

    // if skelleton component is false - count comments
    if (!this.props.skeleton) {
      if (
        this.props.comments &&
        this.props.comments[list._id] &&
        this.props.comments[list._id].comments
      ) {
        // count comments for list
        commentCount = this.props.comments[list._id].comments.length;
        if (this.props.list.list && this.props.list.list.length > 0) {
          this.props.list.list.forEach(el => {
            const elementComments = this.props.comments[el._key + '-' + el.pid];
            if (elementComments && elementComments.comments) {
              // count comments for books in list
              commentCount += elementComments.comments.length;
            }
          });
        }
      }
    }

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

const mapStateToProps = state => ({
  comments: state.comments
});

export const mapDispatchToProps = dispatch => ({
  fetchComments: id => dispatch({type: FETCH_COMMENTS, id})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListCard);
