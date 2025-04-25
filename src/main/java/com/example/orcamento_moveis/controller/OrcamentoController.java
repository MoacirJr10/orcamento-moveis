package com.example.orcamento_moveis.controller;

import com.example.orcamento_moveis.repository.OrcamentoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orcamentos")
@CrossOrigin(origins = "*")
public class OrcamentoController {
    private final OrcamentoRepository repository;

    public OrcamentoController(OrcamentoRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public com.example.orcamento_moveis.model.Orcamento salvar(@RequestBody com.example.orcamento_moveis.model.Orcamento orcamento) {
        orcamento.getItens().forEach(item -> item.setOrcamento(orcamento));
        double total = orcamento.getItens().stream().mapToDouble(com.example.orcamento_moveis.model.ItemOrcamento::getPreco).sum();
        orcamento.setValorTotal(total);
        return repository.save(orcamento);
    }

    @GetMapping
    public List<com.example.orcamento_moveis.model.Orcamento> listar() {
        return repository.findAll();
    }


    @GetMapping("/{id}/pdf")
    public void gerarPdf(@PathVariable Long id) throws Exception {

    }
}
