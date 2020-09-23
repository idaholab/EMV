/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*Libaries*/
import * as React from 'react';
import MainPane from './MainPane';

/*Main React component*/
export default class Main extends React.Component {

    constructor(props) {
        super(props);
    }

    public render() {

        return (

            <div className = 'Container'>
              <MainPane uname={this.props.uname} urole={this.props.urole} uid={this.props.uid} db={this.props.db} logout={this.props.logout} uportal={this.props.uportal}/>
            </div>
        );
  }
}
