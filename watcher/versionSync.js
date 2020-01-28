const exec  = require('child_process').exec;

// start listening immediately for sqs to update
const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'eu-west-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const consumer = Consumer.create({
  queueUrl: 'https://sqs.us-east-2.amazonaws.com/029059148623/documergenewcode',
  handleMessage: async (message) => {
    // do some work with `message`
    try{

            console.log('new version!')
            exec('sh ./fileSync.sh',
            (error, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
            });

    }catch(err) {
        console.log('sqs parse error: ' + err)
    }
  }
});

consumer.on('error', (err) => {
  console.error(err.message);
});

consumer.on('processing_error', (err) => {
  console.error(err.message);
});

consumer.start();