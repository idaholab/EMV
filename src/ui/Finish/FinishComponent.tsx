/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*Libraries*/
import * as React from 'react';
import SplitPane from 'react-split-pane'
/*Custom*/
import FinishList from './FinishList';
import FinishView from './FinishView';
/*Style*/
const divStyle = {
  height: '95%',
};

const backgroundColors = ['#CC6677', '#DDCC77', '#88CCEE', '#44AA99', '#117733', '#332288', '#AA4499', '#882255'];
//const backgroundColors = ['#ffc97f', '#72A5D8', '#D6D872', '#A5D872', '#c9e7db'];
//const backgroundColors = ['rgba(255,201,127,0.9)', 'rgba(114,165,216,0.9)', 'rgba(214,216,114,0.9)', 'rgba(165,216,113,0.9)', 'rgba(201,231,219,0.9)'];
const borderColors = ['#CC6677', '#DDCC77', '#88CCEE', '#44AA99', '#117733', '#332288', '#AA4499', '#882255'];
//const borderColors = ['#ffc98b', '#72A5Da', '#D6D87f', '#A5D873', '#c9e7df'];
//const borderColors = ['rgba(255,201,139,0.9)', 'rgba(114,165,218,0.9)', 'rgba(214,216,127,0.9)', 'rgba(165,216,114,0.9)', 'rgba(201,231,223,0.9)'];
const bColorSize = 8;

/*
  Report tab component handler
*/
class FinishComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            chartData: {dataSets: [], dataSetsApp: [], categories: [], categoriesApp: [], labels: []},
            comparisonCisSelected: [],
            compareList : []
        };

        this.createChartData = this.createChartData.bind(this);
        this.createSelectedList = this.createSelectedList.bind(this);
        this.createCompareList = this.createCompareList.bind(this);
    }
    private async componentDidMount() {
      this.createChartData(this.props.currentCIS);
    }

    public createCompareList = (cisList) => {
        this.setState({
            compareList: cisList
        });
    }

    public createSelectedList = async (cisJsonList) => {
            await this.setState({
                comparisonCisSelected: cisJsonList
            });
            this.createChartData(this.props.currentCIS);
    }

    private populateInitialDataSet = async (currentCisJsonRepObj) => {
      const tempChartData = [];
      const tempChartDataApplicability = [];
      const chartDataObject = {};
      const chartCats = [];
      const catLabels = [currentCisJsonRepObj.name];
      const chartCatsApp = [];
      let applicabilityNum = 1;
      for (const [cIndex, catObj] of currentCisJsonRepObj.criteriaDefault.entries()) {
          if (catObj.category !== 'Applicability') {
              tempChartData.push({label: catObj.category,
                                  backgroundColor: backgroundColors[(cIndex - 1) % bColorSize],
                                  borderColor: borderColors[(cIndex - 1) % bColorSize],
                                  borderWidth: 1,
                                  hoverBackgroundColor: backgroundColors[(cIndex - 1) % bColorSize],
                                  hoverBorderColor: borderColors[(cIndex - 1) % bColorSize],
                                  data: [catObj.total_score.toFixed(2)]});
              chartCats.push({name: catObj.category, score: catObj.total_score.toFixed(2)});
          } else {
              applicabilityNum = catObj.total_score;
          }
      }
      //Create chart x Applicability
      for (const [cIndex, catObj] of currentCisJsonRepObj.criteriaDefault.entries()) {
          if (catObj.category !== 'Applicability') {
              tempChartDataApplicability.push({label: catObj.category,
                                  backgroundColor: backgroundColors[(cIndex - 1) % bColorSize],
                                  borderColor: borderColors[(cIndex - 1) % bColorSize],
                                  borderWidth: 1,
                                  hoverBackgroundColor: backgroundColors[(cIndex - 1) % bColorSize],
                                  hoverBorderColor: borderColors[(cIndex - 1) % bColorSize],
                                  data: [(catObj.total_score * applicabilityNum).toFixed(2)]});
              chartCatsApp.push({name: catObj.category, score: (catObj.total_score * applicabilityNum).toFixed(2)});
          }
      }

      chartDataObject.dataSets = tempChartData;
      chartDataObject.dataSetsApp = tempChartDataApplicability;
      chartDataObject.categories = chartCats;
      chartDataObject.categoriesApp = chartCatsApp;
      chartDataObject.labels = catLabels;

      return chartDataObject;
    }

    private appendToInitialDataSet = async (cisJson, chartDataObject) => {
        let applicabilityNum = 1;
        chartDataObject.labels.push(cisJson.name);
        for (const [cIndex, catObj] of cisJson.criteriaDefault.entries()) {
            if (catObj.category !== 'Applicability') {
                chartDataObject.dataSets[cIndex - 1].data.push(catObj.total_score.toFixed(2));
            } else {
                applicabilityNum = catObj.total_score;
            }
        }
        //Create chart x Applicability
        for (const [cIndex, catObj] of cisJson.criteriaDefault.entries()) {
            if (catObj.category !== 'Applicability') {
                chartDataObject.dataSetsApp[cIndex - 1].data.push((catObj.total_score * applicabilityNum).toFixed(2));
            }
        }
        return chartDataObject;
    }

    // Takes in current and list of not current
    private createChartData = async (currentCIS) => {
      let currentCisJsonRepObj = '';
	    if(currentCIS !== null){
		      currentCisJsonRepObj = JSON.parse(currentCIS.jsonRep);
		      let chartDataObject = await this.populateInitialDataSet(currentCisJsonRepObj);

        	//Add extra datasets
        	if (this.state.comparisonCisSelected.length > 0) {
            	for (const cis of this.state.comparisonCisSelected) {
               		 chartDataObject = await this.appendToInitialDataSet(cis, chartDataObject);
            	}
        	}

        	this.setState({
            		chartData: chartDataObject
        	});
	    }
    }

    public render() {
        return (
            <SplitPane defaultSize='15%' split='vertical'  style={divStyle}>
                <div id='FinishList'>
                    <FinishList db={this.props.db} currentCIS={this.props.currentCIS} setCurrentCIS={this.props.setCurrentCIS} createChartData={this.createChartData} createCompareList = {this.createCompareList}/>
                </div>
                <div id='FinishView'>
                    <FinishView  db={this.props.db} currentCIS={this.props.currentCIS} setCurrentCIS={this.props.setCurrentCIS} createChartData={this.createChartData} chartData={this.state.chartData} createCompareList={this.createCompareList} compareList={this.state.compareList} createSelectedList={this.createSelectedList}/>
                </div>
            </SplitPane>
        );
    }
}

export default FinishComponent;
