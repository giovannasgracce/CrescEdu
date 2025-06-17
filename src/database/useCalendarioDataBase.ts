import { useSQLiteContext } from 'expo-sqlite';

export type CalendarioDataBase = {
  id: number;
  data: string;
  titulo: string;
  descricao: string;
  prioridade: string;
};

export function useCalendarioDataBase() {
  const dataBase = useSQLiteContext();

  async function criar(data: Omit<CalendarioDataBase, "id">) {
    const statement = await dataBase.prepareAsync(
      "INSERT INTO calendario(data, titulo, descricao, prioridade) VALUES ($data, $titulo, $descricao, $prioridade)"
    );

    try {
      const result = await statement.executeAsync({
        $data: data.data,
        $titulo: data.titulo,
        $descricao: data.descricao,
        $prioridade: data.prioridade,
      });

      const insertedRowId = result.lastInsertRowId.toString();
      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function analisar(data:string){
    try{
        const query = "select * from calendario where data like ?"//Interrogação: Substituir por qualquer item de busca
        const response = await dataBase.getAllAsync<CalendarioDataBase>(query,`%${data}%`)
        return response
    }catch(error){
        throw error
    }
}//fim do consultar

async function alterar(data: CalendarioDataBase){
    const statement = await dataBase.prepareAsync(
        "update calendario set data = $data, titulo = $titulo, descricao = $descricao, prioridade =$prioridade where id = $id"
    )

    try{
        await statement.executeAsync({
            $id: data.id,
            $data: data.data,
            $titulo: data.titulo,
            $descricao: data.descricao,
            $prioridade: data.prioridade
        })
    }catch(error){
        throw error
    }finally{
        await statement.finalizeAsync()
    }
}//fim do atualizar

async function apagar(id:number){
    try{
        await dataBase.execAsync("Delete from calendario where id = " + id)
    }catch(error){
        throw(error)
    }
}//fim do remover

  return { criar,analisar, apagar, alterar };
}
