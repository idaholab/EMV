import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import App2 from './App2';

import * as CryptoJS from 'crypto-js';
import * as uuid from 'uuid';
import * as moment from 'moment';
import { ipcRenderer, remote } from 'electron';
// import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle, FormGroup, FormControl } from 'react-bootstrap';
import { Modal, ModalBody, ModalFooter, ModalTitle, FormGroup, FormControl } from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/ModalHeader'
import { writeFile } from 'fs';

import Main from './ui/Main';
import LoadingPage from './ui/Options/LoadingPage';
import LoginPortal from './ui/Options/LoginPortal';
import UserSettings from './ui/Options/UserSettings';
import ManageUsers from './ui/Options/ManageUsers';
import CriteriaEditor from './ui/Options/CriteriaEditor';
import ConfigurationEditor from './ui/Options/ConfigurationEditor';
import {connectToServer, connectToDatabase} from './db/dbtest';

// ReactDOM.render(<div>hello world from Reactsss! </div>, document.getElementById('App'));
// ReactDOM.render(<App />, document.getElementById('root'));
// export default class App extends React.Component {
//     render(return)
// }
type myProps ={}
type myState ={ loadingPage: boolean,
                loginPage: boolean,
                mainPage: boolean,
                userSettingsPage: boolean,
                criteriaEditorPage: boolean,
                configurationEditorPage: boolean,
                manageUsersPage: boolean,
                username: string,
                password: string,
                userObject: any,
                errorMsg: string,
                server: any,
                modalExportCIS: boolean,
                exportCisList: any,
                pickedCisExport: string,
                chooseCisTitle: string,
                chooseCisButton: string,
                chooseCisButtonText: string,
                chooseCisButtonFunc: any,
                database: any}
export default class App extends React.Component<myProps, myState> {
    constructor(props: any) {
        super(props);
        this.state = {
            loadingPage: true,
            loginPage: false,
            mainPage: false,
            userSettingsPage: false,
            criteriaEditorPage: false,
            configurationEditorPage: false,
            manageUsersPage: false,
            username: '',
            password: '',
            userObject: null,
            errorMsg: '',
            server: null,
            database: null,
            modalExportCIS: false,
            exportCisList: [],
            pickedCisExport: '',
            chooseCisTitle: '',
            chooseCisButton: '',
            chooseCisButtonText: '',
            chooseCisButtonFunc: null
        };

        this.handleLogout = this.handleLogout.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleSelectFromUserPortal = this.handleSelectFromUserPortal.bind(this);
    }

    public componentDidMount() {
        const self = this;
        this.getOrientConnections()
        .then(function() {
            self.setState({
                loginPage: true,
                loadingPage: false
            });
        });

        ipcRenderer.on('cis_export_selected', async () => {
            //console.log('CLICKED: Export CIS');
            const cisList = await this.state.database.select().from('CIS').all();
            //console.log(cisList);
            this.setState({
                modalExportCIS: true,
                chooseCisTitle: 'Choose CIS for Export',
                chooseCisButtonText: 'Export',
                chooseCisButtonFunc: this.exportCIS,
                exportCisList: cisList
            });
        });

        ipcRenderer.on('stix_import_selected', () => {
            //console.log('CLICKED: Import STIX');
        });

        ipcRenderer.on('stix_export_selected', async () => {
            //console.log('CLICKED: Export STIX');
            const cisList = await this.state.database.select().from('CIS').all();
            this.setState({
                modalExportCIS: true,
                chooseCisTitle: 'Choose CIS for STIX Creation',
                chooseCisButtonText: 'Create',
                chooseCisButtonFunc: this.exportSTIX,
                exportCisList: cisList
            });
        });
    }

    private handleChange = (event:any) => {
        this.setState({
            ...this.state, [event.target.id]: event.target.value,
        });
    }

    //TODO: make sure session is killed
    private handleLogout = (event:any) => {
        this.setState({
            loginPage: true,
            mainPage: false,
            userSettingsPage: false,
            criteriaEditorPage: false,
            configurationEditorPage: false,
            username: '',
            password: ''
        });
    }

    private handleBack = (event:any) => {
        this.setState({
            mainPage: true,
            loginPage: false,
            userSettingsPage: false,
            manageUsersPage: false,
            criteriaEditorPage: false,
            configurationEditorPage: false
        });
    }

    private handleSelectFromUserPortal = (event:any) => {

        switch (event.target.innerHTML) {
            case 'Manage Users':
            this.setState({
                mainPage: false,
                loginPage: false,
                userSettingsPage: false,
                manageUsersPage: true,
                criteriaEditorPage: false,
                configurationEditorPage: false
            });
                break;
            case 'Criteria Set Editor':
            this.setState({
              mainPage: false,
              loginPage: false,
              manageUsersPage: false,
              userSettingsPage: false,
              criteriaEditorPage: true,
              configurationEditorPage: false
            });
                break;
            case 'Configuration Editor':
                this.setState({
                    mainPage: false,
                    loginPage: false,
                    manageUsersPage: false,
                    userSettingsPage: false,
                    criteriaEditorPage: false,
                    configurationEditorPage: true
                });
                break;
            case 'Change Password':
                this.setState({
                    mainPage: false,
                    loginPage: false,
                    manageUsersPage: false,
                    userSettingsPage: true,
                    criteriaEditorPage: false,
                    configurationEditorPage: false
                });
                break;

            default:
                console.log('Invalid User Portal option.');
        }
    }

    private handleSubmit = (event:any) => {
        let self: any = this;
        event.preventDefault();
        const queryOptions = {
            name: this.state.username,
            password: CryptoJS.SHA512(this.state.password).toString()
        };
        //If authentication suceeds, render Main component
        const queryResults = this.state.database.select().from('User')
        .where(queryOptions).one()
        .then(
            function(result:any) {
                if (typeof result !== 'undefined') {
                    self.setState({
                        loginPage: false,
                        mainPage: true,
                        errorMsg: '',
                        userObject: result
                    });
                } else {
                    self.setState({
                        errorMsg: 'Incorrect Username or Password'
                    });
                }
            },
        );
    }

    public getOrientConnections = async function(this: any) {
        const serverOptions = {
            host: 'localhost',
            password: 'OrientPW',
            port: '2424',
            username: 'root',
            rejectUnauthorized: false
        };
        const databaseOptions = {
            name: 'emv',
            password: 'admin',
            username: 'admin'
        };

        const server = await connectToServer(serverOptions);
        const db = await connectToDatabase(databaseOptions, server);

        this.setState({server: server, database: db});
    };

    public exportCIS = async function(self:any) {
        const jsonRepObject = JSON.parse(self.state.pickedCisExport);
        let filename: any;
        filename = await remote.dialog.showSaveDialog({title: 'Export CIS as JSON', defaultPath: jsonRepObject.name + '_cis.json'});
        if (filename) {
            //console.log(filename);
            writeFile(filename, self.state.pickedCisExport, (err) => {
                if (err) { throw err; }
            });
        }
        self.setState({
            modalExportCIS: false
        });
    };

    public toggleExportCIS = (event:any) => {
        this.setState({
            modalExportCIS: !this.state.modalExportCIS
        });
    }

    public exportSTIX = async function(self:any) {
        const jsonRepObject = JSON.parse(self.state.pickedCisExport);
        const filename = await remote.dialog.showSaveDialog({title: 'Create STIX from CIS', defaultPath: jsonRepObject.name + '_stix_bundle.json'});
        if (filename) {
            // console.log(filename);
            let type2: string;
            const stixData = {
                type: 'bundle',
                id: 'bundle--' + uuid.v4(),
                spec_version: '2.0',
                objects: []
            };
            
            type2 = 'course-of-action';
            stixData.objects.push({
                type: 'course-of-action',
                id: 'course-of-action--' + uuid.v4(),
                created: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                modified: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                name: jsonRepObject.name + '_courseOfAction',
                description: ''

            });
            const courseOfActionIndex = 0;

            stixData.objects.push({
                type: 'indicator',
                id: 'indicator--' + uuid.v4(),
                created: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                modified: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                name: jsonRepObject.name + '_indicator',
                pattern: "[file:name = 'PlaceHolderPatternREPLACEorDELETE.exe']",
                valid_from: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                labels: [''],
                description: ''
            });
            const indicatorIndex = 1;

            stixData.objects.push({
                type: 'malware',
                id: 'malware--' + uuid.v4(),
                created: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                modified: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                name: jsonRepObject.name + '_malware',
                labels: [''],
                description: ''
            });
            const malwareIndex = 2;

            stixData.objects.push({
                type: 'vulnerability',
                id: 'vulnerability--' + uuid.v4(),
                created: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                modified: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                name: jsonRepObject.name + '_vulnerability',
                description: ''
            });
            const vulnIndex = 3;

            stixData.objects.push({
                type: 'threat-actor',
                id: 'threat-actor--' + uuid.v4(),
                created: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                modified: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                name: jsonRepObject.name + '_threatActor',
                labels: [''],
                description: ''
            });
            const threatIndex = 4;

            for (const catObj of jsonRepObject.criteriaDefault) {
                for (const charObj of catObj.characteristics) {
                    for (const attObj of charObj.attributes) {
                        for (const scoreObj of attObj.scores) {
                            //Course of Action, Indicator
                            if (catObj.category === 'Defense Complexity') {
                                //Course of Action
                                if (charObj.characteristic === 'Difficulty to Fix') {
                                    //Check for chosen options
                                    if (scoreObj.chosen) {
                                        stixData.objects[courseOfActionIndex].description += ' [ '  + scoreObj.description + ' ]';
                                    }
                                } else if (charObj.characteristic === 'Difficulty to Detect') {  //Indicator
                                    //Check for chosen options
                                    if (scoreObj.chosen) {
                                        stixData.objects[indicatorIndex].description += ' [ '  + scoreObj.description + ' ]';
                                    }
                                }
                            } else if (catObj.category === 'Exploit, Malware, and Vulnerability') { //Malware, Vulnerability
                                //Malware, Vulnerability
                                if (charObj.characteristic === 'Urgency') {
                                    //Malware
                                    if (attObj.attribute === 'Mobility of Infection') {
                                        //Check for chosen options
                                        if (scoreObj.chosen) {
                                            stixData.objects[malwareIndex].description += ' [ '  + scoreObj.description + ' ]';
                                        }
                                    } else if (attObj.attribute === 'Past Incident Source/Credibility') {  //Vulnerability
                                        //Check for chosen options
                                        if (scoreObj.chosen) {
                                            stixData.objects[vulnIndex].description += ' [ '  + scoreObj.description + ' ]';
                                        }
                                    } else if (attObj.attribute === 'Availability') {//Vulnerability
                                        //Check for chosen options
                                        if (scoreObj.chosen) {
                                            stixData.objects[vulnIndex].description += ' [ '  + scoreObj.description + ' ]';
                                        }
                                    }
                                } else if (charObj.characteristic === 'Maturity/Sophistication') {//Malware
                                    //Check for chosen options
                                    if (scoreObj.chosen) {
                                        stixData.objects[malwareIndex].description += ' [ '  + scoreObj.description + ' ]';
                                    }
                                } else if (charObj.characteristic === 'Functional Impact') {  //Malware
                                    //Check for chosen options
                                    if (scoreObj.chosen) {
                                        stixData.objects[malwareIndex].description += ' [ '  + scoreObj.description + ' ]';
                                    }
                                }
                            } else if (catObj.category === 'Adversary') {//Threat Actor
                                //Threat Actor
                                if (charObj.characteristic === 'Motivation') {
                                    //Check for chosen options
                                    if (scoreObj.chosen) {
                                        stixData.objects[threatIndex].description += ' [ '  + scoreObj.description + ' ]';
                                    }
                                } else if (charObj.characteristic === 'Capability') { //Threat Actor
                                    //Check for chosen options
                                    if (scoreObj.chosen) {
                                        stixData.objects[threatIndex].description += ' [ '  + scoreObj.description + ' ]';
                                    }
                                }
                            }
                        }
                    }
                }
            }

            writeFile(filename, JSON.stringify(stixData), (err) => {
                if (err) { throw err; }
            });
        }

        self.setState({
            modalExportCIS: false
        });
    };

    public render() {
        return ( <div>Testing</div>)
        // const cisDropdown = this.state.exportCisList.map((cis, cIndex) => {
        //     return <option key={cIndex} value={cis.jsonRep}>{cis.name}</option>;
        // });

        // return (
        //     <div className = 'Wrapper'>
        //         {/* <Header /> */}
        //         { this.state.loadingPage && <LoadingPage msg='Preparing Database'/>}
        //         { this.state.loginPage && <LoginPortal uname={this.state.username} passwd={this.state.password} errorMsg={this.state.errorMsg} handleChange={this.handleChange} handleSubmit={this.handleSubmit}/> }
        //         { this.state.mainPage && <Main uname={this.state.username} urole={this.state.userObject.role} uid={this.state.userObject['@rid'].toString()}db={this.state.database} logout={this.handleLogout} uportal={this.handleSelectFromUserPortal}/> }
        //         { this.state.userSettingsPage && <UserSettings uname={this.state.username} db={this.state.database} logout={this.handleLogout} backButton={this.handleBack}/> }
        //         { this.state.manageUsersPage && <ManageUsers db={this.state.database} logout={this.handleLogout} backButton={this.handleBack}/> }
        //         { this.state.criteriaEditorPage && <CriteriaEditor uname= {this.state.username} db={this.state.database} logout={this.handleLogout} backButton={this.handleBack}/>}
        //         { this.state.configurationEditorPage && <ConfigurationEditor uname= {this.state.username} db={this.state.database} logout={this.handleLogout} backButton={this.handleBack}/>}
        //         <Modal show={this.state.modalExportCIS}>
        //             <ModalHeader>
        //                 <ModalTitle componentClass='h2'>{this.state.chooseCisTitle}</ModalTitle>
        //             </ModalHeader>
        //             <ModalBody>
        //                 <form>
        //                     <FormGroup controlId='pickedCisExport'>
        //                         <FormControl componentClass='select' onChange={this.handleChange}>
        //                             <option value='' disabled selected hidden>Choose CIS...</option>
        //                             {cisDropdown}
        //                         </FormControl>
        //                     </FormGroup>
        //                 </form>
        //             </ModalBody>
        //             <ModalFooter>
        //                 <button onClick={() => this.state.chooseCisButtonFunc(this)}>{this.state.chooseCisButtonText}</button>
        //                 <button className='btn-red' onClick={this.toggleExportCIS}>Cancel</button>
        //             </ModalFooter>
        //         </Modal>
        //     </div>
        // );

  }
}