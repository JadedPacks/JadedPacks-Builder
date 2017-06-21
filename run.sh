#!/bin/bash

echo "Running NPM tests"
if [ -f package.json ]; then
	npm install
	npm test
else
	echo "No NPM file found."
fi