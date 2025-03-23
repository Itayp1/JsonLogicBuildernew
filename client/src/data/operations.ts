import { Operation } from "@/types/json-logic";

export const logicalOperations: Operation[] = [
  {
    name: "and",
    displayName: "AND",
    description: "Logical AND operation",
    type: "logical",
    icon: "fa-code",
    jsonLogicOp: "and",
    acceptsMultipleArguments: true
  },
  {
    name: "or",
    displayName: "OR", 
    description: "Logical OR operation",
    type: "logical",
    icon: "fa-code",
    jsonLogicOp: "or",
    acceptsMultipleArguments: true
  },
  {
    name: "not",
    displayName: "NOT",
    description: "Logical NOT operation",
    type: "logical", 
    icon: "fa-code",
    jsonLogicOp: "!",
    acceptsMultipleArguments: false
  }
];

export const comparisonOperations: Operation[] = [
  {
    name: "equal",
    displayName: "Equal (==)",
    description: "Check if values are equal",
    type: "comparison",
    icon: "fa-equals",
    jsonLogicOp: "==",
    acceptsMultipleArguments: false
  },
  {
    name: "strict_equal",
    displayName: "Strict Equal (===)",
    description: "Check if values are strictly equal",
    type: "comparison",
    icon: "fa-equals",
    jsonLogicOp: "===",
    acceptsMultipleArguments: false
  },
  {
    name: "greater",
    displayName: "Greater Than (>)",
    description: "Check if first value is greater",
    type: "comparison",
    icon: "fa-greater-than",
    jsonLogicOp: ">",
    acceptsMultipleArguments: false
  },
  {
    name: "less",
    displayName: "Less Than (<)",
    description: "Check if first value is less",
    type: "comparison",
    icon: "fa-less-than",
    jsonLogicOp: "<",
    acceptsMultipleArguments: false
  }
];

export const arithmeticOperations: Operation[] = [
  {
    name: "add",
    displayName: "Add (+)",
    description: "Add numbers together",
    type: "arithmetic",
    icon: "fa-plus",
    jsonLogicOp: "+",
    acceptsMultipleArguments: true
  },
  {
    name: "subtract",
    displayName: "Subtract (-)",
    description: "Subtract numbers",
    type: "arithmetic",
    icon: "fa-minus",
    jsonLogicOp: "-",
    acceptsMultipleArguments: false
  },
  {
    name: "multiply",
    displayName: "Multiply (*)",
    description: "Multiply numbers together",
    type: "arithmetic",
    icon: "fa-times",
    jsonLogicOp: "*",
    acceptsMultipleArguments: true
  },
  {
    name: "divide",
    displayName: "Divide (/)",
    description: "Divide numbers",
    type: "arithmetic",
    icon: "fa-divide",
    jsonLogicOp: "/",
    acceptsMultipleArguments: false
  }
];

export const dataAccessOperations: Operation[] = [
  {
    name: "var",
    displayName: "Variable",
    description: "Access variable value",
    type: "accessor",
    icon: "fa-database",
    jsonLogicOp: "var",
    acceptsMultipleArguments: false
  },
  {
    name: "missing",
    displayName: "Missing",
    description: "Check if variable is missing",
    type: "accessor",
    icon: "fa-question-circle",
    jsonLogicOp: "missing",
    acceptsMultipleArguments: true
  }
];

export const arrayOperations: Operation[] = [
  {
    name: "map",
    displayName: "Map",
    description: "Map array elements",
    type: "array",
    icon: "fa-list",
    jsonLogicOp: "map",
    acceptsMultipleArguments: false
  },
  {
    name: "filter",
    displayName: "Filter",
    description: "Filter array elements",
    type: "array",
    icon: "fa-filter",
    jsonLogicOp: "filter",
    acceptsMultipleArguments: false
  },
  {
    name: "reduce",
    displayName: "Reduce",
    description: "Reduce array to single value",
    type: "array",
    icon: "fa-compress",
    jsonLogicOp: "reduce",
    acceptsMultipleArguments: false
  }
];

export const literalOperations: Operation[] = [
  {
    name: "number",
    displayName: "Number",
    description: "Number literal",
    type: "literal",
    icon: "fa-hashtag",
    jsonLogicOp: "",
    acceptsMultipleArguments: false
  },
  {
    name: "string",
    displayName: "String",
    description: "String literal",
    type: "literal",
    icon: "fa-font",
    jsonLogicOp: "",
    acceptsMultipleArguments: false
  },
  {
    name: "boolean",
    displayName: "Boolean",
    description: "Boolean literal",
    type: "literal",
    icon: "fa-toggle-on",
    jsonLogicOp: "",
    acceptsMultipleArguments: false
  }
];

export const allOperations = [
  ...logicalOperations,
  ...comparisonOperations,
  ...arithmeticOperations,
  ...dataAccessOperations,
  ...arrayOperations,
  ...literalOperations
];

export function getOperationByName(name: string): Operation | undefined {
  return allOperations.find(op => op.name === name);
}