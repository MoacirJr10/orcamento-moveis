export interface Orcamento {
  id?: number;
cliente: string;
dataCriacao?: string;
valorTotal?: number;
itens: ItemOrcamento[];
}

export interface ItemOrcamento {
id?: number;
descricao: string;
preco: number;
quantidade: number;
}
