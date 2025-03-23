import { useState } from "react";
import OperationsSidebar from "@/components/operations-sidebar";
import BuilderWorkspace from "@/components/builder-workspace";
import PreviewPanel from "@/components/preview-panel";
import HeaderActions from "@/components/header-actions";
import { useJsonLogicBuilder } from "@/hooks/use-json-logic-builder";

export default function Home() {
  const {
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
  } = useJsonLogicBuilder();

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="bg-gray-100 font-sans text-gray-900 h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            <i className="fas fa-code-branch text-blue-500 mr-2"></i>
            JSON Logic Builder
          </h1>
        </div>
        
        <HeaderActions 
          onImport={importJson} 
          onExport={exportJson} 
          onNewExpression={clearWorkspace} 
        />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        <OperationsSidebar 
          onDragStart={handleDragStart} 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <BuilderWorkspace 
          expression={expression} 
          onDrop={handleDrop} 
          onChange={handleOperationChange}
          onRemove={handleRemoveOperation}
          onClear={clearWorkspace}
          onUndo={undo}
        />
        
        <PreviewPanel 
          jsonLogic={expression} 
          testData={testData}
          onTestDataChange={setTestData}
          testResult={testResult}
          onRunTest={testExpression}
        />
      </main>
    </div>
  );
}
