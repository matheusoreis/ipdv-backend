import postgres from "../database/connectors/pg";
import { UserEntity } from "../database/entities/user.entity";
import { UpdateUserDto } from "../dtos/user.dto";
import { BadRequestError } from "../errors/bad-request";
import { NotFoundError } from "../errors/not-found";
import { capitalizeAll } from "../utils/capitalize";
import { isValidEmail } from "../utils/valid-email";
import { isValidName } from "../utils/valid-name";

export class UserService {
  public async getAll(): Promise<UserEntity[]> {
    const query = `
    SELECT u.*, r.name AS "roleName"
    FROM users u
    LEFT JOIN roles r ON u."roleId" = r.id
    ORDER BY u.id ASC
  `;
    const result = await postgres.raw(query);
    return result.rows;
  }

  public async getById(id: number): Promise<UserEntity> {
    const query = `
      SELECT u.*, r.name
      FROM users u
      LEFT JOIN roles r ON u."roleId" = r.id
      WHERE u.id = ?
      LIMIT 1
    `;
    const result = await postgres.raw(query, [id]);
    const user = result.rows[0];

    if (!user) {
      throw new NotFoundError(`Usuário com ID ${id} não encontrado.`);
    }

    return user;
  }

  public async update(id: number, data: UpdateUserDto): Promise<UserEntity> {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(
        "Nenhum dado informado para atualizar o usuário."
      );
    }

    const user = await this.getById(id);

    let updatedName =
      typeof data.name === "string" && data.name.trim() !== ""
        ? data.name
        : user.name;

    let updatedEmail =
      typeof data.email === "string" && data.email.trim() !== ""
        ? data.email
        : user.email;

    let updatedRoleId = data.roleId === undefined ? user.roleId : data.roleId;

    let updatedIsActive =
      typeof data.isActive === "boolean" ? data.isActive : user.isActive;

    if (
      data.roleId !== undefined &&
      data.roleId !== null &&
      data.roleId !== user.roleId
    ) {
      const roleExistsQuery = `SELECT 1 FROM roles WHERE id = ? LIMIT 1`;
      const roleCheck = await postgres.raw(roleExistsQuery, [data.roleId]);
      if (roleCheck.rows.length === 0) {
        throw new BadRequestError(`Cargo com ID ${data.roleId} não existe.`);
      }
    }

    if (data.name && !isValidName(updatedName)) {
      throw new BadRequestError(
        "O nome informado não está válido, informe o nome completo."
      );
    }

    if (data.email && !isValidEmail(updatedEmail)) {
      throw new BadRequestError("O email informado não está válido.");
    }

    if (data.email) {
      const checkEmailQuery = `
        SELECT id FROM users WHERE LOWER(email) = LOWER(?) AND id <> ? LIMIT 1
      `;

      const emailExists = await postgres.raw(checkEmailQuery, [
        updatedEmail,
        id,
      ]);

      if (emailExists.rows.length > 0) {
        throw new BadRequestError("Já existe um usuário com este email.");
      }
    }

    updatedName = capitalizeAll(updatedName);
    updatedEmail = updatedEmail.toLowerCase();

    const query = `
      UPDATE users
      SET name = ?, email = ?, "roleId" = ?, "isActive" = ?, "updatedAt" = NOW()
      WHERE id = ?
      RETURNING *;
    `;

    const result = await postgres.raw(query, [
      updatedName,
      updatedEmail,
      updatedRoleId,
      updatedIsActive,
      id,
    ]);

    return result.rows[0];
  }
}
