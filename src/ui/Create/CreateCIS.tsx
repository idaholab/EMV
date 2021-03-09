/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*Libraries*/
import * as React from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Form } from 'react-bootstrap';
/*Custom*/
import * as emvPresets from '../../db/emvPresets.json';

/*
  Manages the creation of Cyber Issue and moves to the Scoring tab
  TODO: Call CreateFunctions method rather than duplicating inside this file
  TODO: Validate Input and make sure Configuration and Criteria Set are selected
  TODO: Sanitize inputs
  TODO: Allow customizing and selecting different Critera Sets
  TODO: Check to see if CIS is already created  under that name and Configuration
  TODO: Test updating react-bootstrap
*/
class CreateCIS extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cisName: '',
            cisDescription: '',
            cisConfiguration: '',
            criteriaSet: '',
            cisTicket: '',
            cisTicketMemo: '',
            configurations: []
        };
    }
    
    private validateForm() {
        return this.state.cisName.length > 0 && this.state.cisDescription.length > 0 && this.state.cisConfiguration.length >0;
    }

    private componentDidMount() {
        const self = this;
        const queryResults = this.props.db.select().from('Configuration').all()
        .then(
            function(queryResults) {
                self.setState({
                    configurations: queryResults
                });
            }
        );
    }

    private handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value,
        });
    }

    public updateUserWorkFlow = async function(db, cisID) {
        const update = await db.query(
            'UPDATE ' + this.props.uid
            + ' ADD cis_list_in_progress = ' + cisID.toString(),
        );
        console.log('Updated List in Progress');
    };

    public createDefault = async function(db, componentThis) {

        let category = null;
        let categoryOf = null;
        let belongsTo = null;
        let characteristic = null;
        let characteristicOf = null;
        let attribute = null;
        let attributeOf = null;
        let score = null;
        let scoreOf = null;
        let cisID = null;
        let categoryID = null;
        let characteristicID = null;
        let attributeID = null;
        let scoreID = null;
        let cis = null;

        //Create root vertex
        //TODO: Hacky if/else to not submit bad data to db.. sanitize better on html side also
        try{
            if(!this.state.cisName || !this.state.cisDescription || !this.state.cisConfiguration){
                console.log('bad data');
            }else{
                cis = await db.create('VERTEX', 'CIS')
                .set({
                    name: this.state.cisName,
                    description: this.state.cisDescription,
                    configuration: this.state.cisConfiguration,
                    //criteriaSet: this.state.criteriaSet,
                    criteriaSet: 'default',
                    ticket: this.state.cisTicket,
                    ticketMemo: this.state.cisTicketMemo,
                    owner: this.props.uid,
                    status: 'progress'
                }).one();
    
                cisID = cis['@rid'];
                belongsTo = await db.create('EDGE', 'belongs_to')
                .from(cisID).to(this.state.cisConfiguration).one();
    
                //Create categories
                for (const catObj of emvPresets.default) {
                    category = await db.create('VERTEX', 'Category')
                    .set({
                        name: catObj.category,
                        total_score: 0
                    }).one();
    
                    categoryID = category['@rid'];
                    categoryOf = await db.create('EDGE', 'category_of')
                    .from(categoryID).to(cisID).one();
    
                    //Create characteristics
                    for (const charObj of catObj.characteristics) {
                        characteristic = await db.create('VERTEX', 'Characteristic')
                        .set({
                            name: charObj.characteristic,
                            total_score: 0,
                            weight: charObj.weight
                        }).one();
    
                        characteristicID = characteristic['@rid'];
                        characteristicOf = await db.create('EDGE', 'characteristic_of')
                        .from(characteristicID).to('#' + categoryOf.out.cluster + ':' + categoryOf.out.position).one();
    
                        //Create attributes
                        for (const attObj of charObj.attributes) {
                            attribute = await db.create('VERTEX', 'Attribute')
                            .set({
                                name: attObj.attribute,
                                score: 0,
                                user_weight: 1,
                                weighted_score: 0
                            }).one();
    
                            attributeID = attribute['@rid'];
                            attributeOf = await db.create('EDGE', 'attribute_of')
                            .from(attributeID).to('#' + characteristicOf.out.cluster + ':' + characteristicOf.out.position).one();
    
                            //Create Score Guidances
                            for (const scoreObj of attObj.scores) {
                                score = await db.create('VERTEX', 'Score')
                                .set({
                                    description: scoreObj.description,
                                    score: scoreObj.score,
                                    chosen: false
                                }).one();
    
                                scoreID = score['@rid'];
                                scoreOf = await db.create('EDGE', 'score_guidance_of')
                                .from(scoreID).to('#' + attributeOf.out.cluster + ':' + attributeOf.out.position).one().then();
                            }
                        }
                    }
                }
                await this.updateUserWorkFlow(db, cisID);
                await this.updateJsonRep(db, cisID);
                await this.updateCurrentCIS(db, cisID, componentThis);
    
                //Go to Scoring View
                componentThis.props.changeTab(componentThis.props.scoreTabKey);
            }
            
        }catch{
            console.log('something wrong with input');
        }
    };

    public updateJsonRep = async function(db, cisID) {
        const curCIS = await db.select().from(cisID.toString()).one();

        const jsToJSON = {criteriaDefault: [], name: curCIS.name, description: curCIS.description};
        let catIndex = -1;
        let charIndex = -1;
        let attIndex = -1;
        let scoreIndex = -1;

        const queryCategories = await db.select('in(category_of)').from(cisID.toString()).one();
        for (const qCat of queryCategories.in) {
            const curCat = await db.select().from(qCat.toString()).one();
            const curCatID = curCat['@rid'];
            jsToJSON.criteriaDefault.push({category: curCat.name, total_score: curCat.total_score, characteristics: []});
            catIndex++;
            const queryCharacteristics = await db.select('in(characteristic_of)').from(curCatID.toString()).one();
            for (const qChar of queryCharacteristics.in) {
                const curChar = await db.select().from(qChar.toString()).one();
                const curCharID = curChar['@rid'];
                jsToJSON.criteriaDefault[catIndex].characteristics.push({characteristic: curChar.name, total_score: curChar.total_score, weight: curChar.weight, attributes: []});
                charIndex++;
                const queryAttributes = await db.select('in(attribute_of)').from(curCharID.toString()).one();
                for (const qAtt of queryAttributes.in) {
                    const curAtt = await db.select().from(qAtt.toString()).one();
                    const curAttID = curAtt['@rid'];
                    jsToJSON.criteriaDefault[catIndex].characteristics[charIndex].attributes.push({attribute: curAtt.name, score: curAtt.score, user_weight: curAtt.user_weight, weighted_score: curAtt.weighted_score, scores: []});
                    attIndex++;
                    const queryScores = await db.select('in(score_guidance_of)').from(curAttID.toString()).one();
                    for (const qScore of queryScores.in) {
                        const curScore = await db.select().from(qScore.toString()).one();
                        const curScoreID = curScore['@rid'];
                        jsToJSON.criteriaDefault[catIndex].characteristics[charIndex].attributes[attIndex].scores.push({description: curScore.description, score: curScore.score, chosen: curScore.chosen});
                        scoreIndex++;
                    }
                    scoreIndex = -1;
                }
                attIndex = -1;
            }
            charIndex = -1;
        }

        //Update jsonRep CIS property
        const update = await db.update(cisID.toString())
        .set({
            jsonRep: JSON.stringify(jsToJSON);
        }).one();

    };

    public updateCurrentCIS = async function(db, cisID, componentThis) {
        const curCIS = await db.select().from(cisID.toString()).one();
        componentThis.props.setCurrentCIS(curCIS);
        // componentThis.props.setCurrentCISID(cisID);
    };

    public createCIS = (event) => {

        event.preventDefault();

        const db = this.props.db;
        this.createDefault(db, this);

    }

    /*    //This is to be added to render() below when criteriaSets can be edited within the application.
          //'default' is the only currently working criteriaSet

    <div id='cis-criteria-wrapper'>
        <FormGroup controlId='criteriaSet'>
            <ControlLabel>Criteria Set</ControlLabel>
            <FormControl componentClass='select' onChange={this.handleChange}>
                <option value='' disabled selected hidden>Select Criteria Set</option>
                <option value='default'>Default</option>
            </FormControl>
        </FormGroup>
    </div>*/

    public render() {

        const configList = this.state.configurations.map((conFig, cIndex) => {
                return <option key={cIndex} value={conFig['@rid'].toString()}>{conFig.name}</option>;
        });

        return (
            <div>
                <form id='create-cis-container'
                    onSubmit={this.props.handleSubmit}>
                    <div id='cis-config-wrapper'>
                        <FormGroup controlId='cisConfiguration'>
                            <ControlLabel>Configuration</ControlLabel>
                            <FormControl componentClass='select' onChange={this.handleChange} required>
                                <option value='' disabled selected hidden>Select Configuration</option>
                                {configList}
                            </FormControl>
                        </FormGroup>
                    </div>
                    <div id='cis-name-wrapper'>
                        <FormGroup controlId='cisName' bsSize='large'>
                            <ControlLabel>CIS Name</ControlLabel>
                            <FormControl
                            type='text'
                            value={this.state.cisName}
                            onChange={this.handleChange}
                            required
                            />
                        </FormGroup>
                    </div>
                    <div id='cis-ticket-wrapper'>
                        <FormGroup controlId='cisTicket' bsSize='large'>
                            <ControlLabel>Ticket #</ControlLabel>
                            <FormControl
                            type='text'
                            value={this.state.cisTicket}
                            onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                    <div id='cis-ticket-memo-wrapper'>
                        <FormGroup controlId='cisTicketMemo' bsSize='large'>
                            <ControlLabel>Ticket Memo</ControlLabel>
                            <FormControl
                            type='text'
                            value={this.state.cisTicketMemo}
                            onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                    <div id='cis-desc-wrapper'>
                        <FormGroup controlId='cisDescription' bsSize='large'>
                            <ControlLabel>CIS Description</ControlLabel>
                            <FormControl
                            type='text'
                            value={this.state.cisDescription}
                            onChange={this.handleChange}
                            required
                            />
                        </FormGroup>
                    </div>
                    <div id='cis-button-wrapper'>
                        <Button
                        block={true}
                        bsSize='large'
                        disabled={!this.validateForm()}
                        onClick={this.createCIS}
                        type='submit'
                        >
                        Begin Scoring
                        </Button>
                    </div>
                    
                </form>
            </div>
        );

    }
}

export default CreateCIS;
