#!/bin/bash

echo 'var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;' > test.tmp.js
cat extension.js Constants.js HttpModule.js APIModule.js api.js >> test.tmp.js
node test.tmp.js
