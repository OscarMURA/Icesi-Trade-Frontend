export type LogInDto = {
  email: string;
  password: string;
};

export type TokenDto = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  token: string;
  creationDate: number;
  expirationDate: number;
};

export type RegisterDto = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}