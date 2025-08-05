import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("roles", (table) => {
    table.increments("id").primary();
    table.string("name", 100).notNullable().unique();
    table.text("description").nullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updatedAt").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("roles");
}
