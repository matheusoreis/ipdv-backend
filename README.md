# Backend IPDV

API construída com **Node.js**, **Express** e **PostgreSQL** com autenticação via **JWT**.

---

## Tecnologias

- Node.js + Express
- PostgreSQL
- JWT
- Knex.js
- TypeScript

---

### Clonar o repositório

```bash
git clone https://github.com/matheusoreis/ipdv-backend
cd ipdv-backend
```

### Instalar as dependências

```bash
npm install
```

### Configurar .env

```bash
DB_HOST = 127.0.0.1
DB_PORT = 5432

DB_USER = postgres
DB_PASS = postgres
DB_NAME = postgres
DB_SCHEMA = public
```

### Subir banco e rodar migrations

```bash
npm run db:up # Subir o banco e as migrações
npm run db:seed:up # Subir os cargos padrões
```

### Iniciar servidor

```bash
npm run dev
npm run start
```

## Autenticação

### Acessar

```bash
curl  -X POST \
  'http://127.0.0.1:3001/api/auth/signin' \
  --header 'Accept: */*' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "email": "email@email.com",
  "password": "senha"
}'
```

### Cadastrar

```bash
curl  -X POST \
  'http://127.0.0.1:3001/api/auth/signup' \
  --header 'Accept: */*' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "name": "Nome Sobrenome",
  "email": "email@email.com",
  "password": "senha"
}'
```

## Cargos

### Todos

```bash
curl  -X GET \
  'http://127.0.0.1:3001/api/roles' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer token'
```

### Específico

```bash
curl  -X GET \
  'http://127.0.0.1:3001/api/roles/1' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer token'
```

### Atualizar

```bash
curl  -X PATCH \
  'http://127.0.0.1:3001/api/roles/1' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer token' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "name": "Administrador"
}'
```

### Cadastrar

```bash
curl  -X POST \
  'http://127.0.0.1:3001/api/roles' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer token' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "name": "Novo Cargo",
  "description": "Descrição do cargo."
}'
```

### Apagar

```bash
curl  -X DELETE \
  'http://127.0.0.1:3001/api/roles/8' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer token'
```

## Usuário

### Todos

```bash
curl  -X GET \
  'http://127.0.0.1:3001/api/users/' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer token'
```

### Específico

```bash
curl  -X GET \
  'http://127.0.0.1:3001/api/users/1' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer token'
```

### Atualizar

```bash
curl  -X PATCH \
  'http://127.0.0.1:3001/api/users/1' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer token' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "roleId": null
} '
```
