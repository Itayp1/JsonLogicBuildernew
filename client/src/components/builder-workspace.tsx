import { useState, useRef } from "react";
import { useDrop } from "react-dnd";
import { Operation, JsonLogicNode } from "@/types/json-logic";
import OperationNode from "@/components/ui/operation-node";

interface BuilderWorkspaceProps {
  expression: JsonLogicNode | null;
  onDrop: (item: Operation, parentId?: string, index?: number) => void;
  onChange: (id: string, value: any) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onUndo: () => void;
}

export default function BuilderWorkspace({ 
  expression, 
  onDrop, 
  onChange, 
  onRemove,
  onClear,
  onUndo
}: BuilderWorkspaceProps) {
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "operation",
    drop: (item: Operation, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true })
    }),
  }));

  const handleDropZoneActive = (id: string, isActive: boolean) => {
    if (isActive) {
      setActiveDropZone(id);
    } else if (activeDropZone === id) {
      setActiveDropZone(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <h2 className="font-medium text-gray-700">Builder Workspace</h2>
        <div className="flex space-x-2">
          <button 
            className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 transition-colors"
            onClick={onClear}
          >
            <i className="fas fa-trash-alt mr-1"></i> Clear
          </button>
          <button 
            className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 transition-colors"
            onClick={onUndo}
          >
            <i className="fas fa-undo mr-1"></i> Undo
          </button>
        </div>
      </div>
      
      <div 
        ref={drop} 
        className={`flex-1 overflow-auto p-6 bg-gray-50 ${isOver ? 'bg-blue-50' : ''}`}
      >
        {!expression ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="text-6xl mb-4">
              <i className="fas fa-code-branch"></i>
            </div>
            <h3 className="text-xl font-medium mb-2">Start Building Your Logic</h3>
            <p className="text-center max-w-md mb-6">
              Drag operations from the sidebar and drop them here to build your JSON Logic expression.
            </p>
          </div>
        ) : (
          <OperationNode 
            node={expression}
            onRemove={onRemove}
            onChange={onChange}
            onDrop={onDrop}
            onDropZoneActive={handleDropZoneActive}
            activeDropZone={activeDropZone}
          />
        )}
      </div>
    </div>
  );
}
