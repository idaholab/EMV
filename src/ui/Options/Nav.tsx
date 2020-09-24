// { this.state.criteriaEditorPage && <CireriaEditor uname= {this.state.username} db={this.state.database} logout={this.handleLogout} backButton={this.handleBack}/>}
/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*Libraries*/
import * as React from 'react';
import UserPortal from '../UserPortal';

import { Table, Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle, ControlLabel, FormControl , FormGroup} from 'react-bootstrap';

/*
  Functionality to create different Criteria sets
  TODO: Finish this component and add into application
*/
class Nav extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          //see ManageUsers
        };

        // this.toggleCreate = this.toggleCreate.bind(this);
        // this.toggleEdit = this.toggleEdit.bind(this);
        // this.toggleDelete = this.toggleDelete.bind(this);
    }

    private componentDidMount() {
        const self = this;

    }

    private render() {
        return (
            <div className='App-header'>
            <div id='header-title'>
                <span>Cyber Issue Scoring Application</span>
            </div>
            <div id ='user-portal'><UserPortal uname={this.props.uname} urole={this.props.urole} uportal={this.props.uportal}/></div>
            <div id='header-btn-container'>
                <span id='btn-logout' onClick={this.props.logout}> Log-Out </span>
            </div>
        </div>
      );

    }

  }
  export default Nav;
