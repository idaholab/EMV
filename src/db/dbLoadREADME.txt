To load the dabatase schema locally run the following command from this directory:

Note: must make changes to db-import.txt on OrientDB Username/Password and the directory where the schema.gz file is stored

ie: `sudo /opt/orientdb/bin/console.sh ./db_import.txt`


TODO: Scripts

If you want to export a current Database run the following commands.  Note: the directory orientdb is stored and the admin password for your orientdb might be different.
`sudo /opt/orientdb/bin/console.sh`
`CONNECT remote:localhost/emv <username> <password>`
`EXPORT DATABSE <name_of_export>`
