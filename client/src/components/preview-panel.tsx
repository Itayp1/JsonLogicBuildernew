import { useState } from "react";
import { JsonLogicNode } from "@/types/json-logic";
import JsonSyntaxHighlighter from "@/components/ui/json-syntax-highlighter";

interface PreviewPanelProps {
  jsonLogic: JsonLogicNode | null;
  testData: string;
  onTestDataChange: (data: string) => void;
  testResult: any;
  onRunTest: () => void;
}

export default function PreviewPanel({ 
  jsonLogic, 
  testData, 
  onTestDataChange,
  testResult, 
  onRunTest 
}: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<'json' | 'test'>('json');
  
  const handleCopyJson = () => {
    if (!jsonLogic) return;
    
    const jsonString = JSON.stringify(jsonLogic.jsonLogic, null, 2);
    navigator.clipboard.writeText(jsonString);
  };

  return (
    <aside className="w-96 bg-white border-l border-gray-200 flex flex-col">
      <div className="flex border-b border-gray-200">
        <button 
          className={`flex-1 py-3 px-4 text-center font-medium focus:outline-none focus:bg-gray-50 ${
            activeTab === 'json' 
              ? 'bg-gray-50 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('json')}
        >
          JSON Logic
        </button>
        <button 
          className={`flex-1 py-3 px-4 text-center font-medium focus:outline-none focus:bg-gray-50 ${
            activeTab === 'test' 
              ? 'bg-gray-50 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('test')}
        >
          Test Data
        </button>
      </div>
      
      {activeTab === 'json' ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-medium text-gray-700">Preview</h3>
            <button 
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              onClick={handleCopyJson}
              disabled={!jsonLogic}
            >
              <i className="far fa-copy mr-1"></i> Copy
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-4 bg-gray-50 font-mono text-sm">
            {jsonLogic ? (
              <JsonSyntaxHighlighter json={jsonLogic.jsonLogic} />
            ) : (
              <div className="text-gray-400 italic">
                No JSON Logic expression created yet.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-700 mb-2">Test Data</h3>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">{"{"}</span>
              </div>
              <textarea 
                className="w-full pl-6 pr-6 py-2 border border-gray-300 rounded-md font-mono text-sm"
                rows={5}
                value={testData}
                onChange={(e) => onTestDataChange(e.target.value)}
                placeholder='"age": 25,
"name": "John",
"active": true'
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">{"}"}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-b border-gray-200">
            <button 
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={onRunTest}
              disabled={!jsonLogic}
            >
              Run Test
            </button>
          </div>
          
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-700 mb-2">Result</h3>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md font-mono text-sm">
              {testResult !== undefined ? (
                <span className={testResult === true ? "text-green-600" : 
                                testResult === false ? "text-red-600" : 
                                typeof testResult === "number" ? "text-blue-600" : 
                                typeof testResult === "string" ? "text-purple-600" : ""}>
                  {JSON.stringify(testResult, null, 2)}
                </span>
              ) : (
                <span className="text-gray-400 italic">
                  Run the test to see the result
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
