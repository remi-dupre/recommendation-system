#!/bin/bash

echo 'var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;' > test.tmp.js
cat extension.js Constants.js HttpModule.js APIModule.js api.js >> test.tmp.js
node test.tmp.js

read -n1 -r -p "Press space to continue..." key

if [ "$key" = '' ]; then
    # Space pressed, do something
    # echo [$key] is empty when SPACE is pressed # uncomment to trace
else
    # Anything else pressed, do whatever else.
    # echo [$key] not empty
fi
