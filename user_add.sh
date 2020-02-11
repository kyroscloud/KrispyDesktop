#!/bin/bash

ADMINUSER=$1
ADMINNAME0=$2
ADMINNAME1=$3
ADMINPASS=$4

useradd -m -s /bin/bash $ADMINUSER
echo $ADMINUSER:$ADMINPASS | chpasswd
usermod -aG sudo $ADMINUSER