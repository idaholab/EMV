/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

/*Libraries*/
import * as React from 'react';
import {vulnOptions} from '../db/mockAPI';
import Select, { components } from 'react-select';
import {Form, Button, FormGroup, FormControl, ControlLabel, Grid, Row, Col} from 'react-bootstrap';

const Placeholder = (props) => {
  return (
    <components.Placeholder {...props}/>
  );
};

const searchStyle = { width: 200, margin: '0 auto 10px' };

/*
  Search functionality that is in a semi-broken state
  Not currently used, leaving for future
  TODO: Finish implementing.  The idea was to have a search to external websites and reference points so one can from within the application
  Search Google or other online resources for what they want to reference.
*/
export default class SearchBars extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  private handleSearchSubmit = async (selected) => {
    // TODO: clear the entire sections score
    selected.preventDefault();
  }

  private customStyles = {
    option: (base, state) => ({
      ...base,
      'color': 'black',
      'height': '34px',
      'min-height': '24px',
    });
  };

  private render() {
    return (
      <Form >
        <Row className='show-grid' id = '_searchBars'>
          <Col md={4} >
            <FormGroup controlId='SearchVulnBar' validationState={null}>
              <FormControl style={searchStyle} type='text' placeholder='Search String Here'/>
            </FormGroup>
          </Col>
          <Col md={4} >
            <Select
              width={200}
              autosize={false}
              closeMenuOnSelect={true}
              components={{ Placeholder }}
              placeholder={'Search Vulnerability Databases...'}
              styles={this.customStyles}
              options={vulnOptions}
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
            />
          </Col>
          <Col md={4}>
            <button bssize='sm' onClick={(e) => this.handleSearchSubmit(e)}>
              Search
            </button>
            {/* <Button type='submit'>Search</Button> */}
          </Col>

        </Row>

    </Form>

    );
  }
}
