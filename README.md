# creating a custom Ubuntu Server 20.04 LTS iso

these are the steps that i've followed to get a custom Ubuntu Server 20.04 LTS

- download the Ubuntu Server 20.04 LTS iso
- install Cubic (Custom Ubuntu ISO Creator)
- create a cubic project & yada yada yada...
- choose the iso
- we will get a chroot terminall (basically a terminal to do stuff in our iso & then generating a custom one)
- create a new user:
  ```
  # adduser <newuser>
  # usermod -aG sudo <newuser>  // add user to sudo group
  ```
- switch to new user with `su <newuser>`
- install nvm:
  _note: this gave me an error_ **Failed to connect to raw.githubusercontent.com port 443: Connection refused**
  which i fixed it by adding `185.199.108.133 raw.githubusercontent.com` to `/etc/hosts` file ([source](https://www.debugpoint.com/failed-connect-raw-githubusercontent-com-port-443/#:~:text=Fix%201%3A%20Updating%20the%20%2Fetc%2Fhosts%20file%20in%20Linux,-If%20you%20are&text=Open%20the%20%2Fetc%2Fhosts%20file.&text=Then%20at%20the%20end%20of%20this%20file%2C%20add%20the%20IP%20address.&text=Save%20and%20close%20the%20file,again%2C%20and%20it%20should%20work.))
- after it i just installed node (v16.16.0 in my case) with nvm
- then globally installed `pm2` & `yarn` (i like it)
- cloned a simple node app
- installed dependenceies
- start node server with `pm2`
  ```
  pm2 start index.js -i 0
  ```
- followed [pm2's docs](https://pm2.keymetrics.io/docs/usage/startup/):
  ```
  pm2 startup
  <run the command echoed by pervious one>
  pm2 save
  ```
- customizations done! now generate the iso

- preseed config (r&d in progress)
```
# Preseed user account
d-i auto-install/enable boolean true
d-i passwd/user-fullname string Full Name
d-i passwd/username string username
d-i passwd/user-password password username
d-i passwd/user-password-again password username
d-i user-setup/allow-password-weak boolean true
d-i user-setup/encrypt-home boolean false
d-i user-setup/override-home boolean true
d-i user-setup/encrypt-home boolean false
d-i clock-setup/utc boolean true
d-i time/zone string Asia/Kolkata
```

for listing values for time/zone, use `cat /usr/share/zoneinfo/zone.tab`