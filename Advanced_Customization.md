## Advanced Customization

<!-- Last Updated 11/29/2018 -->

This document provides advanced customization instructions for the Cyber Issue Scoring for Exploit, Malware, and Vulnerabilities Application.

## Editing the Criteria Sets

The CIS database is created based on the settings in the emvPresets.json file located at `EMV/src/db`. This file follows the format:

```
category
├── characteristic
│   ├── attribute
│   │   ├── score description
│   │   └── score description
│   └── attribute
│       ├── score description
│       └── score description
├── characteristic
│   ├── attribute
│   │   ├── score description
│   │   └── score description
│   └── attribute
│       ├── score description
│       └── score description
...
...
...
```

NOTE: It is recommended to make a backup before modifying emvPresets.json

`cp emvPresets.json emvPresetsBackup.json`

### Edit current JSON file in any editor of your choosing
`vim emvPresets.json`

### General Rules

The emvPresets.json file is what populates the database on CIS creation
The current schema must be followed in order for functionality to work
ie: Category -> Charactersitics -> Attributes -> Scores

EMV will accept as many Categories/Characteristics/Attributes and Scores as desired as long as they follow the schema.

caveat: Each Category is made up of multiple Characteristics, their weights must equal 1 (or 100%)
ex: If we create a Category with 3 Characteristics:  Char1: 0.3, Char2: 0.3, Char3: 0.4 == 1
Currently, this is not enforced.

## Adding/Removing a Configuration

### Adding a Configuration through OrientDB Console

Navigate to localhost:2480
Login to EMV database using the root OrientDB username/password setup during installation
Select the navigation tab 'Schema' and under 'Vertex Classes' list select 'Configuration'

Select 'New Record' near the top right of the view
Fill out a name and description and select 'Save'

### Removing a Configuration through OrientDB Console

Navigate to localhost:2480
Login to EMV database using the root OrientDB username/password setup during installation
Select the navigation tab 'Schema' and under 'Vertex Classes' list select 'Configuration'

Select 'Query All'
From the returned list, select the @rid of the target configuration
Select Action -> Delete -> OK