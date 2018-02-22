import React from 'react';
import {connect} from 'react-redux';
import {ADD_COMMENT, FETCH_COMMENTS} from '../../redux/comment.reducer';
import Textarea from 'react-textarea-autosize';
import {Likes, Comments, Badge} from '../general/Icons';

const UserImage = ({size = '35', user, style}) => {
  return (
    <span
      className="profile-image small round"
      style={{...style, width: `${size}px`, height: `${size}px`}}
    >
      {user.image ? (
        <img
          className="cover"
          src={`/v1/image/${user.image}/200/200`}
          alt={user.name}
        />
      ) : (
        <span
          className="glyphicon glyphicon-user"
          style={{fontSize: `${size / 2}px`}}
        />
      )}
    </span>
  );
};

class CommentInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      focus: false
    };
  }

  onSubmit = () => {
    this.props.onSubmit(this.state.value);
    this.setState({value: ''});
  };

  render() {
    return (
      <div
        style={{
          display: 'flex'
        }}
      >
        <UserImage user={this.props.user} />{' '}
        <div
          style={{width: '100%'}}
          className="ml2"
          onFocus={() => {
            this.setState({focus: true});
          }}
        >
          <Textarea
            className="form-control mb1"
            name="list-description"
            placeholder="Skriv kommentar"
            onChange={e => this.setState({value: e.target.value})}
            onBlur={() => {
              this.setState({focus: false});
            }}
            value={this.state.value}
          />
          <div
            className="tr"
            style={{
              height: this.state.focus || this.state.value ? '35px' : '0px',
              opacity: this.state.focus || this.state.value ? 1 : 0,
              overflow: 'hidden',
              transition: 'height 200ms, opacity 200ms'
            }}
          >
            <button className="btn btn-success" onClick={this.onSubmit}>
              Kommentér
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: null
    };
  }
  componentDidUpdate() {
    if (
      this.listWrapper &&
      this.listWrapper.offsetHeight &&
      this.state.height !== this.listWrapper.offsetHeight
    ) {
      this.setState({height: this.listWrapper.offsetHeight});
    }
  }

  render() {
    const {comments, showCount = 1} = this.props;
    if (!comments || comments.length === 0) {
      return null;
    }

    const showComments = comments.slice(-showCount);
    return (
      <div
        style={{
          overflow: 'hidden',
          height: this.state.height,
          transition: 'height 500ms'
        }}
      >
        <div ref={el => (this.listWrapper = el)}>
          {showComments.map(({comment, id}) => (
            <div key={id}>
              <div className="flex mb2" style={{width: '100%'}}>
                <UserImage
                  user={{name: 'Benny Cosmos'}}
                  style={{flexShrink: 0}}
                />
                <div className="ml2" style={{flexGrow: 1}}>
                  <div className="comment-author">Benny Cosmos</div>
                  <div className="comment-time mb1">2 timer</div>
                  <div className="comment">{comment}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

class CommentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCount: 1,
      showAll: false
    };
  }
  componentWillMount() {
    this.props.fetchComments(this.props.id);
  }
  onSubmit = comment => {
    this.props.addComment(this.props.id, comment);
    this.setState({showCount: ++this.state.showCount});
  };
  render() {
    return (
      <div className="comments">
        <CommentList
          comments={this.props.comments.comments}
          showCount={
            this.state.showAll
              ? this.props.comments.comments.length
              : this.state.showCount
          }
        />
        <button
          onClick={() => this.setState({showAll: !this.state.showAll})}
          style={{marginLeft: 55, position: 'relative', paddingLeft: 0}}
          className="btn btn-link mt1 mb1 link-subtle"
        >
          <Comments
            value={
              this.props.comments.comments
                ? this.props.comments.comments.length
                : ''
            }
          />
          <span className="ml1">
            {!this.state.showAll
              ? 'Vis alle kommentarer'
              : 'Vis færre kommentarer'}
          </span>
        </button>
        <CommentInput user={this.props.user} onSubmit={this.onSubmit} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  comments: Object.assign({loading: true}, state.commentReducer[ownProps.id])
});

export const mapDispatchToProps = dispatch => ({
  addComment: (id, comment) => dispatch({type: ADD_COMMENT, comment, id}),
  fetchComments: id => dispatch({type: FETCH_COMMENTS, id})
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentContainer);
