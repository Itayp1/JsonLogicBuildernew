import { JsonLogicNode } from '@/types/json-logic';
import { v4 as uuidv4 } from 'uuid';
import { getOperationByName, allOperations } from '@/data/operations';

export function buildJsonLogic(node: JsonLogicNode | null): any {
  if (!node) return null;
  
  // Handle literals
  if (node.type === 'literal') {
    return node.value;
  }
  
  // Handle var accessor
  if (node.type === 'accessor' && node.name === 'var') {
    return { "var": node.path || "" };
  }
  
  // Handle operations with children
  const operationName = getOperationByName(node.name)?.jsonLogicOp;
  if (!operationName) return null;
  
  // Special handling for comparison operations
  if (node.type === 'comparison') {
    const childLogic = (node.children || []).slice(0, 2).map(child => buildJsonLogic(child));
    // If we have only one child, add a default second argument
    if (childLogic.length === 1) {
      childLogic.push(0);
    }
    return { [operationName]: childLogic };
  }
  
  // For all other operations
  const childrenLogic = (node.children || []).map(child => buildJsonLogic(child));
  return { [operationName]: childrenLogic };
}

export function parseJsonLogic(logic: any): JsonLogicNode | null {
  if (logic === null || logic === undefined) {
    return null;
  }
  
  // Handle primitive values (literals)
  if (typeof logic !== 'object') {
    const id = uuidv4();
    
    let literalType: "string" | "number" | "boolean";
    let displayName: string;
    let icon: string;
    
    if (typeof logic === 'string') {
      literalType = 'string';
      displayName = 'String';
      icon = 'fa-quote-right';
    } else if (typeof logic === 'number') {
      literalType = 'number';
      displayName = 'Number';
      icon = 'fa-hashtag';
    } else if (typeof logic === 'boolean') {
      literalType = 'boolean';
      displayName = 'Boolean';
      icon = 'fa-toggle-on';
    } else {
      return null;
    }
    
    return {
      id,
      type: 'literal',
      name: `literal-${literalType}`,
      displayName,
      icon,
      literalType,
      value: logic
    };
  }
  
  // Handle objects (operations)
  const keys = Object.keys(logic);
  
  if (keys.length === 0) {
    return null;
  }
  
  const operator = keys[0];
  const args = logic[operator];
  
  // Find the operation definition
  const operationDef = allOperations.find(op => op.jsonLogicOp === operator);
  
  if (!operationDef) {
    return null;
  }
  
  const id = uuidv4();
  
  // Handle variable access
  if (operator === 'var') {
    return {
      id,
      type: 'accessor',
      name: 'var',
      displayName: 'var',
      icon: 'fa-database',
      path: typeof args === 'string' ? args : ''
    };
  }
  
  // Handle regular operations
  const argsArray = Array.isArray(args) ? args : [args];
  
  const children = argsArray.map(arg => parseJsonLogic(arg)).filter(Boolean) as JsonLogicNode[];
  
  // Special handling for comparison operations
  if (operationDef.type === 'comparison') {
    return {
      id,
      type: operationDef.type,
      name: operationDef.name,
      displayName: operationDef.displayName,
      icon: operationDef.icon,
      children
    };
  }
  
  // For all other operations
  return {
    id,
    type: operationDef.type,
    name: operationDef.name,
    displayName: operationDef.displayName,
    icon: operationDef.icon,
    children
  };
}
