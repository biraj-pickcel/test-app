#!/bin/bash

echo $(node -v)
pm2 kill
yarn start