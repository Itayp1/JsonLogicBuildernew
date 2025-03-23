import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Operation, JsonLogicNode } from "@/types/json-logic";

interface OperationNodeProps {
  node: JsonLogicNode;
  onRemove: (id: string) => void;
  onChange: (id: string, value: any) => void;
  onDrop: (item: Operation, parentId?: string, index?: number) => void;
  onDropZoneActive: (id: string, isActive: boolean) => void;
  activeDropZone: string | null;
  parentId?: string;
  index?: number;
}

export default function OperationNode({ 
  node, 
  onRemove, 
  onChange, 
  onDrop,
  onDropZoneActive,
  activeDropZone,
  parentId,
  index
}: OperationNodeProps) {
  const [collapsed, setCollapsed] = useState(false);

  const getBorderColor = () => {
    switch (node.type) {
      case "logical": return "border-json-logic-logical";
      case "comparison": return "border-json-logic-comparison";
      case "arithmetic": return "border-json-logic-arithmetic";
      case "array": return "border-json-logic-array";
      case "accessor": return "border-json-logic-accessor";
      case "literal": return "border-json-logic-literal";
      default: return "border-gray-300";
    }
  };

  const getHeaderBgColor = () => {
    switch (node.type) {
      case "logical": return "bg-blue-50 border-blue-100";
      case "comparison": return "bg-purple-50 border-purple-100";
      case "arithmetic": return "bg-pink-50 border-pink-100";
      case "array": return "bg-amber-50 border-amber-100";
      case "accessor": return "bg-emerald-50 border-emerald-100";
      case "literal": return "bg-gray-50 border-gray-100";
      default: return "bg-gray-50 border-gray-100";
    }
  };

  const getTextColor = () => {
    switch (node.type) {
      case "logical": return "text-json-logic-logical";
      case "comparison": return "text-json-logic-comparison";
      case "arithmetic": return "text-json-logic-arithmetic";
      case "array": return "text-json-logic-array";
      case "accessor": return "text-json-logic-accessor";
      case "literal": return "text-json-logic-literal";
      default: return "text-gray-700";
    }
  };

  const getIcon = () => {
    return node.icon || "fa-code";
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "node",
    item: () => ({ id: node.id, type: node.type }),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const renderArguments = () => {
    if (node.type === "literal") {
      switch (node.literalType) {
        case "number":
          return (
            <input 
              type="number" 
              value={node.value ?? 0} 
              onChange={(e) => onChange(node.id, e.target.value === '' ? 0 : Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          );
        case "string":
          return (
            <input 
              type="text" 
              value={node.value ?? ""} 
              onChange={(e) => onChange(node.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          );
        case "boolean":
          return (
            <select 
              value={String(node.value ?? false)} 
              onChange={(e) => onChange(node.id, e.target.value === "true")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          );
        default:
          return null;
      }
    } else if (node.type === "accessor") {
      return (
        <input 
          type="text" 
          value={node.path || ""} 
          onChange={(e) => onChange(node.id, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Property path (e.g. user.name)"
        />
      );
    } else if (node.type === "comparison") {
      // Special handling for comparison operations
      return (
        <div className="space-y-3">
          {/* Left-side comparison value */}
          <div className="comparison-value">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Left-side value:</h3>
            <div className="flex space-x-3">
              <div className="flex-1">
                {node.children && node.children[0] ? (
                  <OperationNode 
                    key={node.children[0].id} 
                    node={node.children[0]} 
                    onRemove={onRemove} 
                    onChange={onChange}
                    onDrop={onDrop}
                    onDropZoneActive={onDropZoneActive}
                    activeDropZone={activeDropZone}
                    parentId={node.id}
                    index={0}
                  />
                ) : (
                  <DropZone 
                    parentId={node.id}
                    index={0}
                    onDrop={onDrop}
                    onDropZoneActive={onDropZoneActive}
                    isActive={activeDropZone === `${node.id}-0`}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Right-side comparison value */}
          <div className="comparison-value">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Right-side value:</h3>
            <div className="flex space-x-3">
              <div className="flex-1">
                {node.children && node.children[1] ? (
                  <OperationNode 
                    key={node.children[1].id} 
                    node={node.children[1]} 
                    onRemove={onRemove} 
                    onChange={onChange}
                    onDrop={onDrop}
                    onDropZoneActive={onDropZoneActive}
                    activeDropZone={activeDropZone}
                    parentId={node.id}
                    index={1}
                  />
                ) : (
                  <DropZone 
                    parentId={node.id}
                    index={1}
                    onDrop={onDrop}
                    onDropZoneActive={onDropZoneActive}
                    isActive={activeDropZone === `${node.id}-1`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (node.children && node.children.length > 0) {
      return (
        <div className="space-y-3">
          {node.children.map((child, childIndex) => (
            <OperationNode 
              key={child.id} 
              node={child} 
              onRemove={onRemove} 
              onChange={onChange}
              onDrop={onDrop}
              onDropZoneActive={onDropZoneActive}
              activeDropZone={activeDropZone}
              parentId={node.id}
              index={childIndex}
            />
          ))}
          <DropZone 
            parentId={node.id}
            index={node.children.length}
            onDrop={onDrop}
            onDropZoneActive={onDropZoneActive}
            isActive={activeDropZone === `${node.id}-${node.children.length}`}
          />
        </div>
      );
    } else {
      return (
        <DropZone 
          parentId={node.id}
          index={0}
          onDrop={onDrop}
          onDropZoneActive={onDropZoneActive}
          isActive={activeDropZone === `${node.id}-0`}
        />
      );
    }
  };

  return (
    <div 
      className={`operation-node bg-white border ${getBorderColor()} rounded-lg shadow-sm ${isDragging ? 'opacity-50' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className={`operation-header flex items-center px-4 py-2 ${getHeaderBgColor()} border-b rounded-t-lg`}>
        <div ref={drag} className="drag-handle mr-2 cursor-grab text-gray-400 hover:text-gray-600">
          <i className="fas fa-grip-vertical"></i>
        </div>
        <div className={`operation-type flex items-center ${getTextColor()} font-medium`}>
          <i className={`fas ${getIcon()} mr-2`}></i>
          <span>{node.displayName}</span>
        </div>
        <div className="ml-auto flex items-center space-x-1">
          {(node.type !== "literal" && node.type !== "accessor") && (
            <button 
              className="p-1 text-gray-400 hover:text-gray-600"
              onClick={() => setCollapsed(!collapsed)}
            >
              <i className={`fas fa-chevron-${collapsed ? 'down' : 'up'}`}></i>
            </button>
          )}
          <button 
            className="p-1 text-gray-400 hover:text-gray-600"
            onClick={() => onRemove(node.id)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      {!collapsed && (
        <div className="operation-content p-4">
          <div className="operation-arguments">
            {renderArguments()}
          </div>
        </div>
      )}
    </div>
  );
}

interface DropZoneProps {
  parentId: string;
  index: number;
  onDrop: (item: Operation, parentId?: string, index?: number) => void;
  onDropZoneActive: (id: string, isActive: boolean) => void;
  isActive: boolean;
}

function DropZone({ 
  parentId, 
  index, 
  onDrop,
  onDropZoneActive,
  isActive
}: DropZoneProps) {
  const dropZoneId = `${parentId}-${index}`;
  
  const [, drop] = useDrop(() => ({
    accept: "operation",
    drop: (item: Operation) => {
      onDrop(item, parentId, index);
    },
    hover: () => {
      onDropZoneActive(dropZoneId, true);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  return (
    <div 
      ref={drop}
      className={`drop-zone border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-400 hover:bg-blue-50 hover:border-blue-200 transition-colors ${isActive ? 'active bg-blue-50 border-blue-200' : ''}`}
      onMouseLeave={() => onDropZoneActive(dropZoneId, false)}
    >
      <p><i className="fas fa-plus mr-1"></i> Drop an operation here</p>
    </div>
  );
}
