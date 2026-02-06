package com.belezza.api.repository;

import com.belezza.api.entity.Avaliacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    Optional<Avaliacao> findByAgendamentoId(Long agendamentoId);

    boolean existsByAgendamentoId(Long agendamentoId);

    Page<Avaliacao> findBySalonId(Long salonId, Pageable pageable);

    Page<Avaliacao> findByProfissionalId(Long profissionalId, Pageable pageable);

    @Query("SELECT AVG(a.nota) FROM Avaliacao a WHERE a.salon.id = :salonId")
    Double findAverageNotaBySalonId(@Param("salonId") Long salonId);

    @Query("SELECT AVG(a.nota) FROM Avaliacao a WHERE a.profissional.id = :profissionalId")
    Double findAverageNotaByProfissionalId(@Param("profissionalId") Long profissionalId);

    @Query("SELECT COUNT(a) FROM Avaliacao a WHERE a.salon.id = :salonId")
    long countBySalonId(@Param("salonId") Long salonId);

    @Query("SELECT COUNT(a) FROM Avaliacao a WHERE a.profissional.id = :profissionalId")
    long countByProfissionalId(@Param("profissionalId") Long profissionalId);
}
