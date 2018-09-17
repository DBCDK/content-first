import React from 'react';
import {connect} from 'react-redux';
import {getFollowedLists} from '../../redux/selectors';

import ListItem from '../list/overview/ListItem.component.js';

export class Follow extends React.Component {
  render() {
    return (
      <div className="follow-lists">
        <div className="mb3">
          <h4>Lister som du følger: </h4>
          {this.props.followedLists.map(data => {
            return (
              <ListItem
                list={data.list}
                title={data.title}
                id={data.id}
                key={data.id}
                type={data.type}
                image={data.image ? `/v1/image/${data.image}/50/50` : null}
                hideIfEmpty={false}
              />
            );
          })}
          {this.props.followedLists.length === 0 ? (
            <div>
              <h6>Du følger i øjeblikket ingen lister</h6>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    followedLists: getFollowedLists(state)
  };
};

export default connect(mapStateToProps)(Follow);
