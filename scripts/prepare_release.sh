#!/bin/bash

APP_ENV="prod"

DEPLOYMENTPATH="{directory}"
sudo rm -rf $DEPLOYMENTPATH/release
sudo rm -rf $DEPLOYMENTPATH/prepare

sudo mkdir -p $DEPLOYMENTPATH/releases
sudo mkdir -p $DEPLOYMENTPATH/release
