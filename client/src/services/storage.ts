
import { JsonLogicExpression } from "@/types/json-logic";

const STORAGE_KEY = 'json_logic_expressions';

export function saveExpression(expression: JsonLogicExpression): void {
  const expressions = getAllExpressions();
  expressions.push({
    ...expression,
    id: Date.now(),
    createdAt: new Date().toISOString()
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expressions));
}

export function getAllExpressions(): JsonLogicExpression[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function deleteExpression(id: number): void {
  const expressions = getAllExpressions().filter(exp => exp.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expressions));
}

export function updateExpression(expression: JsonLogicExpression): void {
  const expressions = getAllExpressions().map(exp => 
    exp.id === expression.id ? expression : exp
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expressions));
}
