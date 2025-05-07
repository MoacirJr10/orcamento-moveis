package com.example.orcamento_moveis.controller;

import com.example.orcamento_moveis.model.Orcamento;
import com.example.orcamento_moveis.model.ItemOrcamento;
import com.example.orcamento_moveis.repository.OrcamentoRepository;
import com.example.orcamento_moveis.service.PdfGeneratorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/orcamentos")
@CrossOrigin(origins = "*")
public class OrcamentoController {
    private final OrcamentoRepository repository;
    private final PdfGeneratorService pdfGeneratorService;

    public OrcamentoController(OrcamentoRepository repository, PdfGeneratorService pdfGeneratorService) {
        this.repository = repository;
        this.pdfGeneratorService = pdfGeneratorService;
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> salvar(@RequestBody Orcamento orcamento) {
        try {
            if (orcamento == null) {
                return ResponseEntity.badRequest().body("Orçamento não pode ser nulo");
            }

            validarEConfigurarOrcamento(orcamento);
            calcularValorTotal(orcamento);

            orcamento.setDataCriacao(LocalDate.now());
            orcamento.setStatus("Pendente");

            Orcamento orcamentoSalvo = repository.save(orcamento);
            return ResponseEntity.status(HttpStatus.CREATED).body(orcamentoSalvo);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao processar o orçamento");
        }
    }

    @GetMapping
    public ResponseEntity<?> listar(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String cliente) {
        try {
            List<Orcamento> orcamentos;

            if (status != null && cliente != null) {
                orcamentos = repository.findByStatusAndClienteContainingIgnoreCase(status, cliente);
            } else if (status != null) {
                orcamentos = repository.findByStatus(status);
            } else if (cliente != null) {
                orcamentos = repository.findByClienteContainingIgnoreCase(cliente);
            } else {
                orcamentos = repository.findAll();
            }

            return ResponseEntity.ok(orcamentos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao buscar orçamentos");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            Optional<Orcamento> orcamento = repository.findById(id);
            return orcamento.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao buscar orçamento");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Orcamento orcamentoAtualizado) {
        try {
            return repository.findById(id)
                    .map(orcamento -> {
                        validarEConfigurarOrcamento(orcamentoAtualizado);
                        calcularValorTotal(orcamentoAtualizado);

                        orcamentoAtualizado.setId(id);
                        orcamentoAtualizado.setDataCriacao(orcamento.getDataCriacao());
                        Orcamento atualizado = repository.save(orcamentoAtualizado);
                        return ResponseEntity.ok(atualizado);
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao atualizar orçamento");
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> atualizarStatus(@PathVariable Long id, @RequestBody Map<String, String> status) {
        try {
            return repository.findById(id)
                    .map(orcamento -> {
                        orcamento.setStatus(status.get("status"));
                        repository.save(orcamento);
                        return ResponseEntity.ok().build();
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao atualizar status");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            if (repository.existsById(id)) {
                repository.deleteById(id);
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao deletar orçamento");
        }
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<?> gerarPdf(@PathVariable Long id) {
        try {
            Optional<Orcamento> orcamento = repository.findById(id);
            if (orcamento.isPresent()) {
                byte[] pdfBytes = pdfGeneratorService.gerarPdf(orcamento.get());

                return ResponseEntity.ok()
                        .header("Content-Type", "application/pdf")
                        .header("Content-Disposition", "attachment; filename=\"orcamento_" + id + ".pdf\"")
                        .body(pdfBytes);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao gerar PDF");
        }
    }

    @GetMapping("/estatisticas")
    public ResponseEntity<?> obterEstatisticas() {
        try {
            Map<String, Object> estatisticas = new HashMap<>();
            estatisticas.put("totalOrcamentos", repository.count());
            estatisticas.put("valorMedio", repository.findValorMedio());
            estatisticas.put("statusCount", repository.countByStatusGroupByStatus());

            return ResponseEntity.ok(estatisticas);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao obter estatísticas");
        }
    }

    private void validarEConfigurarOrcamento(Orcamento orcamento) {
        if (orcamento.getCliente() == null || orcamento.getCliente().isBlank()) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório");
        }

        if (orcamento.getItens() == null || orcamento.getItens().isEmpty()) {
            throw new IllegalArgumentException("Orçamento deve conter pelo menos um item");
        }

        for (ItemOrcamento item : orcamento.getItens()) {
            if (item == null) {
                throw new IllegalArgumentException("Item não pode ser nulo");
            }

            item.setOrcamento(orcamento);

            if (item.getNome() == null || item.getNome().isBlank()) {
                throw new IllegalArgumentException("Nome do item é obrigatório");
            }

            if (item.getPreco() == null || item.getPreco() <= 0) {
                throw new IllegalArgumentException("Preço do item deve ser maior que zero");
            }

            if (item.getQuantidade() == null || item.getQuantidade() <= 0) {
                throw new IllegalArgumentException("Quantidade do item deve ser maior que zero");
            }

            if (item.getDescricao() == null || item.getDescricao().isBlank()) {
                item.setDescricao("Item sem descrição detalhada");
            }
        }
    }

    private void calcularValorTotal(Orcamento orcamento) {
        double total = orcamento.getItens().stream()
                .mapToDouble(item -> BigDecimal.valueOf(item.getPreco())
                        .multiply(BigDecimal.valueOf(item.getQuantidade()))
                        .setScale(2, RoundingMode.HALF_UP)
                        .doubleValue())
                .sum();

        orcamento.setValorTotal(BigDecimal.valueOf(total)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue());
    }
}