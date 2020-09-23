/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*Libraries*/
import * as React from 'react';
import {Table, FormGroup, Button, ButtonToolbar, ControlLabel, FormControl, Label, Col, Form, Row, Grid} from 'react-bootstrap';
import { VictoryPie, VictoryStack, VictoryBar, VictoryScatter, VictoryTooltip } from 'victory';
/*Custom*/
import handleClearClick from './Scoring/ScoringView';
/*Style*/
const tdStyle = {
    verticalAlign: 'middle'
};
let select = '';

/*
  Manages InfoSection which is the pane to the right of the Scoring tab
  Included here is the piegraph, name/config/ticket # and graphics for Category Scores and Category Scores x Applicability
  TODO: Move this to score & track state there. Otherwise, make a call to the criteria set to populate description lists
*/
export default class InfoSection extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      catArray: [],
      configuration: null
    };
    this.updateComponent = this.updateComponent.bind(this);
    this.getConfig = this.getConfig.bind(this);
    this.getCatAppScore = this.getCatAppScore.bind(this);
    this.getCatScore = this.getCatScore.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  private async componentDidMount() {
    this.updateComponent();
  }

  private async componentDidUpdate(prevProps) {
    if (this.props.updateInfo !== prevProps.updateInfo || this.props.currentCIS !== prevProps.currentCIS) {
      this.updateComponent();
    }
  }

  private async updateComponent() {
    const cisID = this.props.currentCIS['@rid'].toString();
    const configuration = this.props.currentCIS['configuration'];
    const db = this.props.db;
    const catArr = [...this.state.catArray];
    let catindex = 0;
    const conf = await (this.props.db.select().from(configuration.toString()).one());
    const queryCategories = await (db.select('in(category_of)').from(cisID).one());

    for (const qCat of queryCategories.in) {
        const curCat = await (db.select().from(qCat.toString()).one());
        catArr[catindex] = {...catArr[catindex], name: curCat.name, categoryID: curCat['@rid'], total: curCat['total_score'], characteristics: []};
        catindex++;
    }
    this.setState({
      configuration: conf,
      catArray: catArr
    });
  }

  //change from Victory to ChartsjS
  private getDataSet = () => {
    try {
      if (this.props.currentCIS == null || JSON.parse(this.props.currentCIS.jsonRep) === '') {
        console.log('Error, we are null, make sure this.props.select is passed in...');
        select = '';
      } else {
          select = this.state.catArray.map((category, i) => {
            if (category.name !== 'Applicability' && category.total !== 0) {
                const retLabel = category.name + ' | ' + category.total;
                return {y: category.total, x: category.total, label: retLabel};
            }
          });
        return select;
      }
    } catch (error) {
      console.log('getDataSet in InfoSection', error);
    }
  }

  private handleSubmit = async (event) => {

    event.preventDefault();
    console.log(this.props.currentCIS);

    const queryCategories = await this.props.db.update(this.props.currentCIS['@rid'])
      .set({
        status: 'finished'
      }).one();
  }

private  getCatScore = () => {
    try {
      const chartCats = [];
      const sel = this.state.catArray.map((category, i) => {
          if (category.name !== 'Applicability') {
            chartCats.push({name: category.name, score: category.total.toFixed(2)});
          }
      });
      return chartCats;
    } catch (error) {
      console.log('getCatScore in InfoSection', error);
    }
  }

  private getCatAppScore = () => {
      try {
        let chartCatsApp = [];
        let applicabilityNum = 1;
        //find applicability num
        this.state.catArray.map((category, i) => {
            if (category.name === 'Applicability') {
              applicabilityNum = category.total;
            }
        });
        this.state.catArray.map((category, i) => {
          if (category.name !== 'Applicability') {
            chartCatsApp.push({name: category.name, score: (category.total * applicabilityNum).toFixed(2)});
          }
        });

        return chartCatsApp;
      } catch (error) {
        console.log('getCatAppScore in InfoSection', error);
      }
  }

  private getConfig = (configuration) => {
    try {
      let con = null;
      if (configuration !== this.state.configuration['@rid'].toString()) {
        console.log('configuration rids dont match');
        con = this.state.configuration['name'];

      } else {
        con = this.state.configuration['name'];
      }
      return con;
    } catch (error) {
      console.log('getConfig in InfoSection', error);
    }
  }

  private render() {

    const cisID = this.props.currentCIS['@rid'].toString();
    const criteriaSet = this.props.currentCIS['criteriaSet'];
    const configuration = this.props.currentCIS['configuration'];
    const ticket = this.props.currentCIS['ticket'];
    const ourConfig = this.getConfig(configuration);
    const dataSet = this.getDataSet();
    const CatScores = this.getCatScore();
    const CatAppScores = this.getCatAppScore();

    const catList = CatScores.map((cat, cIndex) => {
        return  <tr key={cIndex}>
                    <td >{cat.name}</td>
                    <td >{cat.score}</td>
                </tr>;

    });

    const catAppList = CatAppScores.map((cat, cIndex) => {
        return  <tr key={cIndex}>
                    <td >{cat.name}</td>
                    <td >{cat.score}</td>
                </tr>;
    });

    return (

      <div id='InfoSection'>

        <h2>{this.props.currentCIS.name}</h2>

        <div id = 'info'>
          <span>
          <p>
            Configuration: <Label>{ourConfig}</Label>
          </p>
          <p>
            Ticket #: <Label>{ticket}</Label>
          </p>
          </span>
        </div>
        <div>

          <VictoryPie
            style={{ labels: { fill: 'black', fontSize: 10, fontWeight: 'bold' } }}
            cornerRadius={25}
            labelRadius={10}
            //colorScale={['#eb7777', '#ffc97f', '#72A5D8', '#D6D872', '#A5D872', '#c9e7db' ]}
            colorScale={['#332288', '#CC6677', '#DDCC77', '#88CCEE', '#44AA99', '#117733', '#333333']}
            labelComponent={
              <VictoryTooltip angle={-35}/>
            }
            data={dataSet}
            x='x'
            y='y'
          />

          <div id='info-user-view'>
              <h4>Category Scores</h4>
              <Table style={{backgroundColor: '#4C4F5A'}} className='info-user-list'>
                  <thead>
                      <tr>
                          <th>Category</th>
                          <th>Score</th>
                      </tr>
                  </thead>
                  <tbody>
                    {catList}
                  </tbody>
              </Table>
              <h4>Category Scores x Applicability</h4>
              <Table style={{backgroundColor: '#4C4F5A'}} className='info-user-list'>
                  <thead>
                      <tr>
                          <th>Category</th>
                          <th>Score</th>
                      </tr>
                  </thead>
                  <tbody>
                    {catAppList}
                  </tbody>
              </Table>
          </div>
        </div>

        <form onSubmit={this.handleSubmit}>
            <button onClick={(e) => this.handleSubmit(e)}>
                Submit CIS
            </button>
        </form>

      </div>

    );
  }

}
