import postgres from "../database/connectors/pg";
import { RoleEntity } from "../database/entities/role.entity";
import { CreateRoleDto, UpdateRoleDto } from "../dtos/role.dto";
import { BadRequestError } from "../errors/bad-request";
import { NotFoundError } from "../errors/not-found";

export class RoleService {
  public async getAll(): Promise<RoleEntity[]> {
    const query = `SELECT * FROM roles ORDER BY id ASC`;
    const result = await postgres.raw(query);

    return result.rows;
  }

  public async getById(id: number): Promise<RoleEntity> {
    const query = `SELECT * FROM roles WHERE id = ? LIMIT 1`;
    const result = await postgres.raw(query, [id]);
    const role = result.rows[0];

    if (!role) {
      throw new NotFoundError(`Cargo com ID ${id} não encontrado.`);
    }

    return role;
  }

  public async create(data: CreateRoleDto): Promise<RoleEntity> {
    if (!data.name || data.name.trim().length < 3) {
      throw new BadRequestError(
        "O nome informado deve ter pelo menos 3 caracteres."
      );
    }

    const query = `
      INSERT INTO roles (name, description, "createdAt", "updatedAt")
      VALUES (?, ?, NOW(), NOW())
      RETURNING *;
    `;

    const result = await postgres.raw(query, [data.name, data.description]);

    return result.rows[0];
  }

  public async update(id: number, data: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.getById(id);

    const updatedName = data.name ?? role.name;
    const updatedDescription = data.description ?? role.description;

    const query = `
      UPDATE roles
      SET name = ?, description = ?, "updatedAt" = NOW()
      WHERE id = ?
      RETURNING *;
    `;

    const result = await postgres.raw(query, [
      updatedName,
      updatedDescription,
      id,
    ]);

    return result.rows[0];
  }

  public async delete(id: number): Promise<void> {
    await this.getById(id);
    await postgres.raw(`DELETE FROM roles WHERE id = ?`, [id]);
  }
}
