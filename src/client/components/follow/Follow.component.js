import React from 'react';
import {connect} from 'react-redux';
import {createGetFollowedLists} from '../../redux/selectors';
import T from '../base/T';

import ListItem from '../list/overview/ListItem.component.js';

export class Follow extends React.Component {
  render() {
    return (
      <div className="follow-lists">
        <div className="mb3">
          <h4>
            <T component="list" name="followLists" />
          </h4>
          {this.props.followedLists.map(data => {
            return (
              <ListItem
                list={data.list}
                title={data.title}
                _id={data._id}
                key={data._id}
                type={data.type}
                image={data.image ? `/v1/image/${data.image}/50/50` : null}
                hideIfEmpty={false}
              />
            );
          })}
          {this.props.followedLists.length === 0 ? (
            <div>
              <h6>
                <T component="list" name="noFollowLists" />
              </h6>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}

const getFollowedLists = createGetFollowedLists();
const mapStateToProps = state => {
  return {
    followedLists: getFollowedLists(state)
  };
};

export default connect(mapStateToProps)(Follow);
