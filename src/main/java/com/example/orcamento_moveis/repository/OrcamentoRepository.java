package com.example.orcamento_moveis.repository;

import com.example.orcamento_moveis.model.Orcamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {

    List<Orcamento> findByStatus(String status);

    List<Orcamento> findByClienteContainingIgnoreCase(String cliente);

    List<Orcamento> findByStatusAndClienteContainingIgnoreCase(String status, String cliente);

    @Query("SELECT o FROM Orcamento o WHERE o.dataCriacao BETWEEN :dataInicio AND :dataFim")
    List<Orcamento> findByPeriodo(LocalDate dataInicio, LocalDate dataFim);

    @Query("SELECT AVG(o.valorTotal) FROM Orcamento o")
    Double findValorMedio();

    @Query("SELECT o.status as status, COUNT(o) as total FROM Orcamento o GROUP BY o.status")
    List<Map<String, Object>> countByStatusGroupByStatus();

    @Query("SELECT o FROM Orcamento o WHERE o.valorTotal BETWEEN :valorMin AND :valorMax")
    List<Orcamento> findByValorBetween(Double valorMin, Double valorMax);

    @Query("SELECT o FROM Orcamento o WHERE LOWER(o.cliente) LIKE LOWER(concat('%', :termo, '%')) " +
            "OR LOWER(o.descricao) LIKE LOWER(concat('%', :termo, '%'))")
    List<Orcamento> searchByTermo(String termo);
}