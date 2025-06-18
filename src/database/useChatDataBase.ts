import { useSQLiteContext } from "expo-sqlite";

export type ChatMessage = {
  id: number;
  remetente: string;
  destinatario: string;
  mensagem: string;
  dataHora: string;
};

export function useChatDataBase() {
  const db = useSQLiteContext();

  async function enviarMensagem(data: Omit<ChatMessage, "id">) {
    const statement = await db.prepareAsync(
      "INSERT INTO chat (remetente, destinatario, mensagem, dataHora) VALUES (?, ?, ?, ?)"
    );
    try {
      await statement.executeAsync([
        data.remetente,
        data.destinatario,
        data.mensagem,
        data.dataHora,
      ]);
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function buscarMensagens(usuarioAtual: string, contato: string) {
    const query = `
      SELECT * FROM chat
      WHERE (remetente = ? AND destinatario = ?)
         OR (remetente = ? AND destinatario = ?)
      ORDER BY dataHora ASC
    `;
  
    const mensagens = await db.getAllAsync(query, [usuarioAtual, contato, contato, usuarioAtual]);
    return mensagens;
  }

  async function listarConversas(usuario: string) {
    const query = `
      SELECT destinatario AS contato FROM chat WHERE remetente = ?
      UNION
      SELECT remetente AS contato FROM chat WHERE destinatario = ?
    `;
    return await db.getAllAsync<{ contato: string }>(query, usuario, usuario);
  }

  async function listarUsuarios() {
    try {
      const resultado = await db.getAllAsync<{ email: string }>(
        "SELECT DISTINCT email FROM pessoas"
      );
      return resultado.map((user) => user.email);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return [];
    }
  }
  
  
  
  return {enviarMensagem,buscarMensagens,listarConversas,listarUsuarios};
}
