# Cyber Issue Scoring for Exploit, Malware, and Vulnerability (EMV)

<!-- Last Updated 11/29/2018 -->

![](/Volumes/SITHLORD/emv/Screenshot from 2018-11-16 07-16-21.png)



There are a large number of potential exploits, malware, and vulnerabilities (EMV) that can be used to attack control systems on critical infrastructure.  Exploits and malware represent the offense aspects and vulnerabilities represent the maintenance aspects of the challenge. Successfully protecting a control system against these attacks requires a structured process for identifying, evaluating, prioritizing, and addressing
EMVs. EMV Scoring is needed since other scoring methodologies do not include: Exploits and Malware; applicability to a specific configuration; defense capabilities; consequence; or other adversary factors. A benefit of processing through the EMV Scoring process is the identification of potential threat object characteristics that can be used for automated response.

Idaho National Laboratory (INL) participated as a team member with Southern California Edison on the California Energy Systems for the 21st Century (CES-21) Program and has refined these concepts with the asset owner's point of view to prioritize EMV based on their operational knowledge of the system under protection, sometimes with a limited knowledge of the adversary, but a full understanding of the utilities' ability to defend against potential consequences including the consideration of the asset owner's risk tolerances. This EMV prioritization enables a scored ranking of issues to be addressed. CES-21 uses EMV to determine the creation of indicator and remediation language in automated response technologies, providing for agile response capabilities within substation automation environments.

## Installation

Select an operating system for installation instructions. Newer versions may be available but have not been tested.

[Linux .deb (Ubuntu 16.04.5)](#linux-.deb-(ubuntu-16.04.5-lts))

[Linux .rpm (Centos 7)](#linux-.rpm-(centos-7))

[Windows 7 64 bit](#windows-7-64-bit)

[Mac OS X (Mojave)](#mac-os-x-(mojave))

### Linux .deb (Ubuntu 16.04.5 LTS)

#### Update and Install Dependencies

Open a terminal and run the following commands to update the system and install dependencies:
```
sudo apt install update
sudo apt install upgrade
sudo apt install curl build-essential checkinstall libssl-dev git
```
#### Install nvm

Install nvm repository using the following:

`curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash`

Close and re-open the terminal. Run the following command to view available nvm versions:
`nvm ls-remote`

Install the latest LTS version by running the following (8.12.0 was the latest at the time of this writing):

`nvm install 8.12.0`

#### Install yarn

Install the yarn package manager. In a terminal window, issue the following commands:

```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -

echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee -a /etc/apt/sources.list.d/yarn.list

sudo apt update && sudo apt install yarn
```

#### Install Java

Add the oracle java 8 repository. In a terminal, issue the following commands:

```
sudo add-apt-repository ppa:webupd8team/java
sudo apt update
```

Install the java8-installer.

`sudo apt install oracle-java8-installer`

Check the java version to verify that Java 1.8 is installed:

`java -version`

Configure the java environment.

`update-alternatives --config java`

Create a java profile 'java.sh' in the /etc/profile.d/ directory.

`sudo nano /etc/profile.d/java.sh`

Enter the following for java.sh:
```sh
#Setting JAVA_HOME in PATH
JAVA_HOME="/usr/lib/jvm/java-8-oracle"
export JAVA_HOME
PATH=$PATH:$JAVA_HOME
export PATH
```

Press `ctrl-x` to exit, press `y` to save the changes.

Make the java.sh file executable.

```
sudo chmod +x /etc/profile.d/java.sh
source /etc/profile.d/java.sh
```

Check the java environment to verify the PATH setting.

`echo $JAVA_HOME`

You should see `/usr/lib/jvm/java-8-oracle`

#### Install OrientDB and Configure as a Service

The CIS Application has been tested using OrientDB v2.2.20. New versions may be available, but have not been tested. Download version 2.2.20 by issuing the following command in a terminal window.
```
wget -O orientdb-community-2.2.20.tar.gz http://orientdb.com/download.php?file=orientdb-community-2.2.20.tar.gz&os=linux
```

Navigate to the tar file and extract the files. This assumes the downloaded file is in the Downloads folder. In a terminal:

```
cd ~/Downloads
tar -zxvf orientdb-community-2.2.20.tar.gz
```

Move the extracted files to the /opt directory.
`sudo mv ~/orientdb-community-2.2.20 /opt/orientdb`

Start the OrientDB server.
```
cd /opt/orientdb
sudo bin/server.sh
```
You will be prompted to create a password for the root user. Use "OrientPW". ==need instructions for selecting different password==

Configure OrientDB to run as a Service. Open a new terminal window and issue the command:

`sudo useradd -r orientdb -s /sbin/nologin`

Change the ownership of OrientDB

`sudo chown -R orientdb:orientdb /opt/orientdb`

You will need to make a few changes to the orientdb.sh script

`sudo nano /opt/orientdb/bin/orientdb.sh`

Change the directory and user as follows:
```sh
ORIENTDB_DIR="/opt/orientdb"
ORIENTDB_USER="orientdb"
```
Save and close the file (`ctrl-x` then `y`).

Copy the Systemd service
`sudo cp /opt/orientdb/bin/orientdb.service /etc/systemd/system`

You will need to make settings changes as follows:
`sudo nano /etc/systemd/system/orientdb.service`

Modify the User, Group, and ExecStart commands
```sh
[Service]
User=orientdb
Group=orientdb
ExecStart=/opt/orientdb/bin/server.sh
```
Save and close the file (`ctrl-x` then `y`).

Reload the daemon
`sudo systemctl daemon-reload`

Start the Service

`sudo systemctl start orientdb`

Enable the service to start on boot
`sudo systemctl enable orientdb`

#### Extract EMV Application files

Download the EMV.tar.gz archive to your machine. ==Need to update with actual link to download file==

Navigate to the tar file and extract the files. This assumes the downloaded file is in the Downloads folder. In a terminal:

```
cd ~/Downloads
tar -zxvf EMV.tar.gz
```

Navigate to the EMV folder, run the following:
```shell
npm install
npm start
```
`npm install` is only needed the first time the CIS application is run to install dependencies, or if you update a dependency.

NOTE: Some linux distributions have a problem with `npm install`. In this case, use `yarn install` and `yarn start`.

Login to the EMV Application using the username: `admin` and password: `admin`

NOTE: The OrientDB service needs to be running for the CIS application to connect to the database.

#### (Optional): Build and Executable

Open a terminal and navigate to the EMV directory. Run the following: ==UPDATE==

`yarn make`

The package(s) for your platform will be found in "out/make". The binary can be found in "out/EMV-{platform}/EMV".

### Linux .rpm (Centos 7)

#### Install Dependencies

Open a terminal and run the following commands to update the system and install dependencies:
```
sudo yum install update
sudo yum install git libXScrnSaver
```
#### Install nvm

Install nvm repository using the following:

`curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`

Close and re-open the terminal. Check the nvm version to make sure the install worked.

`nvm --version`

Run the following command to view available nvm versions:

`nvm ls-remote`

Install the latest LTS version by running the following (8.12.0 was the latest at the time of this writing):

`nvm install 8.12.0`

#### Install yarn

Install the yarn package manager. In a terminal window, issue the following commands:

```
curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo

curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
sudo yum install yarn
```
Check the version of yarn to verify the installed
`yarn --version`

#### Set Java Environment Variables

Configure the java environment.
`update-alternatives --config java`

Create a java profile 'java.sh' in the /etc/profile.d/ directory.
`sudo vim /etc/profile.d/java.sh`

Enter the following to configure java:
```sh
#Setting JAVA_HOME in PATH
JAVA_HOME="/usr/lib/jvm/java-8-oracle"
export JAVA_HOME
PATH=$PATH:$JAVA_HOME
export PATH
```

Make the file executable.
```
sudo chmod +x /etc/profile.d/java.sh
source /etc/profile.d/java.sh
```

Check the java environment to verify the PATH setting.
`echo $JAVA_HOME`

#### Install OrientDB and Configure as a Service

The CIS Application has been tested using OrientDB v2.2.20. New versions may be available, but have not been tested. Download OrientDB by issuing the following command in a terminal:

`wget -O orientdb-community-2.2.20.tar.gz http://orientdb.com/download.php?file=orientdb-community-2.2.20.tar.gz&os=linux`

Untar the downloaded file:
`tar -zxvf orientdb-community-2.2.20.tar.gz`

Move the extracted files to the /opt directory.
`sudo mv ~/orientdb-community-2.2.20 /opt/orientdb`

Start the OrientDB server. NOTE: use the following for the username and password: root/OrientPW
```
cd /opt/orientdb
sudo bin/server.sh
```
You will be asked to create a password for the root user. Use "OrientPW". ==Need to include additional instructions to create unique password==

Configure OrientDB to run as a Service

Open a new terminal window

`sudo useradd -r orientdb -s /sbin/nologin`

Change the ownership of OrientDB

`sudo chown -R orientdb:orientdb /opt/orientdb`

Make a few changes to the orientdb.sh script

`sudo nano /opt/orientdb/bin/orientdb.sh`

Change the directory and user as follows:
```sh
ORIENTDB_DIR="/opt/orientdb"
ORIENTDB_USER="orientdb"
```
Save and close the file.

Copy the Systemd service

`sudo cp /opt/orientdb/bin/orientdb.service /etc/systemd/system`

Make settings changes as follows:

`sudo nano /etc/systemd/system/orientdb.service`

Modify the User, Group, and ExecStart commands
```sh
[Service]
User=orientdb
Group=orientdb
ExecStart=/opt/orientdb/bin/server.sh
```
Reload the daemon

`sudo systemctl daemon-reload`

Start the Service

`sudo systemctl start orientdb`

Enable the service to start on boot

`sudo systemctl enable orientdb`

#### Extract EMV Application files

Download the EMV.tar.gz archive to your machine. ==Need to update with actual link to download file==

Navigate to the tar file and extract the files. This assumes the downloaded file is in the Downloads folder. In a terminal:

```
cd ~/Downloads
tar -zxvf EMV.tar.gz
```

Navigate to the EMV folder, run the following:
```
npm install
npm start
```
`npm install` is only needed the first time the CIS application is run to install dependencies, or if you update a dependency.

NOTE: Some linux distributions have a problem with `npm install`. In this case, use `yarn install` and `yarn start`.

Login to the EMV Application using the username: `admin` and password: `admin`

NOTE: The OrientDB service needs to be running for the EMV application to connect to the database.

#### (Optional): Build and Executable

Open a terminal and navigate to the EMV directory. Run the following: ==UPDATE==

`yarn make`

The package(s) for your platform will be found in "out/make". The binary can be found in "out/EMV-{platform}/EMV".

### Windows 7 64-bit

#### Install Git

Download and run the git installer from here:
https://git-scm.com/download/win

#### Install node.js

Download the run node.js installer from here:
https://nodejs.org/en/download/

Update npm to avoid issues with dependencies. Open Command Prompt and run the following command:
```
npm i npm@latest -g
```

#### Install yarn

Download and run the yarn installer from here: https://yarnpkg.com/lang/en/docs/install/#windows-stable

#### Install Java

Download and run the Java8 JDK installer from here:
https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html

#### Install OrientDB

The EMV Application has been tested using OrientDB v2.2.20. New versions may be available, but have not been fully tested.

Download orientdb-community-2.2.20 from: https://bit.ly/2r1YBMi

Extract the .zip file to the C: drive. Navigate to `c:\orientdb-community-2.2.20\bin`

Run `orientdb.bat`

You will be asked to create a password for the root user. Use "OrientPW". ==Need to include additional instructions to create unique password==

#### Configure Orientdb as a service

Follow the instructions at https://orientdb.com/docs/2.2.x/Windows-Service.html to install OrientDB as a service.

#### Extract EMV Application files

Copy the EMV.tar.gz archive to your machine and unarchive to `c:\`.

NOTE: Run the unarchiving tool as administrator.

Open a command prompt as Administrator and navigate to the EMV folder, run the following:
```
yarn install
yarn start
```
NOTE: `yarn install` is only needed the first time the CIS application is run to install dependencies, or if you update a dependency.

Login to the EMV Application using the username: `admin` and password: `admin`

NOTE: The OrientDB service needs to be running for the EMV application to connect to the database.

#### (Optional): Build and Executable

Open a terminal and navigate to the EMV directory. Run the following: ==UPDATE==

`yarn make`

The package(s) for your platform will be found in "out/make". The binary can be found in "out/EMV-{platform}/EMV".

### Mac OS X (Mojave)

#### Install Homebrew

Install Homebrew from https://brew.sh

#### Install Dependencies

Open a terminal window and issue the following commands:

```
brew install wget
brew install node
brew install yarn --without-node
brew upgrade yarn
```

Verify that git is installed by running the following command:
```
git --version
```

NOTE: If git is not installed, you will be prompted to install it.

#### Install Java 8 JDK

Download and run the the `Mac OS X x64` installer from https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html

#### Install OrientDB

Follow the instructions at https://orientdb.com/docs/2.2.x/Unix-Service.html to install OrientDB using homebrew and to change a root password. User `OrientPW` for the new root password. ==need instructions on how to select unique password==

#### Extract EMV Application files

Download the EMV.tar.gz archive to your machine. ==Need to update with actual link to download file==

Navigate to the tar file and extract the files. This assumes the downloaded file is in the Downloads folder. In a terminal:

```
cd ~/Downloads
tar -zxvf EMV.tar.gz
```

Navigate to the EMV folder, run the following:
```
yarn install
yarn start
```

`yarn install` is only needed the first time the CIS application is run to install dependencies, or if you update a dependency.

NOTE: Some distributions have a problem with `yarn install`. In this case, use `npm install` and `npm start`.

Login to the EMV Application using the username: `admin` and password: `admin`

NOTE: The OrientDB service needs to be running for the EMV application to connect to the database.

#### (Optional): Build and Executable

Open a terminal and navigate to the EMV directory. Run the following: ==UPDATE==

`yarn make`

The package(s) for your platform will be found in "out/make". The binary can be found in "out/EMV-{platform}/EMV".

## Advanced Customization

For instructions on editing the criteria set or configurations see Advanced_Customization.md.

## Encrypting Communication

Please follow the instructions provided: https://www.orientdb.com/docs/3.0.x/security/Using-SSL-with-OrientDB.html
You will also have to change any connections to the server from port 2424 to 2434.

NOTE: Some machine's might experience issues with a self signed certificate, to which you can add a line: process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';.  This fix is fairly unsecure (as it opens up the application to untrusted sources), should be temporary and extended to something more secure.

## Known Issues

- NPM might have outdated packages. This application was built with static versions from npm. If a package is updated, it has the potential to cause issues.
- This application was designed around a single-user system.
- It is assumed that the OrientDB database and EMV application will reside on the same machine. Security concerns exist if the database is moved to another machine as the communication between electron-forge and orientdb is unencrypted.1

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Licensing

See COPYRIGHT.md and LICENSE.md for copyright and licensing information.
