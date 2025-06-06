import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import {
  getAllUsers,
  deleteUser,
  getAllRoles,
  updateUserRoles,
} from '../api/adminApi';
import { User as AdminUser } from '../types/userTypes';
import { RoleDto } from '../types/userTypes';
import RoleEditModal from './RoleEditModal';

export default function AdminUserPanel() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    const [userData, roleData] = await Promise.all([
      getAllUsers(),
      getAllRoles(),
    ]);
    setUsers(userData);
    setRoles(roleData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    fetchData();
  };

  const openEditModal = (user: AdminUser) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleRolesSave = async (roleIds: number[]) => {
    if (selectedUser) {
      await updateUserRoles(selectedUser.id, roleIds);
      fetchData();
      closeModal();
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4} fontWeight={700}>
        Panel de Administración
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone || '-'}</TableCell>
                <TableCell>
                  {Array.isArray(u.roles)
                    ? u.roles.map((r) => r.replace('ROLE_', '')).join(', ')
                    : 'Sin rol'}
                </TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => openEditModal(u)}>
                    Editar roles
                  </Button>
                  <IconButton onClick={() => handleDelete(u.id)}>
                    <Trash2 size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedUser && (
        <RoleEditModal
          open={modalOpen}
          onClose={closeModal}
          onSave={handleRolesSave}
          allRoles={roles}
          initialSelected={selectedUser.roles || []}
        />
      )}
    </Box>
  );
}