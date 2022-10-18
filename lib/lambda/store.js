const TABLE_NAME = process.env.GEETINGS_TABLE;
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.saveHello = async (event)=>{
    const {name,years} = JSON.parse(event.body);

    const saveItem = await SaveItem(name,years);

    return {
        statusCode:200,
        body: JSON.stringify(saveItem),
    }
}

const SaveItem = async (name,years)=>{
    let params = {
        TableName : TABLE_NAME,
        Item: {
            id:`${name}-${Math.floor(Math.random()*10000)}`, //se uso asi para mostrar unicamente.
            name,
            years
        }
    };
    return dynamo.put(params).promise().then(()=>{
        return params;
    })
};
