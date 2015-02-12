#!/bin/bash

set +e # break script on first error

# make sure script is run from correct place
if [ ! -d .git ]; then
    echo "ERROR: You should run this script from ROOT of fhir.js GIT repo"
    echo "Example: cd fhir.js && ./release.sh"
    exit 1
fi

# Clone bower-fhir if run on Travis
if [ "$TRAVIS" = true ]; then
    touch ~/.ssh/travis_deploy_bower_fhir
    openssl aes-256-cbc -K $encrypted_da45cdf7c925_key -iv $encrypted_da45cdf7c925_iv -in script/travis_deploy_bower_fhir.enc -out ~/.ssh/travis_deploy_bower_fhir -d
    chmod 600 ~/.ssh/travis_deploy_bower_fhir
    echo -e "Host github.com\n  IdentityFile ~/.ssh/travis_deploy_bower_fhir" > ~/.ssh/config

    cd .. && git clone --depth=50 --branch=master git@github.com:FHIR/bower-fhir.git && cd fhir.js
fi

# make sure bower-fhir repo exist
if [ ! -d ../bower-fhir/.git ]; then
    CWD=`pwd`
    echo "ERROR: You should have bower-formstamp repo as a sibling directory of formstamp main repo. Run following command:"
    echo "cd `dirname $CWD` && git clone git@github.com:FHIR/bower-fhir.git"
    exit 1
fi

source ~/.nvm/nvm.sh # make sure nvm command is available
nvm use 0.10

# install dependencies
`npm bin`/bower install

# force compilation of all assets
`npm bin`/webpack

cd ../bower-fhir
git checkout .
git pull -f origin master

cd ../fhir.js
cp dist/fhir.js       ../bower-fhir/
cp dist/jqFhir.js     ../bower-fhir/
cp dist/ngFhir.js     ../bower-fhir/
cp dist/yuifhir.js    ../bower-fhir/
cp bower.json         ../bower-fhir/
cp README.md          ../bower-fhir/

cd ../bower-fhir
if [ -n "$TRAVIS_TAG" ]; then
    sed -i.bak "s/AUTO_VERSION/$TRAVIS_TAG/g" bower.json && rm bower.json.bak
else
    read -p "Enter new bower-fhir version: " LOCAL_VERSION
    sed -i.bak "s/AUTO_VERSION/$LOCAL_VERSION/g" bower.json && rm bower.json.bak
fi

git add .
git commit -a -m "release at `date` by `git config --get user.name`"
git push origin master

if [ -n "$TRAVIS_TAG" ]; then
    git tag -a -m "$TRAVIS_TAG" $TRAVIS_TAG
else
    git tag -a -m "$LOCAL_VERSION" $LOCAL_VERSION
fi
git push --tags

echo "-----------------------"
if [ -n "$TRAVIS_TAG" ]; then
    echo "Released version $TRAVIS_TAG successfully!"
else
    echo "Released version $LOCAL_VERSION successfully!"
fi
