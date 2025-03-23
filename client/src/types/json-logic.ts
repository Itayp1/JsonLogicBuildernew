export interface Operation {
  name: string;
  displayName: string;
  description: string;
  type: "logical" | "comparison" | "arithmetic" | "array" | "accessor" | "literal";
  icon?: string;
  jsonLogicOp: string | null;
  acceptsMultipleArguments: boolean;
  literalType?: "string" | "number" | "boolean";
}

export interface JsonLogicNode {
  id: string;
  type: "logical" | "comparison" | "arithmetic" | "array" | "accessor" | "literal";
  name: string;
  displayName: string;
  icon?: string;
  
  // For literal types
  literalType?: "string" | "number" | "boolean";
  value?: any;
  
  // For accessor types
  path?: string;
  
  // For operation types
  children?: JsonLogicNode[];
}

export interface DragItem {
  type: string;
  id: string;
}
