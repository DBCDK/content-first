import React from 'react';
import TruncateMarkup from 'react-truncate-markup';
import ProfileImage from '../../general/ProfileImage.component';
import SkeletonText from '../../base/Skeleton/Text';
import SkeletonUser from '../../base/Skeleton/User';
import Link from '../../general/Link.component';
import toColor from '../../../utils/toColor';
import Text from '../../base/Text';
import Icon from '../../base/Icon';
import Divider from '../../base/Divider';

import './ListCard.css';

class ListCard extends React.Component {
  hasOwner = () => {
    const list = this.props.list;
    return !!(list && list.owner && list.owner.name);
  };

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
      <img alt="" src={'/v1/image/' + img + '/250/200'} />
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
    const {list, cardRef, isVisible, style, className = ''} = this.props;

    // if not visible, show skeletons
    if (!isVisible) {
      return (
        <div
          className={'ListCard__skeleton p-0 mr-4 ' + className}
          ref={cardRef}
        >
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
              {this.hasOwner() && <Divider variant="thin" />}
              <div className="list-card-bottom">
                {this.hasOwner() && (
                  <React.Fragment>
                    <ProfileImage
                      key={'profile-img-' + list._id}
                      user={list.owner}
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
                          <strong>{list.num_comments}</strong>
                        </Text>
                      </div>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

export default ListCard;
