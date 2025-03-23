import { Operation } from "@/types/json-logic";

export const logicalOperations: Operation[] = [
  {
    name: "and",
    displayName: "and",
    description: "All conditions must be true",
    type: "logical",
    icon: "fa-code-branch",
    jsonLogicOp: "and",
    acceptsMultipleArguments: true
  },
  {
    name: "or",
    displayName: "or",
    description: "Any condition must be true",
    type: "logical",
    icon: "fa-code-branch fa-rotate-90",
    jsonLogicOp: "or",
    acceptsMultipleArguments: true
  },
  {
    name: "not",
    displayName: "not",
    description: "Negates the condition",
    type: "logical",
    icon: "fa-ban",
    jsonLogicOp: "!",
    acceptsMultipleArguments: false
  },
  {
    name: "if",
    displayName: "if",
    description: "Conditional expression",
    type: "logical",
    icon: "fa-question",
    jsonLogicOp: "if",
    acceptsMultipleArguments: true
  }
];

export const comparisonOperations: Operation[] = [
  {
    name: "equal",
    displayName: "==",
    description: "Equal to",
    type: "comparison",
    icon: "fa-equals",
    jsonLogicOp: "==",
    acceptsMultipleArguments: false
  },
  {
    name: "strict_equal",
    displayName: "===",
    description: "Strictly equal to",
    type: "comparison",
    icon: "fa-equals",
    jsonLogicOp: "===",
    acceptsMultipleArguments: false
  },
  {
    name: "greater",
    displayName: ">",
    description: "Greater than",
    type: "comparison",
    icon: "fa-greater-than",
    jsonLogicOp: ">",
    acceptsMultipleArguments: false
  },
  {
    name: "greater_equal",
    displayName: ">=",
    description: "Greater than or equal",
    type: "comparison",
    icon: "fa-greater-than-equal",
    jsonLogicOp: ">=",
    acceptsMultipleArguments: false
  },
  {
    name: "less",
    displayName: "<",
    description: "Less than",
    type: "comparison",
    icon: "fa-less-than",
    jsonLogicOp: "<",
    acceptsMultipleArguments: false
  },
  {
    name: "less_equal",
    displayName: "<=",
    description: "Less than or equal",
    type: "comparison",
    icon: "fa-less-than-equal",
    jsonLogicOp: "<=",
    acceptsMultipleArguments: false
  }
];

export const arithmeticOperations: Operation[] = [
  {
    name: "add",
    displayName: "+",
    description: "Addition",
    type: "arithmetic",
    icon: "fa-plus",
    jsonLogicOp: "+",
    acceptsMultipleArguments: true
  },
  {
    name: "subtract",
    displayName: "-",
    description: "Subtraction",
    type: "arithmetic",
    icon: "fa-minus",
    jsonLogicOp: "-",
    acceptsMultipleArguments: true
  },
  {
    name: "multiply",
    displayName: "*",
    description: "Multiplication",
    type: "arithmetic",
    icon: "fa-times",
    jsonLogicOp: "*",
    acceptsMultipleArguments: true
  },
  {
    name: "divide",
    displayName: "/",
    description: "Division",
    type: "arithmetic",
    icon: "fa-divide",
    jsonLogicOp: "/",
    acceptsMultipleArguments: true
  },
  {
    name: "modulo",
    displayName: "%",
    description: "Modulo (remainder)",
    type: "arithmetic",
    icon: "fa-percentage",
    jsonLogicOp: "%",
    acceptsMultipleArguments: false
  }
];

export const dataAccessOperations: Operation[] = [
  {
    name: "var",
    displayName: "var",
    description: "Access variable value",
    type: "accessor",
    icon: "fa-database",
    jsonLogicOp: "var",
    acceptsMultipleArguments: false
  },
  {
    name: "missing",
    displayName: "missing",
    description: "Check if variable is missing",
    type: "accessor",
    icon: "fa-question-circle",
    jsonLogicOp: "missing",
    acceptsMultipleArguments: true
  },
  {
    name: "missing_some",
    displayName: "missing_some",
    description: "Check if some variables are missing",
    type: "accessor",
    icon: "fa-list-check",
    jsonLogicOp: "missing_some",
    acceptsMultipleArguments: true
  }
];

export const arrayOperations: Operation[] = [
  {
    name: "map",
    displayName: "map",
    description: "Transform array elements",
    type: "array",
    icon: "fa-map",
    jsonLogicOp: "map",
    acceptsMultipleArguments: false
  },
  {
    name: "filter",
    displayName: "filter",
    description: "Filter array elements",
    type: "array",
    icon: "fa-filter",
    jsonLogicOp: "filter",
    acceptsMultipleArguments: false
  },
  {
    name: "reduce",
    displayName: "reduce",
    description: "Reduce array to single value",
    type: "array",
    icon: "fa-compress",
    jsonLogicOp: "reduce",
    acceptsMultipleArguments: false
  },
  {
    name: "all",
    displayName: "all",
    description: "All elements match condition",
    type: "array",
    icon: "fa-check-double",
    jsonLogicOp: "all",
    acceptsMultipleArguments: false
  },
  {
    name: "some",
    displayName: "some",
    description: "Some elements match condition",
    type: "array",
    icon: "fa-check",
    jsonLogicOp: "some",
    acceptsMultipleArguments: false
  }
];

export const literalOperations: Operation[] = [
  {
    name: "literal-number",
    displayName: "Number",
    description: "Numeric value",
    type: "literal",
    literalType: "number",
    icon: "fa-hashtag",
    jsonLogicOp: null,
    acceptsMultipleArguments: false
  },
  {
    name: "literal-string",
    displayName: "String",
    description: "Text value",
    type: "literal",
    literalType: "string",
    icon: "fa-quote-right",
    jsonLogicOp: null,
    acceptsMultipleArguments: false
  },
  {
    name: "literal-boolean",
    displayName: "Boolean",
    description: "True or false",
    type: "literal",
    literalType: "boolean",
    icon: "fa-toggle-on",
    jsonLogicOp: null,
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
