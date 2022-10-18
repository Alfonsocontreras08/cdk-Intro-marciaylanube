import { StackPropsCustom } from "../interfaces";

export function getDefaultProps(props:StackPropsCustom){
    return {
            stackName:props.name,
            env:{
              account:props.account,
              region:props.region
            }
          };
}

export function getDefaultResourseName(props:StackPropsCustom,name:string){
    return `${props.name}-${name}-${props.environment}`;
}