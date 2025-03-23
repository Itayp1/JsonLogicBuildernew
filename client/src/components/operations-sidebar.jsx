import { useDrag } from "react-dnd";
import { 
  logicalOperations, 
  comparisonOperations, 
  arithmeticOperations, 
  dataAccessOperations, 
  arrayOperations, 
  literalOperations 
} from "@/data/operations";
import { 
  Box, 
  Typography, 
  TextField, 
  InputAdornment,
  Paper,
  Divider
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CodeIcon from '@mui/icons-material/Code';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CalculateIcon from '@mui/icons-material/Calculate';
import StorageIcon from '@mui/icons-material/Storage';
import ListIcon from '@mui/icons-material/List';
import TextFieldsIcon from '@mui/icons-material/TextFields';

// Map operation types to icons
const typeToIcon = {
  logical: <CodeIcon />,
  comparison: <CompareArrowsIcon />,
  arithmetic: <CalculateIcon />,
  accessor: <StorageIcon />,
  array: <ListIcon />,
  literal: <TextFieldsIcon />
};

// Map operation types to colors
const typeToColor = {
  logical: "#2196f3",     // blue
  comparison: "#9c27b0",  // purple
  arithmetic: "#e91e63",  // pink
  accessor: "#4caf50",    // green
  array: "#ff9800",       // amber
  literal: "#757575"      // gray
};

function OperationItem({ operation, onDragStart }) {
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
    return typeToColor[operation.type] || "#e0e0e0";
  };

  const getIcon = () => {
    return typeToIcon[operation.type] || <CodeIcon />;
  };

  return (
    <Paper
      ref={drag}
      elevation={1}
      sx={{
        p: 1.5,
        mb: 1,
        borderLeft: 3,
        borderColor: getBorderColor(),
        borderRadius: 1,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        '&:hover': {
          boxShadow: 2
        }
      }}
      data-operation={operation.name}
      data-type={operation.type}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Box 
          sx={{ 
            width: 32, 
            height: 32, 
            borderRadius: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: `${getBorderColor()}20`,
            color: getBorderColor(),
            mr: 1.5
          }}
        >
          {getIcon()}
        </Box>
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {operation.displayName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {operation.description}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

function OperationGroup({ title, operations, searchTerm, onDragStart }) {
  const filteredOperations = operations.filter(op => 
    op.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredOperations.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography 
        variant="caption" 
        sx={{ 
          px: 1, 
          py: 0.5, 
          fontWeight: 600,
          color: 'text.secondary', 
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          display: 'block'
        }}
      >
        {title}
      </Typography>
      <Box sx={{ mt: 1 }}>
        {filteredOperations.map((operation) => (
          <OperationItem 
            key={operation.name} 
            operation={operation} 
            onDragStart={onDragStart} 
          />
        ))}
      </Box>
    </Box>
  );
}

export default function OperationsSidebar({ onDragStart, searchTerm, onSearchChange }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
          Operations
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Search operations..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1 }}
        />
      </Box>

      <Divider />

      <Box sx={{ p: 2, overflow: 'auto', flexGrow: 1 }}>
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
      </Box>
    </Box>
  );
}