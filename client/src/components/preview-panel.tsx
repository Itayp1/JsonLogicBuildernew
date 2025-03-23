import { useState, useMemo } from "react";
import { JsonLogicNode } from "@/types/json-logic";
import JsonSyntaxHighlighter from "@/components/ui/json-syntax-highlighter";
import { buildJsonLogic } from "@/lib/json-logic-utils";
import { 
  Box, 
  Typography, 
  Button, 
  Tabs, 
  Tab, 
  TextField, 
  Paper,
  Divider,
  IconButton 
} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

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
  
  // Get the actual JSON Logic representation using buildJsonLogic helper
  const jsonLogicRepresentation = useMemo(() => {
    return buildJsonLogic(jsonLogic);
  }, [jsonLogic]);
  
  const handleCopyJson = () => {
    if (!jsonLogicRepresentation) return;
    
    const jsonString = JSON.stringify(jsonLogicRepresentation, null, 2);
    navigator.clipboard.writeText(jsonString);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'json' | 'test') => {
    setActiveTab(newValue);
  };

  const getResultColor = () => {
    if (testResult === true) return 'success.main';
    if (testResult === false) return 'error.main';
    if (typeof testResult === 'number') return 'primary.main';
    if (typeof testResult === 'string') return 'secondary.main';
    return 'text.secondary';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab value="json" label="JSON Logic" />
        <Tab value="test" label="Test Data" />
      </Tabs>
      
      <Divider />
      
      {activeTab === 'json' ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <Typography variant="subtitle2">Preview</Typography>
            <IconButton 
              size="small"
              onClick={handleCopyJson}
              disabled={!jsonLogic}
              title="Copy JSON"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Divider />
          
          <Box sx={{ 
            flexGrow: 1, 
            overflow: 'auto', 
            p: 2, 
            bgcolor: 'background.default',
            fontFamily: '"Roboto Mono", monospace',
            fontSize: '0.875rem'
          }}>
            {jsonLogicRepresentation ? (
              <JsonSyntaxHighlighter json={jsonLogicRepresentation} />
            ) : (
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.disabled' }}>
                No JSON Logic expression created yet.
              </Typography>
            )}
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Test Data
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                multiline
                rows={5}
                variant="outlined"
                value={testData}
                onChange={(e) => onTestDataChange(e.target.value)}
                placeholder={'"age": 25,\n"name": "John",\n"active": true'}
                InputProps={{
                  sx: { 
                    fontFamily: '"Roboto Mono", monospace', 
                    fontSize: '0.875rem',
                    pl: 3,
                    pr: 3
                  }
                }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  position: 'absolute', 
                  top: 10, 
                  left: 12, 
                  color: 'text.disabled'
                }}
              >
                {"{"}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  position: 'absolute', 
                  bottom: 10, 
                  right: 12, 
                  color: 'text.disabled'
                }}
              >
                {"}"}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ p: 2 }}>
            <Button 
              fullWidth
              variant="contained" 
              color="primary" 
              onClick={onRunTest}
              disabled={!jsonLogicRepresentation}
              startIcon={<PlayArrowIcon />}
            >
              Run Test
            </Button>
          </Box>
          
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Result
            </Typography>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                bgcolor: 'background.default', 
                fontFamily: '"Roboto Mono", monospace',
                fontSize: '0.875rem',
                color: getResultColor()
              }}
            >
              {testResult !== undefined ? (
                JSON.stringify(testResult, null, 2)
              ) : (
                <Typography 
                  variant="body2" 
                  sx={{ fontStyle: 'italic', color: 'text.disabled' }}
                >
                  Run the test to see the result
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>
      )}
    </Box>
  );
}
