/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*Libraries*/
import * as React from 'react';
// import * as SplitPane from 'react-split-pane';
import SplitPane from 'react-split-pane'
/*Custom*/
import InfoSection from '../InfoSection';
import ScoringList from './ScoringList';
import ScoringView from './ScoringView';
import SearchBars from '../SearchBars';
/*Style*/
const divStyle = {
  height: '95%',
};

/*
  Scoring tab component handler
*/
class ScoringComponent extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        selectedItem: null,
        selectedID: 'empty'
      };
  }

  public render() {
    return (
      <SplitPane className = 'scorePane' defaultSize='15%' split='vertical' style={divStyle} >
        <div>
            <ScoringList db = {this.props.db} uid={this.props.uid} setCurrentCIS={this.props.setCurrentCIS} currentCIS={this.props.currentCIS} />
        </div>
        <div>
              {/* <SplitPane overflow = 'auto' defaultSize='85%' split='horizontal'> */}
                <div className ='ScoringView'><ScoringView db = {this.props.db} setCurrentCIS={this.props.setCurrentCIS} currentCIS={this.props.currentCIS}/></div>
                {/* <div className = 'searchBars'><SearchBars /></div> */}
              {/* </SplitPane> */}

        </div>
      </SplitPane>
    );
  }
}
export default ScoringComponent;
