#!/bin/bash
echo "Start deploy server"
aws s3 sync s3://filehydrate.com/server /home/ec2-user/documerge/server --region us-east-2 --delete
cd /home/ec2-user/documerge/server
pm2 del index
yarn && pm2 start index.js --disable-logs
echo "Deploy end"