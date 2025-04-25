package com.example.orcamento_moveis.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "itens_orcamento")
@Data
@NoArgsConstructor
public class ItemOrcamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String descricao;
    private String material;

    private Double largura;
    private Double altura;
    private Double profundidade;

    private Double preco;

    @Column(nullable = false)
    private Integer quantidade;

    private String cor;
    private String acabamento;

    @Transient
    private BigDecimal valorTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orcamento_id")
    private Orcamento orcamento;

    public BigDecimal calcularValorTotal() {
        if (preco == null || quantidade == null) {
            return BigDecimal.ZERO;
        }
        BigDecimal precoDecimal = BigDecimal.valueOf(preco);
        BigDecimal quantidadeDecimal = BigDecimal.valueOf(quantidade);

        return precoDecimal.multiply(quantidadeDecimal).setScale(2, java.math.RoundingMode.HALF_UP);
    }

    @PrePersist
    @PreUpdate
    private void atualizarValorTotal() {
        this.valorTotal = calcularValorTotal();
    }
}
