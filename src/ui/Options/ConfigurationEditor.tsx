// { this.state.criteriaEditorPage && <CireriaEditor uname= {this.state.username} db={this.state.database} logout={this.handleLogout} backButton={this.handleBack}/>}
/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*Libraries*/
import * as React from 'react';
import { Table, Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle, ControlLabel, FormControl , FormGroup, FieldGroup, HelpBlock} from 'react-bootstrap';

/*
  Functionality to create hardware configurations
  TODO: Save/Display Images
*/
class ConfigurationEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          configs: [],
          modalCreateConfiguration: false,
          newConfigName: '',
          newConfigDescription: '',
          newConfigDocs: '',
          newConfigDocs2: '',
          errorMsg: ''
        };

        this.toggleCreate = this.toggleCreate.bind(this);
        this.getImages = this.getImages.bind(this);
    }

    private componentDidMount() {
      const self = this;
      const queryResults = this.props.db.select().from('Configuration').all()
      .then(
          function(queryResults) {
              self.setState({
                  configs: queryResults,
              });
          }
      );

    }

    private handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value,
        });
    }

    private handleSelectChange = async (event) => {
      event.preventDefault();
      const files = event.target.files;

      if (files && files.length > 0) {
        console.log('We have files', files.length);
        for (let i = 0; i < files.length; i++) {
          console.log('file', i, ' and filename: ', files[i]);
          //create an 'edge' class for each file length
        }

        // this.setState({newConfigDocs2: files}, () => console.log('we implemented' this.state.newConfigDocs2));
        this.setState({
            [event.target.id]: event.target.value,
            newConfigDocs2: files,
        });
      } else {
        console.log('We have no files');
      }
    }

    private toggleCreate = (event) => {
        this.setState({
            modalCreateConfiguration: !this.state.modalCreateConfiguration
        });
    }

    // public updateJsonRep = async function(db, cisID) {

    private  handleCreateConfig = async (event) => {
        const self = this;
        let configID = null;
        let supportingDoc = null;
        const ourConfig = this.state.newConfigDocs2);
        const db = this.props.db;

        console.log('TEST THIS STATE', ourConfig);

        if (this.validateNewConfig()) {
            const newCreatedConfiguration = await this.props.db.create('VERTEX', 'Configuration')
            .set({
                name: this.state.newConfigName,
                description: this.state.newConfigDescription,
                // supportingDocs: this.state.newConfigDocs //embeddedlist of record IDs
            }).one()
            .then( //update the configuration list
                async function(newCreatedConfiguration) {

                    console.log('Created config ' + newCreatedConfiguration.name + ' with description: ' + newCreatedConfiguration.description);
                    const updatedConfigs = self.state.configs;
                    updatedConfigs.push(newCreatedConfiguration);
                    self.setState({
                        modalCreateConfiguration: !self.state.modalCreateConfiguration,
                        configs: updatedConfigs,
                    });
                    console.log('our newly created configuratoin. ', newCreatedConfiguration);
                    configID = newCreatedConfiguration['@rid'];
                    // supportingDoc = await db.create('EDGE', 'supporting_doc')
                    // .from(configID).to(this.state.newCreatedConfiguration).one();

                    console.log('new config2 docs: ', ourConfig);
                    for (const imgObj of ourConfig) { // loop through configdocs2 array, pulling out each image object;
                      let imageID = null;
                      console.log('Test imgOjbj this stuff here', imgObj);
                        const image = await db.create('VERTEX', 'Image') //create an image
                        .set({
                            name: imgObj.name
                        }).one();
                        console.log('Created Image: ' + image);
                        //Create edge
                        imageID = image['@rid'];
                        supportingDoc = db.create('EDGE', 'supporting_doc')
                        .from(imageID).to(configID).one();

                    }
                }
            );
            //image objects: name, path, size, tupe, lastmodified
        }
    }

    private validateNewConfig = () => {
        let pass = true;

        if (this.state.newConfigName.length === 0 || this.state.newConfigDescription.length === 0 ) { //|| typeof this.state.newConfigDocs === 'undefined'
            this.setState({
                errorMsg: 'All fields must have a value'
            });
            pass = false;
        } else {
            this.setState({
                errorMsg: ''
            });
        }

        return pass;
    }

    private getImages = (id) => {
      const images = [1, 2, 3];

      // console.log('trying to get the binary images of', id);
      // export async function updateJsonRep(db, cisID) {

      // const selectList = this.state.cisList.map((cisObj, index) => {
      //     if (this.state.selectedName !== cisObj.name) {
      //       returnList.push({label: cisObj.name, value: cisObj.name, cisObject: JSON.parse(cisObj.jsonRep)});
      //     }
      // });

      return images;
    }

    private render() {
      const tdStyle = {
          verticalAlign: 'middle'
      };

      const configList = this.state.configs.map((config, cIndex) => {
        return  <tr key={cIndex} id={config['@rid']}>
                    <th scope='row' style={tdStyle}>{cIndex}</th>
                    <td style={tdStyle}>{config.name}</td>
                    <td style={tdStyle}>{config.description}</td>
                    <td style={tdStyle}>{this.getImages(cIndex)}</td>
                </tr>;
      });

      return (
        <div>
            <div className='back-btn-container'>
                <button onClick={this.props.backButton}>Back</button>
            </div>
            <div className='page-title'>
                <h2>Configuration Editor</h2>
            </div>
            <Table className='config-list'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Configuration Name</th>
                        <th>Configuration Description</th>
                        <th>Supporting Documents</th>
                    </tr>
                </thead>
                <tbody>
                    {configList}
                    <tr key='newConfig'>
                        <th scope='row' style={tdStyle}><button onClick={this.toggleCreate}>Create New Configuration</button></th>
                        <td style={tdStyle}></td>
                        <td style={tdStyle}></td>
                        <td style={tdStyle}></td>
                    </tr>
                </tbody>
            </Table>
            <Modal show={this.state.modalCreateConfiguration}>
                <ModalHeader>
                    <ModalTitle componentClass='h3'>Create New Configuration</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <form>
                        <FormGroup controlId='newConfigName' bsSize='large'>
                            <ControlLabel>Name</ControlLabel>
                            <FormControl
                            autoFocus={true}
                            type='text'
                            value={this.state.newConfigName}
                            onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup controlId='newConfigDescription' bsSize='large'>
                            <ControlLabel>Description</ControlLabel>
                            <FormControl
                            value={this.state.newConfigDescription}
                            onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup controlId='newConfigDocs'>
                            <ControlLabel>Supporting Documents</ControlLabel>
                            <FormControl onChange={this.handleSelectChange}
                              value={this.state.newConfigDocs}
                              type='file'
                              multiple
                              label='File'
                            />
                        </FormGroup>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <span className='form-error-msg'>{this.state.errorMsg}</span>
                    <button onClick={this.handleCreateConfig}>Create Configuration</button>
                    <button className='btn-red' onClick={this.toggleCreate}>Cancel</button>
                </ModalFooter>
            </Modal>
        </div>
      );

    }

  }
  export default ConfigurationEditor;
