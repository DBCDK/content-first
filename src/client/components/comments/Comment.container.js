import React from 'react';
import {connect} from 'react-redux';
import {ADD_COMMENT, FETCH_COMMENTS} from '../../redux/comment.reducer';

class CommentContainer extends React.Component {
  componentWillMount() {
    this.props.fetchComments(this.props.id);
    this.props.addComment('Dette er en kommentar', this.props.id);
  }
  render() {
    console.log(this.props.comments);
    return <div />;
  }
}

const mapStateToProps = (state, ownProps) => ({
  comments: Object.assign({loading: true}, state.commentReducer[ownProps.id])
});

export const mapDispatchToProps = dispatch => ({
  addComment: (comment, id) => dispatch({type: ADD_COMMENT, comment, id}),
  fetchComments: id => dispatch({type: FETCH_COMMENTS, id})
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentContainer);
