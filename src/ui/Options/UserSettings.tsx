/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*Libraries*/
import * as React from 'react';
import * as CryptoJS from 'crypto-js';
import { Button, ControlLabel, FormControl , FormGroup} from 'react-bootstrap';

/*
  Functionality to manage user settings
  In this case, the only 'setting' that can be managed is changing the user's password
*/
class UserSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          oldpw: '',
          newpw: '',
          newpw2: '',
          errorMsg: ''
        };
    }

    private handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value,
        });
    }

    private handleSubmit = (event) => {
        const self = this;
        event.preventDefault();
        const queryOptions = {
            name: this.props.uname,
            password: CryptoJS.SHA512(this.state.oldpw).toString()
        };

        if (this.state.newpw !== this.state.newpw2) {
            this.setState({
                errorMsg: 'New password fields do not match',
                newpw: '',
                newpw2: ''
            });
        } else {
            const queryResults = this.props.db.select().from('User')
            .where(queryOptions).one()
            .then(
                function(result) {
                    console.log('Found User:', result);
                    if (typeof result !== 'undefined') {
                        const update = self.props.db.update(result['@rid'].toString())
                        .set({
                            password: CryptoJS.SHA512(self.state.newpw).toString()
                        }).one()
                        .then(
                            function(update) {
                                console.log('Changed password of ' + self.props.uname);
                                self.props.logout();
                            }
                        );
                    } else {
                        self.setState({
                            errorMsg: 'Incorrect password',
                            oldpw: ''
                        });
                    }
                },
            );
        }
    }

    private validateForm() {
        return this.state.oldpw.length > 0 && this.state.newpw.length > 0 && this.state.newpw2.length > 0;
    }

    private render() {
        return (
            <div>
                <div className='back-btn-container'>
                    <button onClick={this.props.backButton}>Back</button>
                </div>
                <div className='Login'>
                    <form onSubmit={this.handleSubmit}>
                        <FormGroup controlId='oldpw' bsSize='large'>
                            <ControlLabel>Old Password</ControlLabel>
                            <FormControl
                                autoFocus={true}
                                type='password'
                                value={this.state.oldpw}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup controlId='newpw' bsSize='large'>
                            <ControlLabel>New Password</ControlLabel>
                            <FormControl
                                type='password'
                                value={this.state.newpw}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup controlId='newpw2' bsSize='large'>
                            <ControlLabel>Confirm New Password</ControlLabel>
                            <FormControl
                                type='password'
                                value={this.state.newpw2}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <span className='form-error-msg'>{this.state.errorMsg}</span>
                        <Button
                            block={true}
                            bsSize='large'
                            disabled={!this.validateForm()}
                            type='submit'
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        );
    }
}

export default UserSettings;
