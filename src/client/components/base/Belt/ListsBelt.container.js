import React from 'react';
import {connect} from 'react-redux';
import {get} from 'lodash';
import withIsVisible from '../../hoc/Scroll/withIsVisible.hoc';
import {withListAggregation} from '../../hoc/Aggregation';
import ListCard from '../../list/card/ListCard.component';
import {UPDATE_MOUNT} from '../../../redux/mounts.reducer';
import Title from '../Title';
import Slider from './Slider.component';

import './ListsBelt.css';

/**
 *
 * ListsBelt
 *
 * @param {string} sort 'num_items' (default) | 'num_follows' | 'num_comments' | '_created' | '_modified'
 * @param {string} title - belt title
 * @param {int} limit - limit results
 * @param {string} pid - lists containing specific pid
 * @return {Component}
 **/

export class ListsBelt extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.lists.length !== this.props.lists.length ||
      this.props.isVisible !== nextProps.isVisible ||
      this.props.title !== nextProps.title ||
      this.props.mountedData.scrollPos !== nextProps.mountedData.scrollPos
    );
  }

  getListsPerSlide = () => {
    const containerWidth = get(this.refs, 'container.clientWidth', 800);
    const workCardWidth = get(this.refs, 'workCard.clientWidth', 200);
    const resultsPerRow = Math.floor(containerWidth / workCardWidth);
    return resultsPerRow;
  };

  render() {
    const {lists, title = 'Title....', isVisible, mountedData} = this.props;
    const {didSwipe = false, scrollPos = 0} = mountedData;

    if (lists.length === 0) {
      return null;
    }

    const listsPerSlide = this.getListsPerSlide();
    const matomoTitle = this.props.matomoTitle || 'list-belt';

    console.log('title', title);

    return (
      <div
        className="lists-belt"
        ref={container => (this.refs = {...this.refs, container})}
        data-cy="lists-belt"
      >
        <Title
          Tag="h1"
          type="title4"
          variant="transform-uppercase"
          className="lists-belt__title"
        >
          {title}
        </Title>
        <Slider
          {...this.props}
          name="listbelt"
          initialScrollPos={scrollPos}
          onSwipe={index =>
            this.props.updateMount({
              didSwipe: true,
              scrollPos: index,
              beltName: matomoTitle
            })
          }
        >
          {lists.map((list, i) => {
            return (
              <ListCard
                cardRef={card => (this.refs = {...this.refs, card})}
                isVisible={
                  didSwipe || (isVisible && i < scrollPos + listsPerSlide * 2)
                }
                key={list._id}
                id={list._id}
                list={list}
                onClick={() => {
                  this.props.updateMount({
                    type: 'LIST_VISIT',
                    beltName: matomoTitle,
                    listId: list._id
                  });
                }}
              />
            );
          })}
        </Slider>
      </div>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  return {
    notInUse_lists: state.listReducer.lists,
    mountedData: state.mounts[ownProps.mount] || {scrollPos: 0, didSwipe: false}
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateMount: data => {
    dispatch({
      type: UPDATE_MOUNT,
      mount: ownProps.mount,
      data
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withListAggregation(withIsVisible(ListsBelt)));
