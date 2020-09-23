/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import * as React from 'react';
import * as SplitPane from 'react-split-pane';
import {inProgressList} from '../../db/mockAPI';
import {finishList} from '../../db/mockAPI';

import {ListGroup, ListGroupItem} from 'react-bootstrap';

class ScoringList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      progressList: [],
      selectedName: ''
    };

  }
  /*TODO: Check if empty*/
  private componentDidMount() {

    const self = this;
    // const queryResults = this.props.db.select().from('CIS').all()
    // .then(
    //     function(queryR) {
    //        console.log('AAH', queryR);
    //         if (queryR) {
    //             self.setState({
    //                 progressList: queryR
    //             });
    //         } else {
    //             console.log('Error. No CIS array found in progressList');
    //         }
    //     }
    const queryResults = this.props.db.select().from(this.props.uid).one()
      .then(
        function(queryR) {
          if (queryR) {
            for (const cisid of queryR.cis_list_in_progress) {
              const query = self.props.db.select().from(cisid.toString()).one()
                .then(
                  function(query) {
                    self.setState((prevState) => ({
                      progressList: [...prevState.progressList, query]
                    });
                  }
                );
            }
            // self.setState({
            //     progressList: queryR.cis_list_in_progress.toString()
            // });
            // console.log(this.state.progressList);

          } else {
            console.log('Error. No CIS array found in progressList');

          }
        }

    );
  }

  private handleClick = async (selected) => {
    this.setState({ seletedName: selected.name });
    await this.props.setCurrentCIS(selected);
  }

  public render() {

      const lgiStyle = {
          textAlign: 'center',
          fontSize: '1.2em',

      };

      const thisList = this.state.progressList.map((ListItem, index) => {
            const name = ListItem.name;
            // // if (this.props.currentCis);
            // if (this.state.selectedName === name) {
            //     return(
            //         <ListGroupItem style={lgiStyle} key = {index} onClick={ () => this.handleClick(ListItem)} active>{name}</ListGroupItem>
            //     );
            // } else {
            //     return(
            //         <ListGroupItem style={lgiStyle} key = {index} onClick={ () => this.handleClick(ListItem)}>{name}</ListGroupItem>
            //     );
            // }
            // if (this.props.defaultCis) {
            //     if (name === this.props.defaultCis.name) {
            if (this.props.currentCIS) {
                if (name === this.props.currentCIS.name) {
                    return(
                        <ListGroupItem style={lgiStyle} key = {index} onClick={ () => this.handleClick(ListItem)} active>{name}</ListGroupItem>
                    );

                } else {
                    return(
                        <ListGroupItem style={lgiStyle} key = {index} onClick={ () => this.handleClick(ListItem)}>{name}</ListGroupItem>
                    );
                }
            } else {
                return(
                    <ListGroupItem style={lgiStyle} key = {index} onClick={ () => this.handleClick(ListItem)}>{name}</ListGroupItem>
                );
            }

      });

    return (

      <div id='ScoringList'>

        <div className='CisList'>
          <ListGroup>
            {
              thisList
            }
          </ListGroup>
        </div>

      </div>

    );
  }
}

export default ScoringList;
