/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import * as React from 'react';

export default class UserPortal extends React.Component {

    constructor(props) {
        super(props);
    }

    public render() {
        if (this.props.urole === 'admin') {
            return (
                <div id='btn-userportal'>
                    <span><strong>{this.props.uname}</strong></span>
                    <span class='down-arrow'><strong>&#x25BE;</strong></span>
                    <div class='dropdown-content'>
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
                    <span class='down-arrow'><strong>&#x25BE;</strong></span>
                    <div class='dropdown-content'>
                        <ul>
                            <li onClick={this.props.uportal}>Change Password</li>
                        </ul>
                    </div>
                </div>
            );
        }
    }
}
