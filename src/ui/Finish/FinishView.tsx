/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*Libraries*/
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Tab, Nav, NavItem, Table } from 'react-bootstrap';
import Chart from 'chart.js';
import {Bar} from 'react-chartjs-2';
import Select from 'react-select';
/*Custom*/
import {catStaticData, catStaticAppData} from '../../db/mockAPI';
/*Style*/
const backgroundColor = ['#ffc97f', '#72A5D8', '#D6D872', '#A5D872', '#c9e7db'];

class FinishView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          chartData: {dataSets: [], dataSetsApp: [], categories: [], categoriesApp: [], labels: []},
          datas: { labels: [], datasets: []}
        };
    }

    private async componentDidMount() {
          if (this.props.currentCIS) {
            await this.updateComponent();
          }
    }

    private async componentDidUpdate(prevProps) {
      if (this.props.currentCIS !== prevProps.currentCIS) {
        await this.updateComponent();
      }
    }

    private async updateComponent() {
      // console.log('trying to update chart data');
      await this.props.createChartData(this.props.currentCIS);
      this.setState({chartData: this.props.chartData});
    }

    private handleChange = async (selectedOption) => {
      const tempJsonList = [];
      for (const cisOption of selectedOption) {
          tempJsonList.push(cisOption.cisObject);
      }
      this.props.createSelectedList(tempJsonList);
    }

    private handleSelect = async (eventKey, event) => {
      // console.log('yesssssssssssssss');
      await this.updateComponent();
    }

    private customStyles = {
      option: (base, state) => ({
        ...base,
        'color': 'black',
        'height': '34px',
        'min-height': '24px'
      })
    };

    private render() {

        const tdStyle = {
            verticalAlign: 'middle'
        };

        const dataSets = {
            labels: this.props.chartData.labels,
            datasets: []
        };
        // const dataSets = {
        //     labels: this.state.chartData.labels,
        //     datasets: this.state.chartData.dataSets
        // };

        const dataSetsApp = {
            labels: this.props.chartData.labels,
            datasets: []
        };
        dataSets.datasets = this.props.chartData.dataSets.map((dataset, index) => {
            return(dataset);
        });

        // console.log('in InfoSection finishView dataSets', dataSets);
        dataSetsApp.datasets = this.props.chartData.dataSetsApp.map((dataset, index) => {
            return(dataset);
        });

        const catList = this.state.chartData.categories.map((cat, cIndex) => {
            return  <tr key={cIndex}>
                        <td style={tdStyle}>{cat.name}</td>
                        <td style={tdStyle}>{cat.score}</td>
                    </tr>;
        });

        const catListApp = this.props.chartData.categoriesApp.map((cat, cIndex) => {
            return  <tr key={cIndex}>
                        <td style={tdStyle}>{cat.name}</td>
                        <td style={tdStyle}>{cat.score}</td>
                    </tr>;
        });

        if (!this.props.currentCIS) {
            return (
              <div> Please Select a CIS</div>
            );
        } else {
            return (
                <div>
                    <Tab.Container id='reportView-tabs' defaultActiveKey={0}>
                        <div>
                            <Nav bsStyle='tabs' onSelect={(k) => this.handleSelect(k)}>
                                <NavItem eventKey={0}>Individual View</NavItem>
                                <NavItem eventKey={1}>Comparison View</NavItem>
                            </Nav>
                            <Tab.Content animation>
                                <Tab.Pane eventKey={0}>
                                    <div id='individual-view'>
                                        {/* <h3>Individual Info</h3> */}
                                        <h4>Category Scores</h4>
                                        <Table style={{backgroundColor: '#4C4F5A'}} className='user-list'>
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
                                        <Table style={{backgroundColor: '#4C4F5A'}} className='user-list'>
                                            <thead>
                                                <tr>
                                                    <th>Category</th>
                                                    <th>Score</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {catListApp}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey={1}>
                                    <div id='comparison-view'>
                                        <div id='select-wrapper'>
                                            <Select
                                                isMulti
                                                styles={this.customStyles}
                                                onChange={this.handleChange}
                                                name='comparison'
                                                options={this.props.compareList}
                                                className='our_comparison'
                                                classNamePrefix='select'
                                            />
                                      </div>
                                        {/* <h3>Comparison View</h3> */}
                                        <div id='chart-container'>
                                          <h4>Category Scores</h4>
                                           <div className='report-chart'>
                                              <Bar
                                                data={dataSets}
                                                //data={this.state.chartData}
                                                //width={1000}

                                                //height={600}
                                                options={{
                                                  //responsive: false,
                                                  //maintainAspectRatio: false,
                                                  legend: {
                                                      labels: {
                                                          fontColor: '#f4f4f4'
                                                      }
                                                  },
                                                  scales: {
                                                      xAxes: [{
                                                          stacked: true,
                                                          gridLines: {
                                                              color: '#a3a6ae'
                                                          },
                                                          ticks: {
                                                              fontColor: '#f4f4f4'
                                                          }
                                                      }],
                                                      yAxes: [{
                                                          stacked: true,
                                                          gridLines: {
                                                              color: '#a3a6ae'
                                                          },
                                                          ticks: {
                                                              fontColor: '#f4f4f4'
                                                          }
                                                      }]
                                                  }
                                                }} />
                                          </div>
                                          <br /> <br />
                                            <h4>Category Scores x Applicability</h4>
                                            <div className='report-chart'>
                                                <Bar
                                                  data={dataSetsApp}
                                                  //width={100}
                                                  //height={50}
                                                  options={{
                                                    //maintainAspectRatio: false,
                                                    legend: {
                                                        labels: {
                                                            fontColor: '#f4f4f4'
                                                        }
                                                    },
                                                    scales: {
                                                        xAxes: [{
                                                            stacked: true,
                                                            gridLines: {
                                                                color: '#a3a6ae'
                                                            },
                                                            ticks: {
                                                                fontColor: '#f4f4f4'
                                                            }
                                                        }],
                                                        yAxes: [{
                                                            stacked: true,
                                                            gridLines: {
                                                                color: '#a3a6ae'
                                                            },
                                                            ticks: {
                                                                fontColor: '#f4f4f4'
                                                            }
                                                        }]
                                                    }
                                                  }} />
                                            </div>
                                        </div>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </div>
                    </Tab.Container>
                </div>
            );
        }
    }
}

export default FinishView;
