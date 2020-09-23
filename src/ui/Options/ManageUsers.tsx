/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*Libraries*/
import * as React from 'react';
import * as CryptoJS from 'crypto-js';
import { Table, Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle, ControlLabel, FormControl , FormGroup} from 'react-bootstrap';

/*
  Functionality to manage users (add/edit/delete) and their permissions within the application.
*/
class ManageUsers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            modalCreateUser: false,
            modalEditUser: false,
            modalDeleteUser: false,
            newUserName: '',
            newUserPassword: '',
            newUserPassword2: '',
            newUserRole: null,
            errorMsg: '',
            activeUser: ''
        };

        this.toggleCreate = this.toggleCreate.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.toggleDelete = this.toggleDelete.bind(this);
    }

    private componentDidMount() {
        const self = this;
        const queryResults = this.props.db.select().from('User').all()
        .then(
            function(queryResults) {
                self.setState({
                    users: queryResults,
                });
            }
        );
    }

    private toggleCreate = (event) => {
        this.setState({
            modalCreateUser: !this.state.modalCreateUser
        });
    }

    private toggleEdit = (event) => {
        const self = this;
        if (event.target.innerHTML === 'Edit') {
            const qResults = this.props.db.select().from(event.target.parentNode.parentNode.id)
            .one()
            .then(
                function(qResults) {
                    self.setState({
                        activeUser: qResults,
                        modalEditUser: !self.state.modalEditUser
                    });
                }
            );
        } else {
            this.setState({
                modalEditUser: !this.state.modalEditUser
            });
        }
    }

    private toggleDelete = (event) => {
        const self = this;
        if (event.target.innerHTML === 'Delete') {
            const qResults = this.props.db.select().from(event.target.parentNode.parentNode.id)
            .one()
            .then(
                function(qResults) {
                    self.setState({
                        activeUser: qResults,
                        modalDeleteUser: !self.state.modalDeleteUser
                    });
                }
            );
        } else {
            this.setState({
                modalDeleteUser: !this.state.modalDeleteUser
            });
        }
    }

    private handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value,
        });
    }

    private handleCreateUser = (event) => {
        const self = this;
        if (this.validateNewUser()) {
            const newCreatedUser = this.props.db.create('VERTEX', 'User')
            .set({
                name: this.state.newUserName,
                password: CryptoJS.SHA512(this.state.newUserPassword).toString(),
                role: this.state.newUserRole
            }).one()
            .then(
                function(newCreatedUser) {
                    console.log('Created user ' + newCreatedUser.name + ' with user role of: ' + newCreatedUser.role);
                    const updatedUsers = self.state.users;
                    //updatedUsers.push({name: newCreatedUser.name, role: newCreatedUser.role});
                    updatedUsers.push(newCreatedUser);
                    self.setState({
                        modalCreateUser: !self.state.modalCreateUser,
                        users: updatedUsers
                    });
                }
            );
        }
    }

    private handleEditUser = (event) => {
        const self = this;
        const update = this.props.db.update(this.state.activeUser['@rid'])
        .set({
            role: this.state.newUserRole
        }).one()
        .then(
            function(update) {
                console.log('Updated role of ' + self.state.activeUser.name);
                const activeIndex = self.state.users.findIndex((obj) => {
                    return obj['@rid'].toString() === self.state.activeUser['@rid'].toString();
                });
                let updatedUsersRole = self.state.users;
                updatedUsersRole[activeIndex].role = self.state.newUserRole;
                self.setState({
                    modalEditUser: !self.state.modalEditUser,
                    users: updatedUsersRole
                });
            }
        );
    }

    private handleDeleteUser = (event) => {
        const self = this;
        this.props.db.delete('VERTEX', 'User')
        .where('@rid = ' + this.state.activeUser['@rid'].toString()).one()
        .then(
            function(del) {
                console.log('Deleted User: ' + self.state.activeUser.name);
                const activeIndex = self.state.users.findIndex((obj) => {
                    return obj['@rid'].toString() === self.state.activeUser['@rid'].toString();
                });
                const updatedUsersDelete = self.state.users;
                updatedUsersDelete.splice(activeIndex, 1);
                self.setState({
                    modalDeleteUser: !self.state.modalDeleteUser,
                    users: updatedUsersDelete
                });
            }
        );
    }

    //TODO: validate this works fully
    private validateNewUser = () => {
        let pass = true;

        if (this.state.newUserName.length === 0 || this.state.newUserPassword.length === 0 || this.state.newUserPassword2.length === 0 || typeof this.state.newUserRole === 'undefined') {
            this.setState({
                errorMsg: 'All fields must have a given value'
            });
            pass = false;
        } else if (!this.state.newUserRole) {
            this.setState({
                errorMsg: 'Select a User Role'
            });
            pass = false;
        } else if (this.state.newUserPassword !== this.state.newUserPassword2) {
            this.setState({
                errorMsg: 'Password fields must match'
            });
            pass = false;
        } else {
            this.setState({
                errorMsg: ''
            });
        }

        return pass;
    }

    //TODO: add in cisInfo list per user!!! userList
    private render() {

        const tdStyle = {
            verticalAlign: 'middle'
        };

        const userList = this.state.users.map((user, uIndex) => {
            if (user.name === 'admin') {
                return  <tr key={uIndex} id={user['@rid']}>
                            <th scope='row' style={tdStyle}>{uIndex}</th>
                            <td style={tdStyle}>{user.name}</td>
                            <td style={tdStyle}>{user.role}</td>
                            <td style={tdStyle}>'Add CIS Info'</td>
                            <td style={tdStyle}><button className='btn-disabled'>Edit</button></td>
                            <td style={tdStyle}><button className='btn-disabled'>Delete</button></td>
                        </tr>;
            } else {
                return  <tr key={uIndex} id={user['@rid']}>
                            <th scope='row' style={tdStyle}>{uIndex}</th>
                            <td style={tdStyle}>{user.name}</td>
                            <td style={tdStyle}>{user.role}</td>
                            <td style={tdStyle}>'Add CIS Info'</td>
                            <td style={tdStyle}><button onClick={this.toggleEdit}>Edit</button></td>
                            <td style={tdStyle}><button className='btn-red' onClick={this.toggleDelete}>Delete</button></td>
                        </tr>;
            }
        });

        return (
            <div>
                <div className='back-btn-container'>
                    <button onClick={this.props.backButton}>Back</button>
                </div>
                <div className='page-title'>
                    <h2>Manage Users</h2>
                </div>
                <Table className='user-list'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User Name</th>
                            <th>User Role</th>
                            <th>CIS List</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList}
                        <tr key='newUser'>
                            <th scope='row' style={tdStyle}><button onClick={this.toggleCreate}>Create New User</button></th>
                            <td style={tdStyle}></td>
                            <td style={tdStyle}></td>
                            <td style={tdStyle}></td>
                            <td style={tdStyle}></td>
                            <td style={tdStyle}></td>
                        </tr>
                    </tbody>
                </Table>
                <Modal show={this.state.modalCreateUser}>
                    <ModalHeader>
                        <ModalTitle componentClass='h3'>Create New User</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <form>
                            <FormGroup controlId='newUserName' bsSize='large'>
                                <ControlLabel>User Name</ControlLabel>
                                <FormControl
                                autoFocus={true}
                                type='text'
                                value={this.state.newUserName}
                                onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup controlId='newUserPassword' bsSize='large'>
                                <ControlLabel>Password</ControlLabel>
                                <FormControl
                                type='password'
                                value={this.state.newUserPassword}
                                onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup controlId='newUserPassword2' bsSize='large'>
                                <ControlLabel>Confirm Password</ControlLabel>
                                <FormControl
                                type='password'
                                value={this.state.newUserPassword2}
                                onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup controlId='newUserRole'>
                                <ControlLabel>User Role</ControlLabel>
                                <FormControl componentClass='select' onChange={this.handleChange}>
                                    <option value='' disabled selected hidden>Select User Role...</option>
                                    <option value='admin'>Administrator</option>
                                    <option value='manager'>Manager</option>
                                    <option value='analyst'>Analyst</option>
                                    <option value='readonly'>Read Only</option>
                                </FormControl>
                            </FormGroup>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <span className='form-error-msg'>{this.state.errorMsg}</span>
                        <button onClick={this.handleCreateUser}>Create User</button>
                        <button className='btn-red' onClick={this.toggleCreate}>Cancel</button>
                    </ModalFooter>
                </Modal>
                <Modal show={this.state.modalEditUser}>
                    <ModalHeader>
                        <ModalTitle componentClass='h3'>{'Edit User: ' + this.state.activeUser.name}</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <p><strong>Current User Role:</strong>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.activeUser.role}</p>
                        <form>
                            <FormGroup controlId='newUserRole'>
                                <ControlLabel>Change User Role</ControlLabel>
                                <FormControl componentClass='select' onChange={this.handleChange}>
                                    <option value='' disabled selected hidden>Select User Role...</option>
                                    <option value='admin'>Administrator</option>
                                    <option value='manager'>Manager</option>
                                    <option value='analyst'>Analyst</option>
                                    <option value='readonly'>Read Only</option>
                                </FormControl>
                            </FormGroup>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <span className='form-error-msg'>{this.state.errorMsg}</span>
                        <button onClick={this.handleEditUser}>Save Changes</button>
                        <button className='btn-red' onClick={this.toggleEdit}>Cancel</button>
                    </ModalFooter>
                </Modal>
                <Modal show={this.state.modalDeleteUser}>
                    <ModalHeader>
                        <ModalTitle componentClass='h2'>{'Are you sure you want to delete user: ' + this.state.activeUser.name + '?'}</ModalTitle>
                    </ModalHeader>
                    <ModalFooter>
                        <button onClick={this.handleDeleteUser}>Yes</button>
                        <button className='btn-red' onClick={this.toggleDelete}>Cancel</button>
                    </ModalFooter>
                </Modal>
            </div>

        );
    }
}

export default ManageUsers;
