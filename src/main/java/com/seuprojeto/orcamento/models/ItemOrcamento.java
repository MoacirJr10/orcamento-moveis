package com.seuprojeto.orcamento.models;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Data
public class ItemOrcamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private int quantidade;

    private BigDecimal precoUnitario;

    private BigDecimal precoTotal;

    @ManyToOne
    @JoinColumn(name = "orcamento_id")
    private Orcamento orcamento;
}
