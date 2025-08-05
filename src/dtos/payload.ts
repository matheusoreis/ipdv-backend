export type PayloadDto = {
  sub: number;
  email: string;
  roleId: number;
  iat?: number;
  exp?: number;
};
