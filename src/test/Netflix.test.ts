// Netflix.test.ts
import Netflix from '../model/Netflix';
import { DatabaseModel } from '../model/DatabaseModel';

// Mock do DatabaseModel para garantir que o `query` possa ser mockado corretamente
jest.mock('./DatabaseModel', () => {
  return {
    DatabaseModel: jest.fn().mockImplementation(() => {
      return {
        pool: {
          query: jest.fn(), // Aqui garantimos que `query` seja uma função mock
        },
      };
    }),
  };
});

const mockedDatabase = new DatabaseModel().pool;

describe('Netflix class', () => {
  
  describe('listarNetflixTitles', () => {
    it('deve listar os títulos da Netflix com sucesso', async () => {
      const mockQueryReturn = {
        rows: [
          {
            show_id: 's1',
            tipo: 'Movie',
            titulo: 'Dick Johnson Is Dead',
            diretor: 'Kirsten Johnson',
            elenco: null,
            pais: 'United States',
            adicionado: 'September 25, 2021',
            ano_lancamento: 2020,
            classificacao: 'PG-13',
            duracao: '90 min',
            listado_em: 'Documentaries',
            descricao: 'As her father nears the end of his life, filmmaker Kirsten Johnson stages his death in inventive and comical ways to help them both face the inevitable.',
          },
        ],
      };

      // Mockando o retorno de `query` com sucesso
      (mockedDatabase.query as jest.Mock).mockResolvedValueOnce(mockQueryReturn);

      const result = await Netflix.listarNetflixTitles();
      expect(result).toEqual(mockQueryReturn.rows);
    });

    it('deve retornar uma mensagem de erro quando houver falha', async () => {
      // Mockando uma rejeição de erro
      (mockedDatabase.query as jest.Mock).mockRejectedValueOnce(new Error('Erro de banco de dados'));

      const result = await Netflix.listarNetflixTitles();
      expect(result).toBe('error, verifique os logs do servidor');
    });
  });

  describe('removerNetflixTitle', () => {
    it('deve remover um título da Netflix com sucesso e retornar true', async () => {
      const mockDeleteResult = { rowCount: 1 };

      // Mockando o sucesso na remoção de título
      (mockedDatabase.query as jest.Mock).mockResolvedValueOnce(mockDeleteResult);

      const result = await Netflix.removerNetflixTitle('s1');
      expect(result).toBe(true);
    });

    it('deve retornar false se o título não for encontrado', async () => {
      const mockDeleteResult = { rowCount: 0 };

      // Mockando um cenário onde o título não foi encontrado
      (mockedDatabase.query as jest.Mock).mockResolvedValueOnce(mockDeleteResult);

      const result = await Netflix.removerNetflixTitle('inexistente');
      expect(result).toBe(false);
    });

    it('deve retornar false em caso de erro', async () => {
      // Mockando um erro no banco de dados
      (mockedDatabase.query as jest.Mock).mockRejectedValueOnce(new Error('Erro ao deletar'));

      const result = await Netflix.removerNetflixTitle('s1');
      expect(result).toBe(false);
    });
  });
});
