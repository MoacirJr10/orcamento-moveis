package com.example.orcamento_moveis.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orcamentos")
@Data
@NoArgsConstructor
public class Orcamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cliente;

    @Column(length = 1000)
    private String descricao;

    @Column(nullable = false, precision = 12, scale = 2)
    private double valorTotal;

    @Column(nullable = false)
    private LocalDate dataCriacao;

    @Column(nullable = false)
    private String status;

    @Column(length = 500)
    private String observacoes;

    private String telefone;
    private String email;

    @Column(length = 20)
    private String formaPagamento;

    @Column(precision = 3, scale = 0)
    private Integer prazoEntregaDias;

    @OneToMany(mappedBy = "orcamento", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "orcamento-itens")
    private List<ItemOrcamento> itens = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (dataCriacao == null) {
            dataCriacao = LocalDate.now();
        }
        if (status == null) {
            status = "Pendente";
        }
    }

    public void adicionarItem(ItemOrcamento item) {
        item.setOrcamento(this);
        this.itens.add(item);
    }

    public void removerItem(ItemOrcamento item) {
        item.setOrcamento(null);
        this.itens.remove(item);
    }

    public String getResumoItens() {
        if (itens == null || itens.isEmpty()) {
            return "Nenhum item adicionado";
        }

        StringBuilder sb = new StringBuilder();
        for (ItemOrcamento item : itens) {
            sb.append(item.getQuantidade()).append("x ")
                    .append(item.getNome()).append(", ");
        }


        if (sb.length() > 0) {
            sb.setLength(sb.length() - 2);
        }

        return sb.toString();
    }
}