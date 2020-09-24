/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*Libraries*/
import * as React from 'react';
import {Tabs, Tab, Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle, FormGroup, FormControl} from 'react-bootstrap';
// import * as SplitPane from 'react-split-pane';
import SplitPane from 'react-split-pane';
import { ipcRenderer, remote } from 'electron';
import { writeFile, readFile } from 'fs';
import {Button} from 'react-bootstrap';
/*Custom*/
import FinishComponent from '../ui/Finish/FinishComponent';
import CreateComponent from '../ui/Create/CreateComponent';
import ScoringComponent from '../ui/Scoring/ScoringComponent';
import UserPortal from '../ui/UserPortal';
import { createDefault } from './Create/CreateFunctions';
/*Style*/
const divStyle = {
  width: '100%',
};

/*
  This is the main driver for the application, holding all components held within.
*/
export default class MainPane extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      key: 1,
      currentCIS: null,
      modalImportCIS: false,
      hwConfigList: [],
      pickedHwConfig: ''
    };

    this.setCurrentCIS = this.setCurrentCIS.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  //TODO: bust out component update on creation of a new hardware configuration
  private componentDidMount() {
      ipcRenderer.on('cis_import_selected', async () => {
          console.log('CLICKED: Import CIS');
          const hwList = await this.props.db.select().from('Configuration').all();
          console.log(hwList);
          this.setState({
              modalImportCIS: true,
              hwConfigList: hwList
          });
      });
  }

  private handleChange = (event) => {
      this.setState({
          [event.target.id]: event.target.value,
      });
  }

  private handleSelect = (key) => {
    this.setState({ key });
  }

  /*setCurrentCISID*/
  public setCurrentCIS = async function(cisObject) {
    this.setState({ currentCIS: cisObject}, () => console.log('after setting Current CIS in MainPane', this.state.currentCIS));
  };

  public importCIS = async function(self) {
      console.log(self.state.pickedHwConfig);
      let newCIS = null;
      const filenames = await remote.dialog.showOpenDialog({title: 'Import CIS from JSON', filters: [{name: 'CIS', extensions: ['json', 'JSON']}]});
      if (filenames) {
          readFile(filenames[0], 'utf8', (err, data) => {
              if (err) { throw err; }
              newCIS = JSON.parse(data);
              console.log(newCIS);
              createDefault(self.props.db, newCIS.name, newCIS.description, self.state.pickedHwConfig, self.props.uid, newCIS, this.handleSelect, 2, this.setCurrentCIS);
          });
      }

      self.setState({
          modalImportCIS: false
      });
  };

  public toggleImportCIS = (event) => {
      this.setState({
          modalImportCIS: !this.state.modalImportCIS
      });
  }

  private render() {

    const hwConfigDropdown = this.state.hwConfigList.map((hw, hIndex) => {
      return <option key={hIndex} value={hw['@rid'].toString()}>{hw.name}</option>;
    });

    return (
      <div>
        <SplitPane
          className = '_mainPane'
          defaultSize='50px'
          split='horizontal'
        >
          <div className='App-header'>
              <div id='header-title'>
                  <span>Cyber Issue Scoring Application</span>
              </div>
              <div id ='user-portal'><UserPortal uname={this.props.uname} urole={this.props.urole} uportal={this.props.uportal}/></div>
              <div id='header-btn-container'>
                  <span id='btn-logout' onClick={this.props.logout}> Log-Out </span>
              </div>
          </div>

              <div className='_mainPane' style={divStyle}>

                <Tabs
                  activeKey={this.state.key}
                  onSelect={this.handleSelect}
                  id='ourTabController'
                  mountOnEnter={true}
                  unmountOnExit={true}
                >
                  <Tab eventKey={1} title = 'Create New CIS'>
                    <CreateComponent db = {this.props.db} uid={this.props.uid} changeTab={this.handleSelect} setCurrentCIS={this.setCurrentCIS} scoreTabKey={2} />
                  </Tab>
                  <Tab eventKey={2} title = 'CIS Score Editor'>
                    <ScoringComponent db = {this.props.db} uid={this.props.uid} currentCIS={this.state.currentCIS} setCurrentCIS={this.setCurrentCIS}/>
                  </Tab>
                  <Tab eventKey={3} title = 'CIS Reports'>
                    <FinishComponent  db = {this.props.db} uid={this.props.uid} currentCIS={this.state.currentCIS} setCurrentCIS={this.setCurrentCIS}/>
                  </Tab>
                </Tabs>

              </div>

        </SplitPane>
        <Modal show={this.state.modalImportCIS}>
            <ModalHeader>
                <ModalTitle componentClass='h2'>{'Choose Hardware Configuration for Imported CIS'}</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <form>
                    <FormGroup controlId='pickedHwConfig'>
                        <FormControl componentClass='select' onChange={this.handleChange}>
                            <option value='' disabled selected hidden>Choose Configuration...</option>
                            {hwConfigDropdown}
                        </FormControl>
                    </FormGroup>
                </form>
            </ModalBody>
            <ModalFooter>
                <button onClick={() => this.importCIS(this)}>Import</button>
                <button className='btn-red' onClick={this.toggleImportCIS}>Cancel</button>
            </ModalFooter>
        </Modal>
      </div>
    );
  }
}
