/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import * as OrientDB from 'orientjs';
import * as schema from './schema.json';
import * as CryptoJS from 'crypto-js';

export async function connectToServer(options) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; //TODO: Fix this
    const server = await OrientDB({
       host:       options.host,
       password:   options.password
       port:       options.port
       username:   options.username

    });
    return server;
}

export async function connectToDatabase(options, server) {

    let databaseExists = false;
    /*Setting the database to use*/
    /*Set up a new username/pw for db*/
    const dbs = await server.list();
    for (let i = 0; i < dbs.length; i++) {
        if (dbs[i].name === options.name) {
            databaseExists = true;
        }
    }

    if (databaseExists) {
        const db = await server.use({
          name:       options.name,
          password:   options.password,
          username:   options.username,
        });
        return db;
    } else {
        const newDB = await new_database(options.name, server);
        return newDB;
    }
}

async function new_database(dbName, server) {
    let newClass = null;
    let newProperty = null;
    //create database
    const newDB = await server.create({
        name: dbName,
        type: 'graph',
        storage: 'plocal'
    });

    // console.log('Created Database: ', newDB.name);
    //create schema
    schema.schema.forEach(async function(itemI, indexI) {
        newClass = await newDB.class.create(itemI.name, itemI.superclass);
        // console.log('Created class: ' + newClass.name);
        newProperty = await newClass.property.create(itemI.properties);
        // console.log('Created Property: ' + newProperty.name);
        return newProperty;
    });

    const defUser = await createDefaultUser(newDB);
    const defConfigurations = await createConfigurations(newDB);

    return newDB;
}

async function createDefaultUser(db) {
    const defUser = await db.create('VERTEX', 'User')
    .set({
        name: 'admin',
        password: CryptoJS.SHA512('admin').toString(),
        role: 'admin'
    }).one();

    // console.log('Created default user: ' + defUser.name);
}

//This can be deleted when admin has ability to create configurations from admin portal
async function createConfigurations(db) {
    const defConf = await db.create('VERTEX', 'Configuration')
    .set({
        name: 'VMAR',
        description: 'Some cool tech...'
    }).one();
    // console.log('Created default hardware configuration: ' + defConf.name);

    const defConf2 = await db.create('VERTEX', 'Configuration')
    .set({
        name: 'Deathstar',
        description: "That's no moon."
    }).one();
    // console.log('Created default hardware configuration: ' + defConf2.name);
}
