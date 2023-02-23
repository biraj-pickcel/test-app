#!/bin/bash
interface="wlo1"
ifconfig "$interface" >/dev/null 2>&1
if (("$?" != 0)); then
    >&2 echo "$interface not found! trying wlp3s0..."
    interface="wlp3s0"
    ifconfig "$interface" >/dev/null 2>&1
    if (("$?" != 0)); then
        >&2 echo "wlp3s0 also not found..."
        exit 1
    fi
fi

ip=$(ifconfig "$interface" | grep -oP "inet \K([0-9.]+)")
if [[ "$ip" == "" ]]; then
    >&2 echo "not connected to a network (interface $interface)"
    exit 1
fi

echo "$ip"