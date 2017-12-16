import React, { Component } from 'react';
import logo from './logo.svg';


class Row extends Component {
  constructor(props) {
    super(props);
    let className = this.props.taken ? " Red" : ""

    this.state = {
      className: " " +className
    };
  } 


  render() {
    return (
      <div className="Row">
      {this.props.row.map((el, idx) => 
        <div className={el ? "Cell Red" : "Cell"} />
      )}
      </div>
    );
  }
}

export default Row;
