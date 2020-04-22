const crypto = require('crypto');

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    
    console.log('Received event: ', event);

    // The body field of the event in a proxy integration is a raw string.
    // In order to extract meaningful values, we need to first parse this string
    // into an object. A more robust implementation might inspect the Content-Type
    // header first and use a different parsing strategy based on that value.
    const requestBody = JSON.parse(event.body);

    recordSignIn(requestBody.zip, requestBody.first_time, requestBody.reason, requestBody.people, requestBody.why_surrender, requestBody.hear).then(() => {
        // Because this Lambda function is called by an API Gateway proxy integration
        // the result object must use the following structure.
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(requestBody),
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
        });
    }).catch((err) => {
        console.error(err);

        // If there is an error during processing, catch it and return
        // from the Lambda function successfully. Specify a 500 HTTP status
        // code and provide an error message in the body. This will provide a
        // more meaningful error response to the end client.
        callback(null, {
            statusCode: 500,
            body: JSON.stringify({
              Error: err.message,
              Reference: context.awsRequestId,
            }),
            headers: {
              'Access-Control-Allow-Origin': '*'
            },
        });
    });
};

function recordSignIn(zip, first_time, reason, people, why_surrender, hear) {
    return ddb.put({
        TableName: 'AnimalVillageSignIns',
        Item: {
            id: crypto.createHash('md5').update(Math.random().toString()).digest("hex").toString(),
            zip: zip,
            first_time: first_time,
            reason: reason,
            people: people,
            why_surrender: why_surrender,
            hear: hear,
            created_date: new Date().toISOString()
        },
    }).promise();
}