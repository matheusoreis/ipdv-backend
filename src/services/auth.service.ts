import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { isError } from "../utils/valid-error";
import { BadRequestError } from "../errors/bad-request";
import { SignInDto, SignUpDto } from "../dtos/auth.dto";
import postgres from "../database/connectors/pg";
import { UserEntity } from "../database/entities/user.entity";
import { NotFoundError } from "../errors/not-found";
import { UnauthorizedError } from "../errors/unauthorized";
import { isValidEmail } from "../utils/valid-email";
import { isValidPassword } from "../utils/valid-password";
import { isValidName } from "../utils/valid-name";
import { capitalizeAll } from "../utils/capitalize";

export class AuthService {
  private JWT_SECRET = process.env.JWT_SECRET ?? "default_secret";
  private JWT_EXPIRES_IN = "60m";

  private verifyToken(token: string) {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      if (!isError(error)) {
        throw new BadRequestError(
          `Erro desconhecido ao verificar o token de acesso.`
        );
      }
    }
  }

  public async signIn(data: SignInDto) {
    const { email, password } = data;

    const query = "SELECT * FROM users WHERE email = ? LIMIT 1";
    const result = await postgres.raw<{ rows: UserEntity[] }>(query, [email]);
    const user = result.rows[0];

    if (!user) {
      throw new NotFoundError("Usuário não encontrado!");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("Usuário está desativado!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Senha informada está incorreta!");
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        roleId: user.roleId,
      },
      this.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...userWithoutPassword } = user;
    return {
      token,
      user: userWithoutPassword,
    };
  }

  public async signUp(data: SignUpDto) {
    const { name, email, password } = data;

    if (!isValidName(name)) {
      throw new BadRequestError(
        "O nome informado não está válido, informe o seu nome completo"
      );
    }

    if (!isValidEmail(email)) {
      throw new BadRequestError("O email informado não está válido.");
    }

    if (!isValidPassword(password)) {
      throw new BadRequestError(
        "A senha informada não está válida, é necessário ao menos uma letra maiúscula e um número."
      );
    }

    const checkQuery = "SELECT * FROM users WHERE email = ? LIMIT 1";
    const checkResult = await postgres.raw<{ rows: UserEntity[] }>(checkQuery, [
      email,
    ]);
    if (checkResult.rows.length > 0) {
      throw new BadRequestError("Email já cadastrado.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (name, email, password, "isActive", "createdAt", "updatedAt")
      VALUES (?, ?, ?, true, NOW(), NOW())
      RETURNING *;
    `;

    const capitalizedName = capitalizeAll(name);
    const lowerEmail = email.toLowerCase();
    const insertResult = await postgres.raw<{ rows: UserEntity[] }>(
      insertQuery,
      [capitalizedName, lowerEmail, hashedPassword]
    );

    const createdUser = insertResult.rows[0];

    const { password: _, ...userWithoutPassword } = createdUser;
    return userWithoutPassword;
  }
}
