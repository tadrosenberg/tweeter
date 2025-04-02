#!/bin/bash

# Build the project
npm run build

#  Remove the existing dist.zip if it exists
if [ -f "dist.zip" ]; then
    rm dist.zip
fi

# Zip the contents of the dist folder (not the folder itself)
cd dist
zip -r ../dist.zip .
cd ..

# Move the dist.zip file to the tweeter-server folder
mv dist.zip tweeter-server/

# Run the uploadLambdas script
./uploadLambdas.sh

# Run the updateLayers script
./updateLayers.sh