var AWS = require('aws-sdk');
AWS.config.region = 'us-east-2';
var lambda = new AWS.Lambda();

let chunkArr = (inputArray, perChunk) => {
  return inputArray.reduce((resultArray, item, index) => { 
    const chunkIndex = Math.floor(index/perChunk)
    if(!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }
    resultArray[chunkIndex].push(item)
    return resultArray
  }, [])
}

exports.handler = async (event, context, callback) => {
  let allIds = []
  const userId = event.requestContext.authorizer['principalId'];

  // parse token and url
  const listOfMerges = JSON.parse(event.body);

  //lets go 3 per, should be quick enough
  let mergesInChunks = chunkArr(listOfMerges,3);
  let totalCount = mergesInChunks.length - 1
  let runningCount = 0

  //short circuit
  // context.succeed(codesInChunks);
  await Promise.all(mergesInChunks.map(async (merges) => {
    let payload = {}
    if(event && event.queryStringParameters && event.queryStringParameters.docId){
      payload.docId = event.queryStringParameters.docId
    }
    if(event && event.queryStringParameters && event.queryStringParameters.access_token){
      payload.access_token = event.queryStringParameters.access_token
    }
    payload.merges = merges
    var params = {
      FunctionName: 'postMergeFields', // the lambda function we are going to invoke
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify(payload)
    };
    console.log(params)
    let lambdaResult = await lambda.invoke(params).promise()
    if (lambdaResult.$response.err) {
      console.log('CHUNK FAILED - ' + merges.toString());
    } else {
      //this line is sweet
      let idList = JSON.parse(JSON.parse(lambdaResult.$response.data.Payload).body);
      allIds = allIds.concat(idList)
      runningCount++
      console.log(allIds)
      return idList
    }
    //dont think this catches anything
    if(runningCount === totalCount) {
      console.log('finished last subaction')
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(allIds),
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    });
    }
  }));

  callback(null, {
    statusCode: 200,
    body: JSON.stringify(allIds),
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
});
};