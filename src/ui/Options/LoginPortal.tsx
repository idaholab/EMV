/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import * as React from 'react';
import { Button, ControlLabel, FormControl , FormGroup} from 'react-bootstrap';
//Track user state, if !logged in don't show any other components
//For now, use OrientDB OUser System class for users
class LoginPortal extends React.Component {
  constructor(props) {
    super(props);

  }

  private validateForm() {
    return this.props.uname.length > 0 && this.props.passwd.length > 0;
  }

  private render() {
    return (
      <div className='Login'>
        <form onSubmit={this.props.handleSubmit}>
          <FormGroup controlId='username' bsSize='large'>
            <ControlLabel>Username</ControlLabel>
            <FormControl
              autoFocus={true}
              type='text'
              value={this.props.uname}
              onChange={this.props.handleChange}
            />
          </FormGroup>
          <FormGroup controlId='password' bsSize='large'>
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.props.passwd}
              onChange={this.props.handleChange}
              type='password'
            />
          </FormGroup>
          <span className='form-error-msg'>{this.props.errorMsg}</span>
          <Button
            block={true}
            bsSize='large'
            disabled={!this.validateForm()}
            type='submit'
          >
            Login
          </Button>
        </form>
      </div>
    );
  }
}

export default LoginPortal;
