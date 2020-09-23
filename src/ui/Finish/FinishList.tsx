/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*Libraries*/
import * as React from 'react';
import SplitPane from 'react-split-pane'
/*Custom*/
import {ListGroup, ListGroupItem} from 'react-bootstrap';

/*
  Handles the list when moving to 'Finished'
  TODO: Make sure state is set when mounting (ala. fix the issue when scoring an object and never 'selecting' the CIS you are scoring showing blank on report view)
  TODO: rename to ReportView
*/
class FinishList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cisList: [],
            cisFinishList: [],
            selectedName: ''
        };
    }

    private componentDidMount() {
        const self = this;
        const queryResults = this.props.db.select().from('CIS').all()
        .then(
            function(queryR) {
                if (queryR) {
                    self.setState({
                        cisList: queryR
                    });
                    if (self.props.currentCIS) {
                        self.setState({
                            selectedName: self.props.currentCIS.name
                        });
                        const tempCisList = [];
                        for (const cis of queryR) {
                            if (cis.name !== self.props.currentCIS.name) {
                                tempCisList.push({label: cis.name, value: cis.name, cisObject: JSON.parse(cis.jsonRep)});
                            }
                        }
                        self.props.createCompareList(tempCisList);
                        self.props.createChartData(self.props.currentCIS);
                    }
                } else {
                    console.log('Error. No CIS array found in FinishList');
                }
            }
          );
    }

    private handleClick = async (selected) => {
        this.setState({ selectedName: selected.name });
        const returnList = [];
        await this.props.setCurrentCIS(selected);
        const selectList = this.state.cisList.map((cisObj, index) => {
            if (this.state.selectedName !== cisObj.name) {
              returnList.push({label: cisObj.name, value: cisObj.name, cisObject: JSON.parse(cisObj.jsonRep)});
            }
        });

        this.props.createCompareList(returnList);
        this.props.createChartData(this.props.currentCIS);
    }

    public render() {

        const lgiStyle = {
            textAlign: 'center',
            fontSize: '1.2em',
        };

        const wTotalScores = this.state.cisList.map((cisObj, index) => {
            let totalScore = 0;
            let applicability = 0;
            for (const cat of JSON.parse(cisObj.jsonRep).criteriaDefault) {
                if (cat.category === 'Applicability') {
                    applicability = parseFloat(cat.total_score);
                }
            }
            for (const cat of JSON.parse(cisObj.jsonRep).criteriaDefault) {
                if (cat.category !== 'Applicability') {
                    totalScore += (cat.total_score * applicability);
                }
            }
            cisObj.total_score = totalScore.toFixed(2);
            return(cisObj);
        });

        wTotalScores.sort(function(a, b) {
            return b.total_score - a.total_score;
        });

        //const progressList = this.state.cisList.map((cisObj, index) => {
        const progressList = wTotalScores.map((cisObj, index) => {
            if (cisObj.status === 'progress') {
              if (this.state.selectedName === cisObj.name) {
                // console.log('we ARE active', this.state.selectedName);
                  return(
                      <ListGroupItem style={lgiStyle} key={index} onClick={ () => this.handleClick(cisObj)} active>{cisObj.name}</ListGroupItem>
                  );
              } else {
                // console.log('we ARENT not active', this.state.selectedName);
                  return(
                      <ListGroupItem style={lgiStyle} key={index} onClick={ () => this.handleClick(cisObj)}>{cisObj.name}</ListGroupItem>
                  );
              }
            }
        });

        //const finishList = this.state.cisList.map((cisObj, index) => {
        const finishList = wTotalScores.map((cisObj, index) => {
          if (cisObj.status === 'finished') {
            if (this.state.selectedName === cisObj.name) {
                return(
                    <ListGroupItem style={lgiStyle} key={index} onClick={ () => this.handleClick(cisObj)} active>{cisObj.name}</ListGroupItem>
                );
            } else {
                return(
                    <ListGroupItem style={lgiStyle} key={index} onClick={ () => this.handleClick(cisObj)}>{cisObj.name}</ListGroupItem>
                );
            }
          }

        });

        return (
            <div id='FinishList'>
                <div className='CisList'>
                    <h4>Sorted: Total x Applicability</h4>
                    <h2>Finished CIS</h2>
                    <ListGroup>
                        {finishList}
                    </ListGroup>
                    <h2>In Progress CIS</h2>
                    <ListGroup>
                        {progressList}
                    </ListGroup>
                </div>
            </div>
        );
    }
}

export default FinishList;
