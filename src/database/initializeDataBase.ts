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
    `)
}