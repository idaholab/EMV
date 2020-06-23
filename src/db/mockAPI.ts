/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import emvPresets from './emvPresets';
const DATA_LOAD = 'DATA_LOADED';

export function fetchData() {
    return Promise.resolve(emvPresets);
}

export function loadMockData() {
    return (dispatch, getState) => {
        fetchData()
            .then((data) => {
                dispatch({
                    type : DATA_LOAD,
                    payload : data
                });
            });
    };
}

//TODO: Convert to functions that call database and filter based on finish or in progress
export const finishList = [
  { value: 'finish1', label: 'WannaCry 2017'},
  { value: 'finish2', label: 'Industroyer 2016'},
  { value: 'finish3', label: 'Authentication Buffer Overflow'},
  { value: 'finish4', label: 'Black Energy v2'},
];

export const inProgressList = [
  { value: 'prog1', label: 'Black Energy v3'},
  { value: 'prog2', label: 'VPNFilter'},
  { value: 'prog3', label: 'ExternalBlue'},
  { value: 'prog4', label: 'Notpetya'},
  { value: 'prog5', label: 'DNC Hack'},
];

export const vulnOptions = [
  { value: 'site1', label: 'US-Cert', url: 'https://www.us-cert.gov/'},
  { value: 'site2', label: 'National Vulnerability Database', url: 'https://nvd.nist.gov/vuln/search'},
  { value: 'site3', label: 'MITRE CVE Database', url: 'https://cve.mitre.org/'},
  { value: 'site4', label: 'Exploit-DB', url: 'https://www.exploit-db.com/'},
  { value: 'site5', label: 'Google', url: 'https://www.google.com/'},
];

/*TODO: Make a button/model or section with instructions in table format*/
export const instructions = [
      {
        'step': '1',
        'instruction': 'Identify and define the configuration to be evaluated'
      },
      {
        'step': '2',
        'instruction': 'Review and set the weighting of the characteristics and attributes'
      },
      {
        'step': '3',
        'instruction': 'Define/Identify EMVs to be evaluated'
      },
      {
        'step': '4',
        'instruction': 'Determine if EMV is applicable to configuration. If applicability score = 0, then stop and go to next EMV. Otherwise, proceed'
      },
      {
        'step': '5',
        'instruction': 'Score the Adversary, EMV, Ability to Defend and Consequence Elements'
      },
      {
        'step': '6',
        'instruction': 'Review the Estimated Relative Importance of the EMV'
      }
];

export const catStaticData = {
        labels: ['Authentication Buffer Overflow', 'Ukraine 2015', 'WannaCry', 'Industroyer', 'VPNFilter'], //, 'VPNFilter'
        datasets: [
          {
            label: 'Adverary',
            backgroundColor: '#ffc97f',
            borderColor: '#ffc98b',
            borderWidth: 1,
            hoverBackgroundColor: '#ffc97f',
            hoverBorderColor: '#ffc98b',
            data: [0.27, 0.9, 0.88, 0.67, 0.63]
          },
          {
            label: 'Exploit, Malware and Vulnerability',
            backgroundColor: '#72A5D8',
            borderColor: '#72A5Da',
            borderWidth: 1,
            hoverBackgroundColor: '#72A5D8',
            hoverBorderColor: '#72A5Da',
            data: [0.26, 0.84, 0.56, 0.75, 0.60]
          },
          {
            label: 'Defense Complexity',
            backgroundColor: '#D6D872',
            borderColor: '#D6D87f',
            borderWidth: 1,
            hoverBackgroundColor: '#D6D872',
            hoverBorderColor: '#D6D87f',
            data: [0.38, 0.74, 0.56, 0.55, 0.45]
          },
          {
            label: 'Control Consequences',
            backgroundColor: '#A5D872',
            borderColor: '#A5D873',
            borderWidth: 1,
            hoverBackgroundColor: '#A5D872',
            hoverBorderColor: '#A5D873',
            data: [0, 0.85, 0.15, 0.75, 0.95]
          },
          {
            label: 'Company Consequences',
            backgroundColor: '#c9e7db',
            borderColor: '#c9e7df',
            borderWidth: 1,
            hoverBackgroundColor: '#c9e7db',
            hoverBorderColor: '#c9e7df',
            data: [0, 0.74, 0.17, 0.7, 0.5]
          }
        ]
      };

export const catStaticAppData = {
        labels: ['Authentication Buffer Overflow', 'Ukraine 2015', 'WanaCry', 'Industroyer', 'VPNFilter'], //, 'VPNFilter'
        datasets: [
          {
            label: 'Adverary',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.2)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [0.27, 0.18, 0.62, .0.44]
          },
          {
            label: 'Exploit, Malware and Vulnerability',
            backgroundColor: 'rgba(255,99,3,0.2)',
            borderColor: 'rgba(255,99,3,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,3,0.2)',
            hoverBorderColor: 'rgba(255,99,3,1)',
            data: [0.26, 0.17, 0.39, 0.42]
          },
          {
            label: 'Defense Complexity',
            backgroundColor: 'rgba(255,221,3,0.3)',
            borderColor: 'rgba(255,221,3,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,221,3,0.3)',
            hoverBorderColor: 'rgba(255,221,3,1)',
            data: [0.38, 0.15, 0.39, 0.32]
          },
          {
            label: 'Control Consequences',
            backgroundColor: 'rgba(122,122,122,0.3)',
            borderColor: 'rgba(122,122,122,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(122,122,122,0.3)',
            hoverBorderColor: 'rgba(122,122,122,1)',
            data: [0, 0.17, 0.11, 0.35]
          },
          {
            label: 'Company Consequences',
            backgroundColor: 'rgba(12,99,3,0.3)',
            borderColor: 'rgba(12,99,3,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(12,99,3,0.3)',
            hoverBorderColor: 'rgba(12,99,3,1)',
            data: [0, 0.15, 0.12, 0.50]
          }
        ]
      };
