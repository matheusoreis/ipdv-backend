import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("roles").del();

  await knex("roles").insert([
    {
      id: 1,
      name: "Administrador",
      description:
        "Controle total do sistema, acesso a todas as funcionalidades e configurações.",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: 2,
      name: "Gerente",
      description: "Gerencia equipes, projetos ou departamentos.",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: 3,
      name: "Usuário Comum",
      description:
        "Acesso básico para utilizar as funcionalidades padrão do sistema.",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: 4,
      name: "Supervisor",
      description:
        "Supervisiona operações e pode aprovar ou revisar tarefas e relatórios.",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: 5,
      name: "Financeiro",
      description:
        "Acesso a informações financeiras e relatórios relacionados.",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: 6,
      name: "Suporte Técnico",
      description:
        "Responsável por atendimento ao usuário, suporte e resolução de problemas.",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: 7,
      name: "Convidado",
      description:
        "Acesso limitado, somente para visualização ou funções restritas.",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
  ]);
}
