import React from 'react';
import Kryds from '../svg/Kryds.svg';

export default class Modal extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.show !== this.props.show) {
      if (nextProps.show) {
        this.bodyScrollTop = document.body.scrollTop;
        this.documentElementScrollTop = document.documentElement.scrollTop;
        // document.body.classList.add('modal-open'); // super slow on ipad safari
        // document.body.setAttribute('style', 'position:fixed; overflow-y: hidden; top: 0; bottom: 0; left: 0; right: 0;'); // super slow on ipad safari
        document.body.setAttribute('style', 'position:fixed; top: 0; bottom: 0; left: 0; right: 0;');

      }
      else {
        document.body.setAttribute('style', '');
        document.body.scrollTop = this.bodyScrollTop;
        document.documentElement.scrollTop = this.documentElementScrollTop;
      }
    }
  }

  render() {
    const hidden = this.props.show ? '' : ' modal-hidden';
    const {doneText='OK'} = this.props;

    return (
      <div className={`modal-backdrop${hidden}`}>
        <div className={`modal-window text-left${hidden} ${this.props.className ? this.props.className : ''}`}>
          <img src={Kryds} alt="luk" className="modal-window--close-btn" onClick={this.props.onClose}/>
          <div className="modal-window--header text-center"><h3>{this.props.header}</h3></div>
          <div className="modal-window--content">
            {this.props.children}
          </div>
          <div className="modal-window--buttons text-center">
            <span className="btn btn-success" onClick={this.props.onDone}>{doneText}</span>
          </div>
        </div>
      </div>
    );
  }
}
