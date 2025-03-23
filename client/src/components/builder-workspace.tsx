import { useState } from "react";
import { useDrop } from "react-dnd";
import { Operation, JsonLogicNode } from "@/types/json-logic";
import OperationNode from "@/components/ui/operation-node";
import { 
  Box, 
  Typography, 
  Button, 
  Stack,
  Divider 
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" fontWeight={500}>
          Builder Workspace
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button 
            variant="outlined" 
            size="small" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={onClear}
          >
            Clear
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            color="primary" 
            startIcon={<UndoIcon />}
            onClick={onUndo}
          >
            Undo
          </Button>
        </Stack>
      </Box>
      
      <Divider />
      
      <Box 
        ref={drop} 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: 3,
          bgcolor: isOver ? 'primary.50' : 'background.default',
          transition: 'background-color 0.2s'
        }}
      >
        {!expression ? (
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'text.disabled'
          }}>
            <AccountTreeIcon sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h6" fontWeight={500} sx={{ mb: 1 }}>
              Start Building Your Logic
            </Typography>
            <Typography variant="body2" textAlign="center" sx={{ maxWidth: 400, mb: 3 }}>
              Drag operations from the sidebar and drop them here to build your JSON Logic expression.
            </Typography>
          </Box>
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
      </Box>
    </Box>
  );
}
