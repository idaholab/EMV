/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*Libraries*/
import * as React from 'react';
import SplitPane from 'react-split-pane'
import {ListGroup, ListGroupItem} from 'react-bootstrap';
/*Custom*/
import {inProgressList} from '../../db/mockAPI';
import {finishList} from '../../db/mockAPI';

/*
  Functionality that shows the scoring list and handles the application's state of which item from the list
  is selected
*/
class ScoringList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      progressList: [],
      selectedName: ''
    };

  }

  private componentDidMount() {

    const self = this;

    const queryResults = this.props.db.select().from(this.props.uid).one()
      .then(
        function(queryR) {
          if (queryR) {
	           console.log('our query', queryR);
	           if(queryR.cis_list_in_progress){
              for (const cisid of queryR.cis_list_in_progress) {
                const query = self.props.db.select().from(cisid.toString()).one()
                    .then(
                      function(query) {
                          self.setState((prevState) => ({
                              progressList: [...prevState.progressList, query]
                          }));
                      }
                    );
            	}
	           } else {
	    	         console.log('Error. progressList found');
             }

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
