import React from 'react';
import Spinner from '../general/Spinner.component';
import timeToString from '../../utils/timeToString';
import CommentUserImage from './CommentUserImage.component';

export default class CommentList extends React.Component {
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
          {showComments.map(
            ({comment, _id, saving, _created = Date.now() / 1000}) => (
              <div key={_id} className="comment-wrapper">
                {saving ? (
                  <div className="comment-saving">
                    <Spinner size="30px" />
                  </div>
                ) : (
                  ''
                )}
                <div className="flex mb2" style={{width: '100%'}}>
                  <CommentUserImage
                    user={{name: 'Benny Cosmos'}}
                    style={{flexShrink: 0}}
                  />
                  <div className="ml2" style={{flexGrow: 1}}>
                    <div className="comment-author">Benny Cosmos</div>
                    <div className="comment-time mb1">
                      {timeToString(_created)}
                    </div>
                    <div className="comment">{comment}</div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }
}
