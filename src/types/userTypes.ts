export type UserResponseDto = {
    id: number;
    email: string;
    password: string; 
    name: string;
    phone: string;
}

export type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  roles: string[];
};

export type RoleDto = {
  id: number;
  name: string; 
};