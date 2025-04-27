export type StatusOrcamento = 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'EM_ANDAMENTO' | 'CONCLUIDO';

export interface OrcamentoItem {
  id?: number;
descricao: string;
quantidade: number;
valorUnitario: number;
valorTotal?: number;
observacaoItem?: string;
unidadeMedida?: string;
codigoProduto?: string;
}

export interface Orcamento {
id?: number;
nomeCliente: string;
data: Date;
valorTotal: number;
itens?: OrcamentoItem[];
observacoes?: string;
status?: StatusOrcamento;
dataCriacao?: Date;
dataAtualizacao?: Date;
contato?: ContatoCliente;
prazoEntrega?: number; // em dias
formaPagamento?: string;
desconto?: number;
valorFinal?: number;
}


export interface ContatoCliente {
telefone?: string;
email?: string;
endereco?: string;
}


export class OrcamentoUtils {

static calcularValorTotalItem(item: OrcamentoItem): number {
    return item.quantidade * item.valorUnitario;
  }

  /**
   * Calcula o valor total do orçamento com base nos itens
   */
  static calcularValorTotalOrcamento(itens: OrcamentoItem[]): number {
    return itens.reduce((total, item) => total + this.calcularValorTotalItem(item), 0);
  }

  /**
   * Calcula o valor final do orçamento aplicando desconto
   */
  static calcularValorFinal(valorTotal: number, desconto: number = 0): number {
    return valorTotal - desconto;
  }

  /**
   * Cria um novo orçamento vazio com valores padrão
   */
  static criarOrcamentoVazio(): Orcamento {
    return {
      nomeCliente: '',
      data: new Date(),
      valorTotal: 0,
      itens: [],
      status: 'PENDENTE',
      dataCriacao: new Date(),
      desconto: 0,
      valorFinal: 0
    };
  }
}
