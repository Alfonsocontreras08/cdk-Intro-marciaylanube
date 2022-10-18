const TABLE_NAME = process.env.GEETINGS_TABLE;
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.getHello = async (event)=>{
    const Item = await getItem();

    return {
        statusCode:200,
        body: JSON.stringify(Item),
    }
}

const getItem = async ()=>{
    let params = {
        TableName : TABLE_NAME
    };
    return dynamo.scan(params).promise().then((i)=>{
        return i;
    });
};


