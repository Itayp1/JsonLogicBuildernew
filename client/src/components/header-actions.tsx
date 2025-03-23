interface HeaderActionsProps {
  onImport: () => void;
  onExport: () => void;
  onNewExpression: () => void;
}

export default function HeaderActions({ onImport, onExport, onNewExpression }: HeaderActionsProps) {
  return (
    <div className="flex space-x-2">
      <button 
        className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 transition-colors"
        onClick={onImport}
      >
        <i className="fas fa-upload mr-1"></i> Import
      </button>
      <button 
        className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 transition-colors"
        onClick={onExport}
      >
        <i className="fas fa-download mr-1"></i> Export
      </button>
      <button 
        className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
        onClick={onNewExpression}
      >
        <i className="fas fa-plus mr-1"></i> New Expression
      </button>
    </div>
  );
}
