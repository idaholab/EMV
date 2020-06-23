/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import * as React from 'react';
import CreateCIS from './CreateCIS';

class CreateComponent extends React.Component {

  public render() {
    return (

      <div id= 'CreateComponent'>
          <div id= 'CreateView'>
            <h1>Create a CIS</h1>
          </div>
          <CreateCIS db={this.props.db} uid={this.props.uid} changeTab={this.props.changeTab} scoreTabKey={this.props.scoreTabKey} setCurrentCIS={this.props.setCurrentCIS}/>
      </div>

    );

  }

}

export default CreateComponent;
