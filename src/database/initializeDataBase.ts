import { type SQLiteDatabase } from 'expo-sqlite';
export async function initializeDataBase(dataBase: SQLiteDatabase){
    await dataBase.execAsync(`
        CREATE TABLE IF NOT EXISTS pessoas (
            id integer primary key autoincrement,
            cpf text not null,
            nome text not null,
            nomeSocial text not null,
            dataNascimento text not null,
            email text not null,
            senha text not null
        );
    `);
    await dataBase.execAsync(`
    CREATE TABLE IF NOT EXISTS calendario (
      id integer primary key autoincrement,
      data text not null,
      titulo text not null,
      descricao text not null,
      prioridade text not null
    );
  `);
    await dataBase.execAsync(`
      CREATE TABLE IF NOT EXISTS chat (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        remetente TEXT NOT NULL,
        destinatario TEXT NOT NULL,
        mensagem TEXT NOT NULL,
        dataHora TEXT NOT NULL
      );
    `);
}