import { useState } from "react";
import OperationsSidebar from "@/components/operations-sidebar";
import BuilderWorkspace from "@/components/builder-workspace";
import PreviewPanel from "@/components/preview-panel";
import HeaderActions from "@/components/header-actions";
import { useJsonLogicBuilder } from "@/hooks/use-json-logic-builder";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Paper,
  CssBaseline
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';

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
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      bgcolor: 'background.default'
    }}>
      <CssBaseline />
      
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CodeIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
              JSON Logic Builder
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <HeaderActions 
            onImport={importJson} 
            onExport={exportJson} 
            onNewExpression={clearWorkspace} 
          />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1, 
        overflow: 'hidden',
        p: 2,
        gap: 2
      }}>
        <Paper 
          elevation={0} 
          sx={{ 
            width: 280, 
            overflow: 'auto',
            border: 1,
            borderColor: 'divider'
          }}
        >
          <OperationsSidebar 
            onDragStart={handleDragStart} 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </Paper>
        
        <Paper 
          elevation={0} 
          sx={{ 
            flexGrow: 1, 
            overflow: 'auto',
            border: 1,
            borderColor: 'divider'
          }}
        >
          <BuilderWorkspace 
            expression={expression} 
            onDrop={handleDrop} 
            onChange={handleOperationChange}
            onRemove={handleRemoveOperation}
            onClear={clearWorkspace}
            onUndo={undo}
          />
        </Paper>
        
        <Paper 
          elevation={0} 
          sx={{ 
            width: 340, 
            overflow: 'auto',
            border: 1,
            borderColor: 'divider'
          }}
        >
          <PreviewPanel 
            jsonLogic={expression} 
            testData={testData}
            onTestDataChange={setTestData}
            testResult={testResult}
            onRunTest={testExpression}
          />
        </Paper>
      </Box>
    </Box>
  );
}
