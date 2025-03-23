import { useMemo } from "react";
import { useDrag } from "react-dnd";
import { 
  logicalOperations, 
  comparisonOperations, 
  arithmeticOperations, 
  dataAccessOperations, 
  arrayOperations, 
  literalOperations 
} from "@/data/operations";
import { Operation } from "@/types/json-logic";

interface OperationItemProps {
  operation: Operation;
  onDragStart: (operation: Operation) => void;
}

function OperationItem({ operation, onDragStart }: OperationItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "operation",
    item: () => {
      onDragStart(operation);
      return operation;
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    })
  }));

  const getBorderColor = () => {
    switch (operation.type) {
      case "logical": return "border-json-logic-logical";
      case "comparison": return "border-json-logic-comparison";
      case "arithmetic": return "border-json-logic-arithmetic";
      case "array": return "border-json-logic-array";
      case "accessor": return "border-json-logic-accessor";
      case "literal": return "border-json-logic-literal";
      default: return "border-gray-300";
    }
  };

  const getBgColor = () => {
    switch (operation.type) {
      case "logical": return "bg-blue-100 text-json-logic-logical";
      case "comparison": return "bg-purple-100 text-json-logic-comparison";
      case "arithmetic": return "bg-pink-100 text-json-logic-arithmetic";
      case "array": return "bg-amber-100 text-json-logic-array";
      case "accessor": return "bg-emerald-100 text-json-logic-accessor";
      case "literal": return "bg-gray-100 text-json-logic-literal";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getIcon = () => {
    return operation.icon || "fa-code";
  };

  return (
    <div 
      ref={drag}
      className={`p-2 bg-white border-l-4 ${getBorderColor()} rounded shadow-sm drag-handle ${isDragging ? 'opacity-50' : ''}`}
      data-operation={operation.name}
      data-type={operation.type}
    >
      <div className="flex items-center">
        <div className={`${getBgColor()} w-8 h-8 rounded flex items-center justify-center mr-2`}>
          <i className={`fas ${getIcon()}`}></i>
        </div>
        <div>
          <div className="font-medium">{operation.displayName}</div>
          <div className="text-xs text-gray-500">{operation.description}</div>
        </div>
      </div>
    </div>
  );
}

interface OperationGroupProps {
  title: string;
  operations: Operation[];
  searchTerm: string;
  onDragStart: (operation: Operation) => void;
}

function OperationGroup({ title, operations, searchTerm, onDragStart }: OperationGroupProps) {
  const filteredOperations = operations.filter(op => 
    op.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredOperations.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
      <div className="space-y-2 mt-1">
        {filteredOperations.map((operation) => (
          <OperationItem 
            key={operation.name} 
            operation={operation} 
            onDragStart={onDragStart} 
          />
        ))}
      </div>
    </div>
  );
}

interface OperationsSidebarProps {
  onDragStart: (operation: Operation) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function OperationsSidebar({ 
  onDragStart, 
  searchTerm, 
  onSearchChange 
}: OperationsSidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-medium text-gray-700">Operations</h2>
        <div className="mt-2 relative">
          <input 
            type="text" 
            placeholder="Search operations..." 
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <i className="fas fa-search text-gray-400 absolute left-3 top-3"></i>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2">
        <OperationGroup 
          title="Logical" 
          operations={logicalOperations} 
          searchTerm={searchTerm}
          onDragStart={onDragStart} 
        />
        <OperationGroup 
          title="Comparison" 
          operations={comparisonOperations} 
          searchTerm={searchTerm}
          onDragStart={onDragStart} 
        />
        <OperationGroup 
          title="Arithmetic" 
          operations={arithmeticOperations} 
          searchTerm={searchTerm}
          onDragStart={onDragStart} 
        />
        <OperationGroup 
          title="Data Access" 
          operations={dataAccessOperations} 
          searchTerm={searchTerm}
          onDragStart={onDragStart} 
        />
        <OperationGroup 
          title="Arrays" 
          operations={arrayOperations} 
          searchTerm={searchTerm}
          onDragStart={onDragStart} 
        />
        <OperationGroup 
          title="Literals" 
          operations={literalOperations} 
          searchTerm={searchTerm}
          onDragStart={onDragStart} 
        />
      </div>
    </aside>
  );
}
