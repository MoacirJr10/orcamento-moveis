package com.seuprojeto.orcamento.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.list;

@Entity
@Data

public class Orcamento{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @OneToMany(mappedBy = "orcamento", cascade = CascadeType.ALL)
    private List<ItemOrcamento> itens;

    private double total;
}