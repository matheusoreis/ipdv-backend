import postgres from "../database/connectors/pg";
import { RoleEntity } from "../database/entities/role.entity";
import { CreateRoleDto, UpdateRoleDto } from "../dtos/role.dto";
import { BadRequestError } from "../errors/bad-request";
import { NotFoundError } from "../errors/not-found";
import { capitalizeAll } from "../utils/capitalize";

export class RoleService {
  public async getAll(): Promise<RoleEntity[]> {
    const query = `SELECT * FROM roles ORDER BY id ASC`;
    const result = await postgres.raw<{ rows: RoleEntity[] }>(query);
    return result.rows;
  }

  public async getById(id: number): Promise<RoleEntity> {
    const query = `SELECT * FROM roles WHERE id = ? LIMIT 1`;
    const result = await postgres.raw<{ rows: RoleEntity[] }>(query, [id]);
    const role = result.rows[0];

    if (!role) {
      throw new NotFoundError(`Cargo com ID ${id} não encontrado.`);
    }

    return role;
  }

  public async create(data: CreateRoleDto): Promise<RoleEntity> {
    if (!data) {
      throw new BadRequestError("Nenhum dado informado para criar o cargo.");
    }

    if (!data.name) {
      throw new BadRequestError("O nome do cargo deve ser informado.");
    }

    if (!data.description) {
      throw new BadRequestError("A descrição deve ser informada.");
    }

    const { name, description } = data;

    if (!name || name.trim().length < 3) {
      throw new BadRequestError(
        "O nome do cargo deve ter pelo menos 3 caracteres."
      );
    }

    const checkQuery = `SELECT * FROM roles WHERE LOWER(name) = LOWER(?) LIMIT 1`;
    const checkResult = await postgres.raw<{ rows: RoleEntity[] }>(checkQuery, [
      name,
    ]);
    if (checkResult.rows.length > 0) {
      throw new BadRequestError("Já existe um cargo com este nome.");
    }

    const capitalizedName = capitalizeAll(name);

    const insertQuery = `
      INSERT INTO roles (name, description, "createdAt", "updatedAt")
      VALUES (?, ?, NOW(), NOW())
      RETURNING *;
    `;

    const insertResult = await postgres.raw<{ rows: RoleEntity[] }>(
      insertQuery,
      [capitalizedName, description ?? null]
    );

    return insertResult.rows[0];
  }

  public async update(id: number, data: UpdateRoleDto): Promise<RoleEntity> {
    if (!data) {
      throw new BadRequestError(
        "Nenhum dado informado para atualizar o cargo."
      );
    }

    const role = await this.getById(id);

    let updatedName = data.name ? capitalizeAll(data.name) : role.name;
    let updatedDescription =
      data.description !== undefined ? data.description : role.description;

    if (
      data.name &&
      data.name.trim().length >= 3 &&
      updatedName.toLowerCase() !== role.name.toLowerCase()
    ) {
      const checkQuery = `SELECT * FROM roles WHERE LOWER(name) = LOWER(?) AND id <> ? LIMIT 1`;

      const checkResult = await postgres.raw<{ rows: RoleEntity[] }>(
        checkQuery,
        [updatedName, id]
      );

      if (checkResult.rows.length > 0) {
        throw new BadRequestError("Já existe outro cargo com este nome.");
      }
    }

    const updateQuery = `
      UPDATE roles
      SET name = ?, description = ?, "updatedAt" = NOW()
      WHERE id = ?
      RETURNING *;
    `;

    const updateResult = await postgres.raw<{ rows: RoleEntity[] }>(
      updateQuery,
      [updatedName, updatedDescription, id]
    );

    return updateResult.rows[0];
  }

  public async delete(id: number): Promise<void> {
    await this.getById(id);
    await postgres.raw(`DELETE FROM roles WHERE id = ?`, [id]);
  }
}
