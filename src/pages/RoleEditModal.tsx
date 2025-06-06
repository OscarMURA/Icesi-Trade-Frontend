import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
  Chip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { RoleDto } from '../types/userTypes';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (selectedRoleIds: number[]) => void;
  allRoles: RoleDto[];
  initialSelected: string[]; // Ej: ['ROLE_USER']
}

export default function RoleEditModal({
  open,
  onClose,
  onSave,
  allRoles,
  initialSelected,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setSelected(initialSelected);
  }, [initialSelected]);

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSelected(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = () => {
    const selectedIds = allRoles
      .filter((r) => selected.includes(r.name))
      .map((r) => r.id);
    onSave(selectedIds);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar roles</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Roles</InputLabel>
          <Select
            multiple
            value={selected}
            onChange={handleChange}
            input={<OutlinedInput label="Roles" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value.replace('ROLE_', '')} />
                ))}
              </Box>
            )}
          >
            {allRoles.map((r) => (
              <MenuItem key={r.id} value={r.name}>
                {r.name.replace('ROLE_', '')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}