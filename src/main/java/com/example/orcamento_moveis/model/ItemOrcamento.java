package com.example.orcamento_moveis.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

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

    @Column(length = 1000)
    private String descricao;

    private String material;
    private String tipoMovel;

    @Column(precision = 10, scale = 2)
    private Double largura;

    @Column(precision = 10, scale = 2)
    private Double altura;

    @Column(precision = 10, scale = 2)
    private Double profundidade;

    @Column(nullable = false, precision = 10, scale = 2)
    private Double preco;

    @Column(nullable = false)
    private Integer quantidade = 1;

    private String cor;
    private String acabamento;
    private String observacoes;

    @Transient
    private BigDecimal valorTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orcamento_id", nullable = false)
    @JsonBackReference(value = "orcamento-itens")
    private Orcamento orcamento;

    @PrePersist
    @PreUpdate
    private void calcularDimensoesEValor() {
        this.valorTotal = calcularValorTotal();

        // Validação básica de dimensões
        if (this.largura != null && this.largura <= 0) {
            this.largura = null;
        }
        if (this.altura != null && this.altura <= 0) {
            this.altura = null;
        }
        if (this.profundidade != null && this.profundidade <= 0) {
            this.profundidade = null;
        }
    }

    public BigDecimal calcularValorTotal() {
        if (preco == null || quantidade == null) {
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(preco)
                .multiply(BigDecimal.valueOf(quantidade))
                .setScale(2, RoundingMode.HALF_UP);
    }

    public String getDimensoesFormatadas() {
        if (largura == null && altura == null && profundidade == null) {
            return "Dimensões não especificadas";
        }

        StringBuilder sb = new StringBuilder();
        if (largura != null) sb.append("Larg: ").append(largura).append("cm ");
        if (altura != null) sb.append("Alt: ").append(altura).append("cm ");
        if (profundidade != null) sb.append("Prof: ").append(profundidade).append("cm");

        return sb.toString().trim();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ItemOrcamento that = (ItemOrcamento) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}