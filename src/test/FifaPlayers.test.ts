// FifaPlayers.test.ts
import FifaPlayers from '../model/FifaPlayers';
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

describe('FifaPlayers class', () => {
  
  describe('listarPlayersCards', () => {
    it('deve listar os players cards com sucesso', async () => {
      const mockQueryReturn = {
        rows: [
          {
            playerid: 1,
            playername: 'Pelé',
            foot: 'Right',
            playerposition: 'CAM',
            awr: 'High',
            dwr: 'Med',
            ovr: '98',
            pac: '95',
            sho: '96',
            pas: '93',
            dri: '96',
            def: '60',
            phy: '76',
            sm: '5',
            div: 'NA',
            pos: 'NA',
            han: 'NA',
            reff: 'NA',
            kic: 'NA',
            spd: 'NA',
          },
        ],
      };

      // Mockando o retorno de `query` com sucesso
      (mockedDatabase.query as jest.Mock).mockResolvedValueOnce(mockQueryReturn);

      const result = await FifaPlayers.listarPlayersCards();
      expect(result).toEqual(mockQueryReturn.rows);
    });

    it('deve retornar uma mensagem de erro quando houver falha', async () => {
      // Mockando uma rejeição de erro
      (mockedDatabase.query as jest.Mock).mockRejectedValueOnce(new Error('Erro de banco de dados'));

      const result = await FifaPlayers.listarPlayersCards();
      expect(result).toBe('error, verifique os logs do servidor');
    });
  });

  describe('removerPlayerCard', () => {
    it('deve remover um player card com sucesso e retornar true', async () => {
      const mockDeleteResult = { rowCount: 1 };

      // Mockando o sucesso na remoção do player card
      (mockedDatabase.query as jest.Mock).mockResolvedValueOnce(mockDeleteResult);

      const result = await FifaPlayers.removerPlayerCard(1);
      expect(result).toBe(true);
    });

    it('deve retornar false se o player card não for encontrado', async () => {
      const mockDeleteResult = { rowCount: 0 };

      // Mockando um cenário onde o player card não foi encontrado
      (mockedDatabase.query as jest.Mock).mockResolvedValueOnce(mockDeleteResult);

      const result = await FifaPlayers.removerPlayerCard(999);
      expect(result).toBe(false);
    });

    it('deve retornar false em caso de erro', async () => {
      // Mockando um erro no banco de dados
      (mockedDatabase.query as jest.Mock).mockRejectedValueOnce(new Error('Erro ao deletar'));

      const result = await FifaPlayers.removerPlayerCard(1);
      expect(result).toBe(false);
    });
  });
});
