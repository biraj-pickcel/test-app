sno=$(/usr/sbin/dmidecode -t 2 | /usr/bin/grep -oP "Serial Number: \K[a-zA-Z0-9]+")
echo "$sno" >> /machine-id
chmod 600 /machine-id
systemctl disable machine-id.service 