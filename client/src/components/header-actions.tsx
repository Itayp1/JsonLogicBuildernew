import { Button, Stack } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AddIcon from '@mui/icons-material/Add';

interface HeaderActionsProps {
  onImport: () => void;
  onExport: () => void;
  onNewExpression: () => void;
}

export default function HeaderActions({ onImport, onExport, onNewExpression }: HeaderActionsProps) {
  return (
    <Stack direction="row" spacing={1}>
      <Button 
        variant="outlined" 
        size="small" 
        color="inherit" 
        onClick={onImport}
        startIcon={<CloudUploadIcon />}
        sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
      >
        Import
      </Button>
      <Button 
        variant="outlined" 
        size="small" 
        color="inherit" 
        onClick={onExport}
        startIcon={<CloudDownloadIcon />}
        sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
      >
        Export
      </Button>
      <Button 
        variant="contained" 
        size="small" 
        color="secondary" 
        onClick={onNewExpression}
        startIcon={<AddIcon />}
      >
        New Expression
      </Button>
    </Stack>
  );
}
