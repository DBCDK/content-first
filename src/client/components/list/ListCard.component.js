import React from 'react';
import {connect} from 'react-redux';
import TruncateMarkup from 'react-truncate-markup';
import BookCover from '../general/BookCover.component';
import ProfileImage from '../general/ProfileImage.component';
import {Badge} from '../general/Icons';
import Link from '../general/Link.component';
import Heading from '../base/Heading';
import Icon from '../base/Icon';
import SkeletonText from '../base/Skeleton/Text';
import SkeletonUser from '../base/Skeleton/User';

import {FETCH_COMMENTS} from '../../redux/comment.reducer';

class ListCard extends React.PureComponent {
  componentWillMount() {
    this.props.fetchComments(this.props.list.id);

    if (this.props.list.list && this.props.list.list.length > 0) {
      this.props.list.list.forEach(el => {
        this.props.fetchComments(el._key + '-' + el.book.pid);
      });
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps.list.list);
  //   if (nextProps.list.list && this.props.list.list !== nextProps.list.list) {
  //     console.log('npl', nextProps.list.list);
  //   }
  // }

  renderBookCover(id, img) {
    return img ? (
      <img alt="" src={'v1/image/' + img + '/250/200'} />
    ) : (
      <div
        className="list-card-coverTemplate"
        style={{background: id.toColor(), height: '100%'}}
      >
        <div className="list-card-brick" />
        <div className="list-card-brick" />
        <div className="list-card-brick" />
      </div>
    );
  }

  render() {
    const {list, style, className = ''} = this.props;
    const elements = list.list || false;

    let commentCount = 0;
    if (
      this.props.comments &&
      this.props.comments[list.id] &&
      this.props.comments[list.id].comments
    ) {
      // count comments for list
      commentCount = this.props.comments[list.id].comments.length;
      if (this.props.list.list && this.props.list.list.length > 0) {
        this.props.list.list.forEach(el => {
          if (this.props.comments[el._key + '-' + el.book.pid].comments) {
            // count comments for books in list
            commentCount += this.props.comments[el._key + '-' + el.book.pid]
              .comments.length;
          }
        });
      }
    }

    //const elements = false;

    if (!elements) {
      return (
        <div
          className={'ListCard__skeleton col-xs-12 pt1 mr1 ml1 ' + className}
        >
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
      <Link href={`/lister/${list.id}`}>
        <div className="list-card col-xs-12 pt1 mr1 ml1" style={style}>
          <div className="list-card-cover">
            {this.renderBookCover(list.id, list.image)}
          </div>
          <div className="list-card-summary">
            <Heading className="list-card-about mt2 mb1" Tag="h3" type="title">
              <TruncateMarkup lines={3}>
                <strong>
                  <div className="list-card-title">{list.title}</div>
                  <div className="list-card-description">
                    {list.description}
                  </div>
                </strong>
              </TruncateMarkup>
            </Heading>
          </div>
          <div className="list-card-bottom">
            <ProfileImage
              user={this.props.profile}
              namePosition={'right'}
              type="list"
            />
            <div className="list-card-interactions">
              <span className="list-card-interaction">
                <Icon name="book" /> ({elements.length})
              </span>
              <span className="list-card-interaction">
                <Icon name="heart" /> ({commentCount})
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  comments: state.comments
});

export const mapDispatchToProps = dispatch => ({
  fetchComments: id => dispatch({type: FETCH_COMMENTS, id})
});

export default connect(mapStateToProps, mapDispatchToProps)(ListCard);
