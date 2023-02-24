# creating a custom Ubuntu Server 20.04 LTS iso

these are the steps that i've followed to get a custom Ubuntu Server 20.04 LTS

- download the Ubuntu Server **20.04** iso
- install Cubic (Custom Ubuntu ISO Creator)
- create a cubic project, choose iso, set names & stuff
- we will get a chroot terminal (basically a terminal to do stuff in our iso & then generating a custom one)
- install `ifconfig`
  ```
  apt install net-tools
  ```
- create a new user:
  ```
  # adduser <newuser>
  # usermod -aG sudo <newuser>  // add user to sudo group if you want to (i didn't btw)
  ```
- switch to new user with `su <newuser>`
- install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

  _note: this gave me an error_ **Failed to connect to raw.githubusercontent.com port 443: Connection refused**
  which i fixed it by adding `185.199.108.133 raw.githubusercontent.com` to `/etc/hosts` file ([source](https://www.debugpoint.com/failed-connect-raw-githubusercontent-com-port-443/#:~:text=Fix%201%3A%20Updating%20the%20%2Fetc%2Fhosts%20file%20in%20Linux,-If%20you%20are&text=Open%20the%20%2Fetc%2Fhosts%20file.&text=Then%20at%20the%20end%20of%20this%20file%2C%20add%20the%20IP%20address.&text=Save%20and%20close%20the%20file,again%2C%20and%20it%20should%20work.))

- install node (v16.16.0 in my case) with nvm (don't forget to restart session before using nvm)
- then globally install `pm2` & `yarn` (i like yarn)
  ```
  $ npm i --location=global pm2 yarn
  ```
- clone this repo, `cd` in it & install dependenceies with `yarn`
- start node server (using `pm2`)
  ```
  $ yarn start
  ```
- for autostart i followed [pm2's docs](https://pm2.keymetrics.io/docs/usage/startup/) & did the following:
  ```
  $ pm2 startup
  # <run the command echoed by `pm2 startup` by switching as root>
  $ pm2 save
  ```
- customizations done! now generate the iso & close chroot
- now install `cloud-init` (in your pc, not in chroot)
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
  ./ubuntu-autoinstall-generator.sh -a -e -u <user-data-file> -k -s <iso>
  ```

  _note: i expected it to ask for other things like keyboard, langauge & stuff but it just used default. so need to learn more about clout-init & its config so that it asks the user of stuff which i didn't configure in the iso._
