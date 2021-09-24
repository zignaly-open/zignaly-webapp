#!/bin/bash

APP_ENV="prod"

DEPLOYMENTPATH="{directory}"

sudo cp -r $DEPLOYMENTPATH/release $DEPLOYMENTPATH/releases/$DEPLOYMENT_ID
sudo ln -nfs --relative $DEPLOYMENTPATH/releases/$DEPLOYMENT_ID $DEPLOYMENTPATH/prepare