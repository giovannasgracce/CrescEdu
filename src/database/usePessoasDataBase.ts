import { useSQLiteContext } from 'expo-sqlite';

export type PessoasDataBase = {
  id: number;
  cpf: string;
  nome: string;
  nomeSocial: string;
  dataNascimento: string;
  email: string;
  senha: string;
};

export function usePessoasDataBase() {
  const dataBase = useSQLiteContext();

  async function create(data: Omit<PessoasDataBase, "id">) {
    const statement = await dataBase.prepareAsync(
      "INSERT INTO pessoas(cpf, nome, nomeSocial, dataNascimento, email, senha) VALUES ($cpf, $nome, $nomeSocial, $dataNascimento, $email, $senha)"
    );

    try {
      const result = await statement.executeAsync({
        $cpf: data.cpf,
        $nome: data.nome,
        $nomeSocial: data.nomeSocial,
        $dataNascimento: data.dataNascimento,
        $email: data.email,
        $senha: data.senha,
      });

      const insertedRowId = result.lastInsertRowId.toString();
      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function consultar(busca: string) {
    try {
      const query = "SELECT * FROM pessoas WHERE nome LIKE ? OR cpf LIKE ?";
      const response = await dataBase.getAllAsync<PessoasDataBase>(
        query,
        `%${busca}%`,
        `%${busca}%`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function findByEmail(email: string): Promise<PessoasDataBase | undefined> {
    try {
      console.log("Buscando email:", email);

      const query = "SELECT * FROM pessoas WHERE email = ? LIMIT 1";
      const result = await dataBase.getFirstAsync<PessoasDataBase>(query, [email]);

      console.log("Resultado do banco:", result);
      return result ?? undefined;
    } catch (error) {
      console.error("Erro no findByEmail:", error);
      throw error;
    }
  }

  return { create, consultar, findByEmail };
}
