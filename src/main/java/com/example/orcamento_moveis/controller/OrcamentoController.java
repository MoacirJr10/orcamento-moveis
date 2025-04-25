package com.example.orcamento_moveis.controller;

import com.example.orcamento_moveis.model.Orcamento;
import com.example.orcamento_moveis.model.ItemOrcamento;
import com.example.orcamento_moveis.repository.OrcamentoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.math.BigDecimal;
import java.math.RoundingMode;

@RestController
@RequestMapping("/api/orcamentos")
@CrossOrigin(origins = "*")
public class OrcamentoController {
    private final OrcamentoRepository repository;

    public OrcamentoController(OrcamentoRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<Orcamento> salvar(@RequestBody Orcamento orcamento) {
        try {
            if (orcamento == null) {
                return ResponseEntity.badRequest().body(null);
            }

            if (orcamento.getItens() == null) {
                orcamento.setItens(new ArrayList<>());
            }

            for (ItemOrcamento item : orcamento.getItens()) {
                if (item == null) {
                    return ResponseEntity.badRequest().body(null);
                }

                item.setOrcamento(orcamento);

                if (item.getPreco() == null || item.getPreco() < 0) {
                    item.setPreco(0.0);
                }

                if (item.getQuantidade() == null || item.getQuantidade() <= 0) {
                    item.setQuantidade(1);
                }

                if (item.getDescricao() == null || item.getDescricao().isBlank()) {
                    item.setDescricao("Item sem descrição");
                }
            }


            double total = orcamento.getItens().stream()
                    .mapToDouble(item -> {
                        BigDecimal preco = BigDecimal.valueOf(item.getPreco());
                        BigDecimal quantidade = BigDecimal.valueOf(item.getQuantidade());
                        return preco.multiply(quantidade)
                                .setScale(2, RoundingMode.HALF_UP)
                                .doubleValue();
                    })
                    .sum();


            total = BigDecimal.valueOf(total)
                    .setScale(2, RoundingMode.HALF_UP)
                    .doubleValue();

            orcamento.setValorTotal(total);

            Orcamento orcamentoSalvo = repository.save(orcamento);
            return ResponseEntity.ok(orcamentoSalvo);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<Orcamento>> listar() {
        try {
            List<Orcamento> orcamentos = repository.findAll();
            return ResponseEntity.ok(orcamentos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<String> gerarPdf(@PathVariable Long id) {
        try {
            Optional<Orcamento> orcamento = repository.findById(id);
            if (orcamento.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("Funcionalidade não implementada ainda.");

            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}