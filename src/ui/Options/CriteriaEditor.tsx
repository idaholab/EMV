// { this.state.criteriaEditorPage && <CireriaEditor uname= {this.state.username} db={this.state.database} logout={this.handleLogout} backButton={this.handleBack}/>}
/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*Libraries*/
import * as React from 'react';
import { Table, Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle, ControlLabel, FormControl , FormGroup} from 'react-bootstrap';

/*
  Functionality to create different Criteria sets
  TODO: Finish this component and add into application
*/
class CriteriaEditor extends React.Component {
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
      const tdStyle = {
          verticalAlign: 'middle'
      };
      return (
        <div>
            <div className='back-btn-container'>
                <button onClick={this.props.backButton}>Back</button>
            </div>
            <div className='page-title'>
                <h2>Criteria Set Editor</h2>
            </div>
        </div>
      );

    }

  }
  export default CriteriaEditor;
