import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { JsonLogicNode } from '@/types/json-logic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface OperationNodeProps {
  node: JsonLogicNode;
  onRemove: (id: string) => void;
  onChange: (id: string, value: any) => void;
  onDrop: (item: any, parentId?: string, index?: number) => void;
  onDropZoneActive: (id: string | null) => void;
  activeDropZone: string | null;
  parentId?: string;
  index?: number;
}

interface DropZoneProps {
  parentId: string;
  index: number;
  onDrop: (item: any, parentId?: string, index?: number) => void;
  onDropZoneActive: (id: string | null) => void;
  isActive: boolean;
}

function DropZone({ parentId, index, onDrop, onDropZoneActive, isActive }: DropZoneProps) {
  const dropZoneId = `${parentId}-${index}`;

  const [, drop] = useDrop(() => ({
    accept: "operation",
    drop: (item: any) => onDrop(item, parentId, index),
    hover: () => onDropZoneActive(dropZoneId),
  }));

  return (
    <div
      ref={drop}
      className={`h-12 border-2 border-dashed rounded-md ${
        isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    />
  );
}

export function OperationNode({ 
  node, 
  onRemove, 
  onChange, 
  onDrop, 
  onDropZoneActive, 
  activeDropZone,
  parentId,
  index 
}: OperationNodeProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "operation",
    item: node,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  if (isDragging) {
    return null;
  }

  const handleLiteralChange = (value: any) => {
    let processedValue = value;
    if (node.type === 'literal') {
      switch(node.name) {
        case 'number':
          processedValue = value === '' ? 0 : Number(value);
          break;
        case 'string':
          processedValue = String(value);
          break;
        case 'boolean':
          processedValue = value === 'true';
          break;
      }
    }
    onChange(node.id, { ...node, value: processedValue });
  };

  const renderLiteralInput = () => {
    if (node.type !== 'literal') return null;

    switch(node.name) {
      case 'number':
        return (
          <input
            type="number"
            value={node.value ?? 0}
            onChange={(e) => handleLiteralChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        );
      case 'string':
        return (
          <input
            type="text"
            value={node.value ?? ''}
            onChange={(e) => handleLiteralChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        );
      case 'boolean':
        return (
          <select
            value={String(node.value ?? false)}
            onChange={(e) => handleLiteralChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={drag}
      className={`bg-white border rounded-lg shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {node.icon && (
            <FontAwesomeIcon icon={node.icon as any} className="text-gray-500" />
          )}
          <span className="font-medium">{node.displayName}</span>
        </div>
        <button
          onClick={() => onRemove(node.id)}
          className="text-gray-400 hover:text-gray-600"
        >
          <FontAwesomeIcon icon="times" />
        </button>
      </div>

      <div className="px-3 pb-3">
        {node.type === 'literal' && renderLiteralInput()}
      </div>
    </div>
  );
}