/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import * as React from 'react';

class LoadingPage extends React.Component {
  constructor(props) {
    super(props);

  }

  private render() {
    return (
        <div className ='loading-page-container'>
            <h2>{this.props.msg}</h2>
            <div id='loader'></div>
        </div>
    );
  }
}

export default LoadingPage;
