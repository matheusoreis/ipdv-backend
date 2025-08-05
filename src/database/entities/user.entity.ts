export type UserEntity = {
  id: number;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  roleId?: number;
  createdAt?: Date;
  updatedAt?: Date;
};
