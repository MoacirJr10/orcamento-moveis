package com.exemplo.orcamentomoveis.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ItemOrcamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private double largura;
    private double altura;
    private double profundidade;
    private double preco;

    @ManyToOne
    @JoinColumn(name = "orcamento_id")
    private Orcamento orcamento;
}
