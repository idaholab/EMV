/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*Libraries*/
import * as React from 'react';

/*Handles the admin dropdown list*/
export default class UserPortal extends React.Component {

    constructor(props) {
        super(props);
    }

    public render() {
        if (this.props.urole === 'admin') {
            return (
                <div id='btn-userportal'>
                    <span><strong>{this.props.uname}</strong></span>
                    <span className='down-arrow'><strong>&#x25BE;</strong></span>
                    <div className='dropdown-content'>
                        <ul>
                            <li onClick={this.props.uportal}>Manage Users</li>
                            <li onClick={this.props.uportal}>Criteria Set Editor</li>
                            <li onClick={this.props.uportal}>Configuration Editor</li>
                            <li onClick={this.props.uportal}>Change Password</li>
                        </ul>
                    </div>
                </div>
            );
        } else {
            return (
                <div id='btn-userportal'>
                    <span><strong>{this.props.uname}</strong></span>
                    <span className='down-arrow'><strong>&#x25BE;</strong></span>
                    <div className='dropdown-content'>
                        <ul>
                            <li onClick={this.props.uportal}>Change Password</li>
                        </ul>
                    </div>
                </div>
            );
        }
    }
}
