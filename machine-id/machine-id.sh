sno=$(/usr/sbin/dmidecode -t 2 | /usr/bin/grep -oP "Serial Number: \K[a-zA-Z0-9]+")
mkdir -p /pickcel
echo "$sno" >> /pickcel/machine-id
chmod 600 /pickcel/machine-id
systemctl disable machine-id.service