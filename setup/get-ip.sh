#!/bin/bash
ifconfig wlo1 >/dev/null 2>&1
found_wl01=$?
if (("$found_wl01" != 0)); then
    >&2 echo "wl01 not found"
    exit 1
fi

ip=$(ifconfig wlo1 | grep -oP "inet \K([0-9.]+)")
if [[ "$ip" == "" ]]; then
    >&2 echo "not connected to a network"
    exit 1
fi

echo "$ip"