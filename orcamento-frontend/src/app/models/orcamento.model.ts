export interface Orcamento {
  id?: number;
nomeCliente: string;
data: Date;
valorTotal: number;
itens?: OrcamentoItem[];
observacoes?: string;
status?: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
}

export interface OrcamentoItem {
id?: number;
descricao: string;
quantidade: number;
valorUnitario: number;
valorTotal?: number;
}
