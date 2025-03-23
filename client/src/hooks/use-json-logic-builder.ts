import { useState, useCallback, useRef } from 'react';
import { Operation, JsonLogicNode } from '@/types/json-logic';
import { v4 as uuidv4 } from 'uuid';
import { getOperationByName } from '@/data/operations';
import jsonLogic from 'json-logic-js';
import { buildJsonLogic, parseJsonLogic } from '@/lib/json-logic-utils';

export function useJsonLogicBuilder() {
  const [expression, setExpression] = useState<JsonLogicNode | null>(null);
  const [history, setHistory] = useState<(JsonLogicNode | null)[]>([]);
  const [testData, setTestData] = useState('');
  const [testResult, setTestResult] = useState<any>(undefined);
  const draggedOperation = useRef<Operation | null>(null);

  const addToHistory = useCallback((expr: JsonLogicNode | null) => {
    setHistory(prev => [...prev.slice(-9), expr]);
  }, []);

  const handleDragStart = useCallback((operation: Operation) => {
    draggedOperation.current = operation;
  }, []);

  const createNode = useCallback((operation: Operation): JsonLogicNode => {
    const id = uuidv4();
    
    if (operation.type === 'literal') {
      let defaultValue: any;
      
      switch (operation.literalType) {
        case 'number':
          defaultValue = 0;
          break;
        case 'string':
          defaultValue = '';
          break;
        case 'boolean':
          defaultValue = false;
          break;
        default:
          defaultValue = null;
      }
      
      return {
        id,
        type: operation.type,
        literalType: operation.literalType,
        name: operation.name,
        displayName: operation.displayName,
        icon: operation.icon,
        value: defaultValue
      };
    }
    
    if (operation.type === 'accessor') {
      return {
        id,
        type: operation.type,
        name: operation.name,
        displayName: operation.displayName,
        icon: operation.icon,
        path: ''
      };
    }
    
    // Special handling for comparison operations - they need exactly 2 arguments
    if (operation.type === 'comparison') {
      return {
        id,
        type: operation.type,
        name: operation.name,
        displayName: operation.displayName,
        icon: operation.icon,
        children: []
      };
    }
    
    // For all other operations
    return {
      id,
      type: operation.type,
      name: operation.name,
      displayName: operation.displayName,
      icon: operation.icon,
      children: []
    };
  }, []);

  const handleDrop = useCallback((op: Operation, parentId?: string, index?: number) => {
    if (!op) return;
    
    addToHistory(expression);
    
    const newNode = createNode(op);
    
    if (!parentId) {
      setExpression(newNode);
      return;
    }
    
    setExpression(prev => {
      if (!prev) return newNode;
      
      const updateChildren = (node: JsonLogicNode): JsonLogicNode => {
        if (node.id === parentId) {
          if (!node.children) {
            return { ...node, children: [newNode] };
          }
          
          const newChildren = [...node.children];
          
          if (index !== undefined) {
            newChildren.splice(index, 0, newNode);
          } else {
            newChildren.push(newNode);
          }
          
          return { ...node, children: newChildren };
        }
        
        if (node.children) {
          return { ...node, children: node.children.map(updateChildren) };
        }
        
        return node;
      };
      
      return updateChildren(prev);
    });
  }, [expression, createNode, addToHistory]);

  const handleOperationChange = useCallback((id: string, value: any) => {
    addToHistory(expression);
    
    setExpression(prev => {
      if (!prev) return null;
      
      const updateNode = (node: JsonLogicNode): JsonLogicNode => {
        if (node.id === id) {
          if (node.type === 'literal') {
            return { ...node, value };
          }
          
          if (node.type === 'accessor') {
            return { ...node, path: value };
          }
          
          return node;
        }
        
        if (node.children) {
          return { ...node, children: node.children.map(updateNode) };
        }
        
        return node;
      };
      
      return updateNode(prev);
    });
  }, [expression, addToHistory]);

  const handleRemoveOperation = useCallback((id: string) => {
    addToHistory(expression);
    
    setExpression(prev => {
      if (!prev) return null;
      
      if (prev.id === id) {
        return null;
      }
      
      const updateChildren = (node: JsonLogicNode): JsonLogicNode => {
        if (!node.children) return node;
        
        const newChildren = node.children.filter(child => child.id !== id);
        
        if (newChildren.length !== node.children.length) {
          return { ...node, children: newChildren };
        }
        
        return { ...node, children: node.children.map(updateChildren) };
      };
      
      return updateChildren(prev);
    });
  }, [expression, addToHistory]);

  const clearWorkspace = useCallback(() => {
    addToHistory(expression);
    setExpression(null);
    setTestResult(undefined);
  }, [expression, addToHistory]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    
    const prevState = history[history.length - 1];
    setExpression(prevState);
    setHistory(prev => prev.slice(0, -1));
  }, [history]);

  const exportJson = useCallback(() => {
    if (!expression) return;
    
    // Use buildJsonLogic to get proper JSON Logic object
    const jsonLogicObj = buildJsonLogic(expression);
    if (!jsonLogicObj) {
      alert('Invalid JSON Logic expression');
      return;
    }
    
    const json = JSON.stringify(jsonLogicObj, null, 2);
    
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'json-logic-expression.json';
    a.click();
    
    URL.revokeObjectURL(url);
  }, [expression]);

  const importJson = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          
          // Convert the imported JSON to our internal node structure
          const importedExpression = parseJsonLogic(json);
          
          if (importedExpression) {
            addToHistory(expression);
            setExpression(importedExpression);
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Invalid JSON file');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  }, [expression, addToHistory]);

  const testExpression = useCallback(() => {
    if (!expression) return;
    
    try {
      let testDataObj = {};
      
      try {
        testDataObj = JSON.parse(`{${testData}}`);
      } catch (err) {
        alert('Invalid test data. Please check your JSON format.');
        return;
      }
      
      // Use buildJsonLogic to get proper JSON Logic object
      const jsonLogicObj = buildJsonLogic(expression);
      if (!jsonLogicObj) {
        alert('Invalid JSON Logic expression');
        return;
      }
      
      const result = jsonLogic.apply(jsonLogicObj, testDataObj);
      setTestResult(result);
    } catch (error) {
      console.error('Error evaluating expression:', error);
      alert('Error evaluating expression');
    }
  }, [expression, testData]);

  return {
    expression,
    setExpression,
    handleDragStart,
    handleDrop,
    handleOperationChange,
    handleRemoveOperation,
    clearWorkspace,
    undo,
    exportJson,
    importJson,
    testExpression,
    testData,
    setTestData,
    testResult,
  };
}
