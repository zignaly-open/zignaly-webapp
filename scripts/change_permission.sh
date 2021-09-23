#!/bin/bash

APP_ENV="prod"

DEPLOYMENTPATH="{directory}"

# change permission
sudo chown -R www-data:www-data $DEPLOYMENTPATH/prepare
cd $DEPLOYMENTPATH/prepare && sudo chown -R www-data:www-data .

