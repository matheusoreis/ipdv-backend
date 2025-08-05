import dotenv from "dotenv";
import { bootstrap } from "./src/bootstrap";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
  const app = bootstrap();

  app.listen(PORT, () => {
    console.log(`Servidor HTTP IPDV iniciado com sucesso na porta: ${PORT}`);
  });
}

start();
