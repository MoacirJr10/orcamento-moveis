@RestController
@RequestMapping("/api/orcamentos")
@CrossOrigin(origins = "*")
public class OrcamentoController {
    private final OrcamentoRepository repository;

    public OrcamentoController(OrcamentoRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Orcamento salvar(@RequestBody Orcamento orcamento) {
        orcamento.getItens().forEach(item -> item.setOrcamento(orcamento));
        double total = orcamento.getItens().stream().mapToDouble(ItemOrcamento::getPreco).sum();
        orcamento.setValorTotal(total);
        return repository.save(orcamento);
    }

    @GetMapping
    public List<Orcamento> listar() {
        return repository.findAll();
    }


    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> gerarPdf(@PathVariable Long id) throws Exception {

    }
}
