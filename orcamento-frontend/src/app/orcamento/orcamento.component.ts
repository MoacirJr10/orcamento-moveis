@Component({ /* ... */ })
export class OrcamentoComponent {
orcamento: Orcamento = {
cliente: '',
descricao: '',
itens: []
};

constructor(private service: OrcamentoService) {}

  adicionarItem() {
    this.orcamento.itens.push({ nome: '', largura: 0, altura: 0, profundidade: 0, preco: 0 });
  }

  salvar() {
    this.service.salvar(this.orcamento).subscribe(res => {
      alert("Orçamento salvo!");
      this.orcamento = { cliente: '', descricao: '', itens: [] };
    });
  }

  gerarPdf(id: number) {
    window.open(`http://localhost:8080/api/orcamentos/${id}/pdf`, '_blank');
  }
}
