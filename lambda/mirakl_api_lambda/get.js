const AWS = require('aws-sdk');
const request = require("request");

AWS.config.update({region: 'us-east-1'});



const ddb = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {
    const userId = event.requestContext.authorizer['principalId'];
    var foundOrders = []
    getMiraklDetails(userId).then(res => {
        if(!res.Item){
            //we broke
            errorResponse('Failed to query Mirakl', context.awsRequestId, callback)
        } else {

            const miraklToken = res.Item.mirakl_token;
            const miraklHostUrl = res.Item.mirakl_host;

            const paginate = (orderList, offset) => {
                

                var options = { 
                    method: 'get',
                    url: miraklHostUrl + '/api/orders?max=100' + '&offset=' + offset ,//+ !!offset ? '&offset=' + offset : '',
                    headers: 
                    { 
                        'cache-control': 'no-cache',
                        accept: 'application/json',
                        authorization: miraklToken 
                    } 
                };

                request(options, function (error, response, body) {
                    orderList = orderList.concat(JSON.parse(body).orders );
                    if (error) {
                        errorResponse('Failed to query Mirakl', context.awsRequestId, callback)
                    }
                    console.log('if' + JSON.parse(body).orders + 'is bigger than ' + JSON.stringify(orderList))
                    if(JSON.parse(body).total_count > orderList.length){
                        //not done yet
                        let links = parseLinks(response.headers.link)
                        var offset = links['next'].match(/\d+/g)[1]; //second number is the offset
                        console.log('offset' + offset)
                        paginate(orderList, offset)
                        
                    } else {
                        //we found the end, send the built array, we just need to let the frontend know its there with a 200
                        callback(null, {
                            statusCode: 200,
                            body: JSON.stringify({
                                orders: orderList
                            }),
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                            },
                        });
                    }
                    
                });
            }

            //kick off pagination
            paginate([], '0')
            
        }
        

        
    }).catch((err) => {
        console.error(err);
        errorResponse(err.message, context.awsRequestId, callback)
    });
};

function getMiraklDetails(uid) {
    return ddb.get({
        TableName: 'UserDetails',
        Key:{
            "UserId": uid
        },
    }).promise();
}

function toUrlString(buffer) {
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function parseLinks(data) {
    let arrData = data.split("link:")
    data = arrData.length == 2? arrData[1]: data;
    let parsed_data = {}

    arrData = data.split(",")

    for (var d of arrData){
        let linkInfo = /<([^>]+)>;\s+rel="([^"]+)"/ig.exec(d)

        parsed_data[linkInfo[2]]=linkInfo[1]
    }

    return parsed_data;
}

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}