/** Provide with an array of pid's. E.g. printList={[{pid:'870970-basis:46647181'},{pid:'870970-basis:29572178'}]}
 alternativly you can provide an list id/'huskeliste' in the id prop. E.g. id='huskeliste' or id='65f4a372-bbd1-4c37-b806-5716bfbd9cf1' */
import React from 'react';
import PropTypes from 'prop-types';
import Spinner from '../../general/Spinner/Spinner.component';
import PrintElement from './PrintElement';
import Title from '../../base/Title';
import Text from '../../base/Text';
import {connect} from 'react-redux';
import {withList} from '../../hoc/List';

import './PrintLayout.css';

class PrintLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: this.props.printList,
      title: this.props.title,
      description: this.props.description
    };
  }
  componentDidMount() {
    this.loadShortList();
    setTimeout(window.print, 2000);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.list !== this.props.list && this.props.list.title) {
      const loadedList = this.props.list;
      this.setState({
        list: loadedList.list,
        title: loadedList.title,
        description: loadedList.description
      });
    } else if (
      this.state.list &&
      this.state.list.length === 0 &&
      this.props.shortListState.elements.length > 0
    ) {
      this.loadShortList();
    }
  }

  loadShortList() {
    const isShortList = this.props.id === 'huskeliste';
    if (isShortList) {
      const {elements} = this.props.shortListState;
      const shortlist = elements.map(el => (el.pid ? el : el.book));
      this.setState({
        title: 'Huskeliste',
        list: shortlist
      });
    }
  }

  render() {
    let list = this.state.list;
    if (!list) {
      return (
        <div className="d-flex justify-content-center">
          <Spinner size="30px" className="mt-5" />
        </div>
      );
    }
    return (
      <div className="print-layout-container">
        <div className="print-layout-logo">
          <img src="/img/general/LK-Logo.png" alt="logo" />
        </div>
        <div className="print-layout-container-listinfo">
          <Title Tag="h1" type="title4" variant="weight-normal ">
            {this.state.title}
          </Title>
          <Text className="mt-3 mt-md-4 mb-3 font-weight-normal" type="large">
            {this.state.description}
          </Text>
        </div>
        <div className="position-relative ">
          {list &&
            list.map(element => {
              return <PrintElement key={element.pid} pid={element.pid} />;
            })}
        </div>
      </div>
    );
  }
}
PrintLayout.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  list: PropTypes.object,
  printList: PropTypes.array
};
const mapStateToProps = state => {
  return {
    shortListState: state.shortListReducer
  };
};
export default connect(mapStateToProps)(withList(PrintLayout));
