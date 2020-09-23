/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

const {app, Menu, BrowserWindow, MenuItem} = require('electron');

function cis_import_selected(item: MenuItem, focusedWindow: BrowserWindow) {
    if (focusedWindow) { focusedWindow.webContents.send('cis_import_selected', item.label); }
}

function cis_export_selected(item: MenuItem, focusedWindow: BrowserWindow) {
    if (focusedWindow) { focusedWindow.webContents.send('cis_export_selected', item.label); }
}

function stix_import_selected(item: MenuItem, focusedWindow: BrowserWindow) {
    if (focusedWindow) { focusedWindow.webContents.send('stix_import_selected', item.label); }
}

function stix_export_selected(item: MenuItem, focusedWindow: BrowserWindow) {
    if (focusedWindow) { focusedWindow.webContents.send('stix_export_selected', item.label); }
}

const template = [

    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                role: 'quit',
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'pasteandmatchstyle'},
            {role: 'delete'},
            {role: 'selectall'}
        ]
    },
    {
        label: 'View',
        submenu: [
            {role: 'reload'},
            {role: 'forcereload'},
            {role: 'toggledevtools'},
            {type: 'separator'},
            {role: 'resetzoom'},
            {role: 'zoomin'},
            {role: 'zoomout'},
            {type: 'separator'},
            {role: 'togglefullscreen'}
        ]
    },
    {
        label: 'CIS',
        submenu: [
            {
                label: 'Import',
                click: cis_import_selected
            },
            {
                label: 'Export',
                click: cis_export_selected
            }
        ]
    },
    {
        label: 'STIX',
        submenu: [
            {
                label: 'Import',
                click: stix_import_selected
            },
            {
                label: 'Export from CIS',
                click: stix_export_selected
            }
        ]
    },
    {
        role: 'window',
        submenu: [
            {role: 'minimize'},
            {role: 'close'}
        ]
    },
    {
        role: 'help',
        submenu: [
            {
            label: 'Learn More',
            click() { require('electron').shell.openExternal('https://electronjs.org'); }
            }
        ]
    }
];

/*
  Manages the menu options at the top of the appliaction
*/
export function setup() {

    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                {role: 'about'},
                {type: 'separator'},
                {role: 'services', submenu: []},
                {type: 'separator'},
                {role: 'hide'},
                {role: 'hideothers'},
                {role: 'unhide'},
                {type: 'separator'},
                {role: 'quit'}
            ]
        });

        // Edit menu
        template[1].submenu.push(
            {type: 'separator'},
            {
                label: 'Speech',
                submenu: [
                    {role: 'startspeaking'},
                    {role: 'stopspeaking'}
                ]
            }
        );

        // Window menu
        template[3].submenu = [
            {role: 'close'},
            {role: 'minimize'},
            {role: 'zoom'},
            {type: 'separator'},
            {role: 'front'}
        ];
    }

    app.on('ready', () => {
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    });
}
