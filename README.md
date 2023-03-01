# creating a custom Ubuntu Server 20.04 LTS iso

these are the steps that i've followed to get a custom Ubuntu Server 20.04 LTS

- download the Ubuntu Server **20.04** iso
- install [Cubic](https://github.com/PJ-Singh-001/Cubic) (Custom Ubuntu ISO Creator)
- create a cubic project, choose iso then set name, version & stuff
- we will get a chroot terminal (basically a terminal to do stuff in our iso & then generating a custom one)
- install `ifconfig` (in that chroot terminal)
  ```
  # apt install net-tools
  ```
- install `network-manager` to setup wifi (maybe ethernet too ig, i just dk about that atm)
  ```
  # apt install network-manager
  ```
- create a new user:
  ```
  # adduser <newuser>
  # usermod -aG sudo <newuser>  // add user to sudo group (don't forget remove it later)
  ```
- switch to new user with
  ```
  # su <newuser>`
  ```
- install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

  _note: this gave me an error_ **Failed to connect to raw.githubusercontent.com port 443: Connection refused** which i fixed it by adding `185.199.108.133 raw.githubusercontent.com` to `/etc/hosts` file ([source](https://www.debugpoint.com/failed-connect-raw-githubusercontent-com-port-443/#:~:text=Fix%201%3A%20Updating%20the%20%2Fetc%2Fhosts%20file%20in%20Linux,-If%20you%20are&text=Open%20the%20%2Fetc%2Fhosts%20file.&text=Then%20at%20the%20end%20of%20this%20file%2C%20add%20the%20IP%20address.&text=Save%20and%20close%20the%20file,again%2C%20and%20it%20should%20work.))

- install mongodb following [their docs](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)

  _note: during one step, this gave me an error **sudo: unable to resolve host cubic: Temporary failure in name resolution**_ which i fixed by adding `127.0.1.1 cubic` to `/etc/hosts` file ([source](https://askubuntu.com/questions/59458/error-message-sudo-unable-to-resolve-host-none))

  ps: this error doesn't occur everytime though

- to prevent unintended updates (from docs)
  ```
  $ echo "mongodb-org hold" | sudo dpkg --set-selections
  $ echo "mongodb-org-database hold" | sudo dpkg --set-selections
  $ echo "mongodb-org-server hold" | sudo dpkg --set-selections
  $ echo "mongodb-mongosh hold" | sudo dpkg --set-selections
  $ echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
  $ echo "mongodb-org-tools hold" | sudo dpkg --set-selections
  ```
- enable mongodb so that it starts on boot
  ```
  $ sudo systemctl enable mongod.service
  ```
- install node (v16.16.0 in my case) with nvm (don't forget to restart session before using nvm)
  ```
  $ nvm install 16.16.0
  $ node -v
  ```
- then globally install `pm2` & `yarn` (i like yarn)
  ```
  $ npm i --location=global pm2 yarn
  ```
- clone this repo, `cd` in it & install dependenceies with `yarn`
- start node server (see example first)

  ```
  $ whereis node (to get the path of node's bin directory)
  $ sudo su -c "env PATH=$PATH:<node-bin-full-path> pm2 start index.js --name=test-app
  ```

  Example:

  ```
  $ sudo su -c "env PATH=$PATH:/home/biraj21/.nvm/versions/node/v16.16.0/bin pm2 start index.js --name=test-app"
  ```

- for autostart ([pm2's docs](https://pm2.keymetrics.io/docs/usage/startup/)):

  ```
  $ sudo su -c "env PATH=$PATH:<node-bin-full-path> pm2 startup"
  $ sudo su -c "env PATH=$PATH:<node-bin-full-path> pm2 save"
  ```

  Example:

  ```
  $ sudo su -c "env PATH=$PATH:/home/biraj21/.nvm/versions/node/v16.16.0/bin pm2 startup"
  $ sudo su -c "env PATH=$PATH:/home/biraj21/.nvm/versions/node/v16.16.0/bin pm2 save"
  ```

- install nginx for reverse proxying & serving static files
  ```
  $ sudo apt install nginx
  ```
- save `/etc/nginx/nginx.conf` with the following config (better save the old config file as backup)

  ```
  events {

  }

  http {
    server {
      server_name test-app;

      location ~ ^/(static/*) {
        rewrite /static(.*) /$1 break;
        root /home/client/test-app/static;
      }

      location ~ ^/(api/*) {
        proxy_pass http://localhost:3000;
      }

      location / {
        return 200 "hello from nginx!\n";
      }
    }
  }
  ```

- remove sudo previliges from the user if given
  ```
  $ sudo deluser USERNAME sudo
  ```
- customizations done! now generate the iso & close Cubic
- now install `cloud-init` (again in your pc, not in chroot)
  ```
  $ sudo apt install cloud-init
  ```
- then create a config file _user-data_ with the following (for default account creation):
  ```
  #cloud-config
  autoinstall:
  version: 1
  identity:
  hostname: hostname
  password: "a crypted password generated with mkpasswd"
  username: username
  ```
- then generate a new iso with this config using [ubuntu-autoinstall-generator](https://github.com/covertsh/ubuntu-autoinstall-generator)

  ```
  $ ./ubuntu-autoinstall-generator.sh -a -e -u <user-data-file> -k -s <iso>
  ```

  _note: i expected it to ask for other things like keyboard, langauge & stuff but it just used default. so need to learn more about clout-init & its config so that it asks the user of stuff which i didn't configure in the iso._
