declare module 'json-logic-js' {
  interface JsonLogic {
    apply: (logic: any, data: any) => any;
    add_operation: (name: string, fn: Function) => void;
  }
  
  const jsonLogic: JsonLogic;
  
  export default jsonLogic;
}