/** Provide with an array of pid's. E.g. list=['pid1','pid2']
 or an list id/'huskeliste' in the id prop. E.g. id='huskeliste' or id='65f4a372-bbd1-4c37-b806-5716bfbd9cf1' */
import React from 'react';
import PropTypes from 'prop-types';
import {loadList} from '../../../utils/requestLists';
import Spinner from '../../general/Spinner/Spinner.component';
import PrintElement from './PrintElement';
import Title from '../../base/Title';
import Text from '../../base/Text';
import {connect} from 'react-redux';

import './PrintLayout.css';

class PrintLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: this.props.list,
      title: this.props.title,
      description: this.props.description
    };
  }
  componentDidMount = async () => {
    if (!this.state.list || (this.state.list && this.state.list.length === 0)) {
      this.getList();
    }
  };
  componentDidUpdate = async () => {
    if (this.state.list && this.state.list.length === 0) {
      this.getList();
    }
  };

  getList = async () => {
    try {
      const id = this.props.id;
      const isShortList = id === 'huskeliste';
      let newState = {};
      if (isShortList) {
        const {elements} = this.props.shortListState;

        newState = {
          title: 'Huskeliste',
          list: elements
          //  description: "Huskeliste fra Læsekompas.dk"
        };
      } else {
        const loadedList = await loadList(id);
        newState = {
          list: loadedList.list,
          title: loadedList.title,
          description: loadedList.description
        };
      }
      this.setState(newState);
    } catch (error) {
      // nothing to handle
    }
  };

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
          <img src="/img/general/LK-Logo.png" />
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
  list: PropTypes.array
};
const mapStateToProps = state => {
  return {
    shortListState: state.shortListReducer
  };
};
export default connect(mapStateToProps)(PrintLayout);
