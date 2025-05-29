export type LogInDto = {
  email: string;
  password: string;
};

export type TokenDto = {
  name: string;
  email: string;
  roles: string[];
  token: string;
  creationDate: number;
  expirationDate: number;
};
