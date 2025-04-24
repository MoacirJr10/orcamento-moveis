export interface Item {
  nome: string;
  largura: number;
  altura: number;
  profundidade: number;
  preco: number;
}

export interface Orcamento {
id?: number;
cliente: string;
descricao: string;
valorTotal?: number;
itens: Item[];
}
