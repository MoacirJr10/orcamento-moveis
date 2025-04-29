export interface ItemOrcamento {
  id?: number;
nome: string;
descricao?: string;
material?: string;
largura?: number;
altura?: number;
profundidade?: number;
preco?: number;
quantidade: number;
cor?: string;
acabamento?: string;
valorTotal?: number;
}

export interface Orcamento {
id?: number;
cliente: string;
descricao?: string;
valorTotal?: number;
itens: ItemOrcamento[];
}
