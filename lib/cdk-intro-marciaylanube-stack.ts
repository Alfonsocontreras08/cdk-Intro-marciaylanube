import * as cdk from 'aws-cdk-lib';
import { Construct } from  'constructs';
import *  as  lambda from "aws-cdk-lib/aws-lambda";
import * as dynamoDB from "aws-cdk-lib/aws-dynamodb";
import * as apiGW from "aws-cdk-lib/aws-apigateway";
import { StackPropsCustom } from '../interfaces';
import { getDefaultProps,getDefaultResourseName } from '../utils';
import * as path from "path";

export class CdkIntroMarciaylanubeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StackPropsCustom) {
    super(scope, id,getDefaultProps(props));

    //dynamoDB
    const gettingsTable = new dynamoDB.Table(this,getDefaultResourseName(props,"hello"),{
      partitionKey:{ name:"id", type:dynamoDB.AttributeType.STRING },
    });
    
    
    //lambda function
    const saveHelloFunction = new lambda.Function(this,getDefaultResourseName(props,"SaveHelloFunction"),{
      runtime:lambda.Runtime.NODEJS_16_X, //corre en node16
      handler:"store.saveHello", 
      code:lambda.Code.fromAsset(path.resolve(__dirname,"lambda")), //donde esta alojado el codigo eje: s3,o el mismo prohyecto en la carpeta code
      environment:{
        GEETINGS_TABLE: gettingsTable.tableName
      }
    });

    const getHelloFunction = new lambda.Function(this,getDefaultResourseName(props,"GetHelloFunction"),{
      runtime:lambda.Runtime.NODEJS_16_X, //corre en node16
      handler:"get.getHello", 
      code:lambda.Code.fromAsset(path.resolve(__dirname,"lambda")), //donde esta alojado el codigo eje: s3,o el mismo prohyecto en la carpeta code
      environment:{
        GEETINGS_TABLE: gettingsTable.tableName
      }
    });

    //permisos para que lambda se conecte a dynamo
    gettingsTable.grantWriteData(saveHelloFunction); //permisos a la lambda
    gettingsTable.grantReadData(getHelloFunction); //permisos a la lambda


    //creamos el apiGateway
    const gateway = new apiGW.RestApi(this,getDefaultResourseName(props,"apiGW"));

    gateway.root
    .resourceForPath('hello')
    .addMethod("POST", new apiGW.LambdaIntegration(saveHelloFunction))

    gateway.root
    .resourceForPath('hello')
    .addMethod("GET", new apiGW.LambdaIntegration(getHelloFunction))
  }
}
