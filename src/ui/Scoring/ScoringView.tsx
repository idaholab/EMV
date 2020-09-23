/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*Libraries*/
import * as React from 'react';
import ReactDOM from 'reactdom';
import Select from 'react-select';
import SplitPane from 'react-split-pane'
import style from 'bootstrap';
import * as ReactBootstrap from 'react-bootstrap';
import { Nav, NavItem, Tab, Label, Grid, Table, Button, FormGroup, FormControl, ControlLabel, Form, InputGroup, Grid, Row, Col, ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
/*Custom*/
import {updateJsonRep} from './ScoringFuncs';
import InfoSection from './InfoSection';
import emvPresets from '../../db/emvPresets';
/*Style*/
const tdStyle = {
  border: 'none',
};

/*
  Handles functionality for all things scoring within the application
*/
class ScoringView extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      infoSectionUpdate: null,
      cis: null
    };
  }

  private async componentDidMount() {
    await this.updateComponent();
  }

  private async componentDidUpdate(prevProps) {
    if (this.props.currentCIS !== prevProps.currentCIS) {
      await this.updateComponent();
    }
  }

  private async updateComponent() {
    this.setState({cis: this.props.currentCIS});
  }

  private setInfoSection = async (selected) => {
    this.setState({infoSectionUpdate: selected});
  }

  public render() {
    if (!this.props.currentCIS) {
        return (
            <div> Please Select a CIS</div>
        );
    } else {

      const db = this.props.db;
      const cisID = this.props.currentCIS['@rid'].toString();
      const seleted = JSON.parse(this.props.currentCIS.jsonRep);

      return (
        <SplitPane defaultSize='70%' split='vertical'>
          <div id= 'mainDiv'>
          <Grid fluid className='noPadding'>
            <Row style={{ marginleft: 100, marginright: 0 }} className = 'clearfix'>
                <Col className = 'noPadding'>
                <div id = 'ScoreViewCategoryArray'>
                    <CategoryArray key = {this.cisID} db = {this.props.db} currentCIS = {this.props.currentCIS} callBackToInfoSection ={this.setInfoSection.bind(this)} updateInfo = {this.state.infoSectionUpdate} />
                </div>
                </Col>
            </Row>
          </Grid>
          </div>
          <div className = '_infoSection'> <InfoSection db = {this.props.db} currentCIS = {this.props.currentCIS} updateInfo = {this.state.infoSectionUpdate}/> </div>
        </SplitPane>
      );
    }
  }
}
export default ScoringView;

class CategoryArray extends React.Component {

    constructor(props, context) {
      super(props, context);

      this.state = {
        catArray: [],
        selectedCat: null,
        value: null,
        memoHeight: 1
      };
      this.updateComponent = this.updateComponent.bind(this);
      this.handleClearClick = this.handleClearClick.bind(this);
      this.handleSelect = this.handleSelect.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
      this.handleFocus = this.handleFocus.bind(this);
      this.handleNewChange = this.handleNewChange.bind(this);

    }

    private  async componentDidMount() {
      await this.updateComponent();
    }

    private  async componentDidUpdate(prevProps) {
      if (this.props.currentCIS !== prevProps.currentCIS || this.props.updateInfo !== prevProps.updateInfo) {
        await this.updateComponent();
      }
    }

    private  async updateComponent() {
      const cisID = this.props.currentCIS['@rid'].toString();
      const db = this.props.db;
      this.state.catArray = []; // clear category array?
      const catArr = [...this.state.catArray];
      let catindex = 0;

      const queryCategories = await (db.select('in(category_of)').from(cisID).one());
      for (const qCat of queryCategories.in) {
          const curCat = await (db.select().from(qCat.toString()).one());
          catArr[catindex] = {...catArr[catindex], name: curCat.name, categoryID: curCat['@rid'], total: curCat['total_score'], memo: curCat.memo, characteristics: []};
          catindex++;
      }
      this.setState({catArray: catArr});
      if (this.state.selectedCat !== null) {
        this.setState({value: this.state.catArray[this.state.selectedCat].memo}); // reset state value
      } else {
        this.setState({value: this.state.catArray[0].memo}); // reset state value
      }
    }

    //forces this component to update, updates jsonRep, propogates up to ScoringView
    private setCategoryScore = async (selected) => {
      await this.updateComponent();
      // this.state.catArray.map((category, i) => {
      //   console.log('Category Total Updated', category.total);
      // });
      await this.props.callBackToInfoSection(selected);
    }

    private handleClearClick = async (selected) => {
      // TODO: clear the entire sections score
      selected.preventDefault();
    }

    //Sets the category Index to update memofield
    private handleSelect = async (selected) => {
      this.setState({selectedCat: selected}, () => console.log('Updated state selectedCat: ', this.state.selectedCat));
      this.setState({value: this.state.catArray[selected].memo});
    }

    //TODO: updateJsonRep to include memo reasoningField
    private handleBlur = async (key) => {
    console.log('Updating memo field on exit', this.state.value);
      try {
        let catToUpdate = 0;

        if (this.state.selectedCat !== null) {
          catToUpdate = this.state.selectedCat;
        } else {
          catToUpdate = 0;
        }
        const updateSelected = await this.props.db.update(this.state.catArray[catToUpdate].categoryID)
          .set({
            memo: this.state.value
          }).one();
          await this.updateComponent();

        //reset state
        this.setState({value: null});
        // await updateJsonRep(this.props.db, this.props.currentCIS['@rid'].toString());
      } catch (error) {
        console.log('Error in handleMemoChange'. error);
      }
    }

    // Get the state onFocus and then save onBlur.  Need to auto set focuseed state on start
    private handleFocus = async (selected) => {
      // selected.preventDefault();
      try {
        const cisID = this.props.currentCIS['@rid'].toString();
        let catToUpdate = 0;
        if (this.state.selectedCat !== null) {
          catToUpdate = this.state.selectedCat;
        } else {
          catToUpdate = 0;
        }
        const memoField = this.state.catArray[catToUpdate].memo;

        if (memoField !== null) {
          this.setState({value: memoField}, () => console.log('Updated state value: ', this.state.value));
        } else {
          console.log('memoField is null!', memoField);
        }

      } catch (error) {
        console.log('there was an error', error);
      }

    }

    // TODO: dynamically adjust memoHeight based on size of text inside box.
    // rows = {Math.round(this.state.memoHeight)/10}

    private handleNewChange = async (event) => {
      this.setState({value: event.target.value});
      // this.setState({memoHeight: document.getElementById('memo_field').scrollHeight}, console.log(this.state.memoHeight));
    }

    private  render() {
      return (
        <Tab.Container id='CategoryTabs'
          defaultActiveKey={0}
          onSelect={this.handleSelect}
          onLoad={this.handleSelect}
          >

          <Row className='clearfix'>
            <Row className='clearfix'>
              <Nav bsStyle='tabs' stacked = {false}>
              {
                this.state.catArray.map((category, i) => {
                  const x = 'test' + i;
                    return (
                      <NavItem className={x} eventKey= {i} key = {i}> {category.name}</NavItem>
                    );
                })
              }
              </Nav>
            </Row>
            <Row>
              <Tab.Content
                mountOnEnter={true}
                unmountOnExit={true}
                >
                {
                this.state.catArray.map((category, i) => {
                  return(
                    <Tab.Pane eventKey={i} key = {i}>
                      <Table>
                        <thead className='charactistics-list-header'>
                          <tr>
                            <td style={{width: 5 + '%'}} scope = 'row'></td>
                            <td style={{width: 45 + '%'}} align='left' ><span><strong>Attributes  (Weight)</strong></span></td>
                            <td style={{width: 50 + '%'}} > <strong>Description     |     Score</strong></td>
                          </tr>
                        </thead>
                      </Table>
                      {
                        <CharacteristicsArray db = {this.props.db} currentCIS = {this.props.currentCIS} catArray =  {category} callBackToCategoryScore ={this.setCategoryScore.bind(this)} />
                      }
                      <div className = 'catInfo'>
                          {/* <Form onSubmit={this.handleFormSubmit}> */}
                            <Form>
                              <FormControl type='text'
                                id='memo_field'
                                componentClass='textarea'
                                placeholder= 'Score Reasoning'
                                value = {this.state.value || ''}
                                onFocus = {this.handleFocus}
                                onChange = {this.handleNewChange}
                                onBlur = {this.handleBlur}
                              />
                              {/*TODO: Need to implement clearSection*/}
                              {/* <button bssize='sm' onClick={(e) => this.handleClearClick(e)}>
                                Clear Section
                              </button> */}
                              {/* <Button type='submit'> Submit </Button> */}
                          </Form>
                          <font size='4'><strong> {category.name} Total: {category.total}</strong></font>

                       </div>
                    </Tab.Pane>
                  );
                })
              }

              </Tab.Content>
            </Row>
          </Row>
        </Tab.Container>
      );
    }
  }

  class CharacteristicsArray extends React.Component {

      constructor(props, context) {
        super(props, context);

        this.state = {
          charArray: []
        };
        this.updateComponent = this.updateComponent.bind(this);
      }

      private  async componentDidMount() {
        await this.updateComponent();
      }

      private  async componentDidUpdate(prevProps) {
        if (this.props.currentCIS !== prevProps.currentCIS) {
          await this.updateComponent();
        }
      }

      private  async updateComponent() {
        const db = this.props.db;
        const catArray = await this.props.catArray;
        let characindx = 0;
        const queryCharacteristics = await db.select('in(characteristic_of)').from(catArray.categoryID).one();
        const charArr = [...this.state.charArray];
        for (const qChar of queryCharacteristics.in) {
            const curChar = await db.select().from(qChar.toString()).one();
            charArr[characindx] = {...charArr[characindx], name: curChar.name, charID: curChar['@rid'], total: curChar['total_score'], weight: curChar['weight']};
            characindx++;
          }
          this.setState({charArray: charArr});
      }

      //forces this component to update, adds up score, propogates up to Category
      private setCharacteristicScore = async (selected) => {
        await this.updateComponent();
        let categoryTotal = 0;
        let weightTotal = 0;
        this.state.charArray.map((characteristic, i) => {
          categoryTotal += (characteristic.total * characteristic.weight);
          weightTotal += characteristic.weight;
        });

        categoryTotal = (categoryTotal / weightTotal).toFixed(2);
        // updates CategoryWeight = SUM(AttributeWeight/SUM(characteristic[Weight]))
        const updateSelected = await this.props.db.update(this.props.catArray.categoryID)
          .set({
            total_score: categoryTotal
          }).one()
          .then(
            console.log('total score set for category', categoryTotal, this.props.catArray.categoryID);
          )
        await updateJsonRep(this.props.db, this.props.currentCIS['@rid'].toString());
        await this.props.callBackToCategoryScore(selected);
      }

      private  render() {
        return (
          this.state.charArray.map((characteristic, i) => {
            return(
              <div className = 'characteristics-table-container' key={i}>
                <div className = 'characteristics-table-tableflex'>
                  <Table style={{backgroundColor: '#4C4F5A'}} className='characteristics-list'>
                    <thead className='charactistics-section-list-header'>
                        <tr>
                          <td style={{width: 5 + '%'}}  scope = 'row'></td>
                          <th style={{width: 45 + '%'}}>{characteristic.name} - ({characteristic.weight})</th>
                          <td style={{width: 50 + '%', border: 'none'}}></td>
                        </tr>
                    </thead>
                    <tbody>
                      <AttributeArray db = {this.props.db} currentCIS = {this.props.currentCIS} charArray = {characteristic} callBackToCharacteristicScore ={this.setCharacteristicScore.bind(this)}/>
                      <tr key =  'test'>
                        {/* <td style={{width: 5 + '%', border: 'none'}}  scope = 'row'></td> */}
                        <th style={{width: 50 + '%'}}></th>
                        <td style={{width: 50 + '%', border: 'none'}}>
                          {characteristic.name} Total: {characteristic.total.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            );
          }
        );
      }
    }

    class AttributeArray extends React.Component {

        constructor(props, context) {
          super(props, context);

          this.state = {
            attrArray: [],
            attrScore: 0
          };
          this.updateComponent = this.updateComponent.bind(this);
          }

          private  async componentDidMount() {
            await this.updateComponent();
          }

          private  async componentDidUpdate(prevProps) {
            if (this.props.currentCIS !== prevProps.currentCIS) {
              await this.updateComponent();
            }
          }

          private  async updateComponent() {
            const db = this.props.db;
            const charArray = await this.props.charArray;
            let attrindex = 0;
            const queryAttributes = await db.select('in(attribute_of)').from(charArray.charID).one();
            const attrArr = [...this.state.attrArray];
            for (const qAtt of queryAttributes.in) {
                const curAtt = await db.select().from(qAtt.toString()).one();
                attrArr[attrindex] = {...attrArr[attrindex], name: curAtt.name, attrID: curAtt['@rid'], score: curAtt.score, user_weight: curAtt.user_weight, weighted_score: curAtt.weighted_score};
                attrindex++;
            }
            this.setState({attrArray: attrArr});
          }

          //This function adds up all attributes per characteristic section and then multiplys by the weight of the section - saving the result.
          private setAttributeScore = async (selected) => {
            await this.updateComponent();
            let attributeTotal = 0;
            let totalWeight = 0;
            this.state.attrArray.map((attribute, i) => {
              attributeTotal += attribute.weighted_score;
              totalWeight += attribute.user_weight;
            });

            attributeTotal = (attributeTotal / totalWeight).toFixed(2);
            // updates AttributeWeight = SUM(attributes[Rae * Weight]/SUM(attributes[Weight]))
            const updateSelected = await this.props.db.update(this.props.charArray.charID)
              .set({
                total_score: attributeTotal
              }).one()
              .then(
                console.log('total score set', attributeTotal, this.props.charArray.charID);
              )
              await updateJsonRep(this.props.db, this.props.currentCIS['@rid'].toString());
              await this.props.callBackToCharacteristicScore(attributeTotal);
          }

      private render() {
          return (
            this.state.attrArray.map((attribute, i) => {
              return(
                <tr key={i} align='left'>
                  {/* <td style={{width: 5 + '%', border: 'none'}} scope = 'row'> */}
                    {/* <label><input type='checkbox' checked={chosen}/></label> */}
                  {/* </td> */}
                  <td style={{width: 50 + '%', border: 'none'}}>{attribute.name}</td>
                  <td style={{width: 50 + '%', border: 'none'}} align='left'><ScoreArray db = {this.props.db} currentCIS = {this.props.currentCIS} AttrArray = {attribute} callBackToAttributeScore = {this.setAttributeScore.bind(this)} /> </td>
                </tr>
              );
            })
          );
        }
      }

      class ScoreArray extends React.Component {
          constructor(props, context) {
            super(props, context);

            this.state = {
              scoreArray: [],
              selectedOption: {value: null, label: null}
            };

            this.updateComponent = this.updateComponent.bind(this);
            this.updateScore = this.updateScore.bind(this);
            }

            private async componentDidMount() {
              await this.updateComponent();
            }

            private async componentDidUpdate(prevProps) {
              if (this.props.currentCIS !== prevProps.currentCIS) {
                await this.updateComponent();
              }
            }

            private async updateComponent() {
              const db = this.props.db;
              const attrArray = await this.props.AttrArray;
              let scoreindex = 0;
              let clearScore = false;
              const queryScore = await db.select('in(score_guidance_of)').from(attrArray.attrID).one();
              const scoreArr = [...this.state.scoreArray];
              for (const qScore of await queryScore.in) {
                  const curScore = await db.select().from(qScore.toString()).one();
                  const retLabel = curScore.description + ' | ' + curScore.score;
                  const chosen = curScore.chosen;
                  if (chosen === true) {
                    this.setState({selectedOption: {value: scoreindex, label: retLabel}});
                    clearScore = true;
                  }
                  scoreArr[scoreindex] = {...scoreArr[scoreindex], value: scoreindex, score: curScore.score, description: curScore.description, scoreID: curScore['@rid'], label: retLabel, chosen: curScore.chosen};
                  scoreindex++;
              }
              // Tempfix if clearScore is still false after looping through the given score array, then we set selectedOption to null
              // if (clearScore === false) {
              //   this.setState({selectedOption: {value: null, label: 'Select...'}});
              // }
              this.setState({scoreArray: scoreArr});
            }

            private customStyles = {
              option: (base, state) => ({
                ...base,
                'color': 'black',
                'height': '34px',
                'min-height': '24px',
              })
            };

          public updateScore = async function(selected) {
            for (const score of this.state.scoreArray) {
              const reset = await this.props.db.update(score.scoreID)
                .set({
                  chosen: false
                }).all();

            }

            const updateSelected = await this.props.db.update(selected.scoreID)
              .set({
                chosen: true
              }).one();

            const userWeight = this.props.AttrArray.user_weight;
            const finalScore = (userWeight * selected.score).toFixed(2);
            const updateAttribute = await this.props.db.update(this.props.AttrArray.attrID)
              .set({
                score: selected.score,
                weighted_score: finalScore
              }).one();
          };

          private handleChange = async (selectedOption) => {
            console.log('Option Selected', selectedOption);
            this.setState({ selectedOption: selectedOption});
            await this.updateScore(selectedOption);
            await this.props.callBackToAttributeScore({selectedOption});
          }

          private render() {
            return(
              <Select
                styles={this.customStyles}
                  value = {this.state.selectedOption}
                  onChange={this.handleChange}
                  options={this.state.scoreArray}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                    ...theme.colors,
                      text: 'orangered',
                      primary25: 'gray',
                      primary: 'yellow',
                    },
                  })}
                  placeholder='Select...'

              />
            );
          }
        }
}
