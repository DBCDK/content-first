import React from 'react';
import Kryds from '../svg/Kryds.svg';

export default class Modal extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.show !== this.props.show) {
      if (nextProps.show) {
        this.pageYOffset = window.pageYOffset;
        this.bodyScrollTop = document.body.scrollTop;
        this.documentElementScrollTop = document.documentElement.scrollTop;
        document.body.classList.add('modal-open');
      }
      else {
        document.body.classList.remove('modal-open');
        window.pageYOffset = this.pageYOffset;
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
