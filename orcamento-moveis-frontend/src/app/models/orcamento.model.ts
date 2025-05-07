export interface Orcamento {
  id?: number;
cliente: string;
descricao?: string;
dataCriacao?: Date | string;
valorTotal?: number;
status?: string;
telefone?: string;
email?: string;
observacoes?: string;
formaPagamento?: string;
prazoEntregaDias?: number;
itens: ItemOrcamento[];
}

export interface ItemOrcamento {
id?: number;
nome: string;
descricao?: string;
material?: string;
tipoMovel?: string;
largura?: number;
altura?: number;
profundidade?: number;
preco: number;
quantidade: number;
cor?: string;
acabamento?: string;
observacoes?: string;
}

// Interface para resposta paginada
export interface OrcamentoPaginado {
content: Orcamento[];
totalElements: number;
totalPages: number;
size: number;
number: number;
first: boolean;
last: boolean;
}

// Tipo para filtros de busca
export interface OrcamentoFiltro {
page?: number;
size?: number;
sort?: string;
search?: string;
status?: string;
dataInicio?: string;
dataFim?: string;
}

// Enum para status
export enum StatusOrcamento {
PENDENTE = 'Pendente',
APROVADO = 'Aprovado',
CANCELADO = 'Cancelado',
FINALIZADO = 'Finalizado'
}

// Enum para formas de pagamento
export enum FormaPagamento {
DINHEIRO = 'Dinheiro',
CARTAO_CREDITO = 'Cartão de Crédito',
CARTAO_DEBITO = 'Cartão de Débito',
PIX = 'PIX',
BOLETO = 'Boleto',
FINANCIAMENTO = 'Financiamento'
}
