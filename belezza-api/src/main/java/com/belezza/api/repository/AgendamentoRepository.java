package com.belezza.api.repository;

import com.belezza.api.entity.Agendamento;
import com.belezza.api.entity.StatusAgendamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    Optional<Agendamento> findByTokenConfirmacao(String token);

    Page<Agendamento> findBySalonId(Long salonId, Pageable pageable);

    Page<Agendamento> findByClienteId(Long clienteId, Pageable pageable);

    Page<Agendamento> findByProfissionalId(Long profissionalId, Pageable pageable);

    List<Agendamento> findBySalonIdAndStatus(Long salonId, StatusAgendamento status);

    // Check for scheduling conflicts
    @Query("SELECT a FROM Agendamento a WHERE a.profissional.id = :profId " +
           "AND a.status NOT IN ('CANCELADO', 'NO_SHOW') " +
           "AND a.dataHora < :fim AND a.fimPrevisto > :inicio")
    List<Agendamento> findConflicts(
        @Param("profId") Long profissionalId,
        @Param("inicio") LocalDateTime inicio,
        @Param("fim") LocalDateTime fim
    );

    // Find appointments that need 24h reminder
    @Query("SELECT a FROM Agendamento a WHERE a.status = 'CONFIRMADO' " +
           "AND a.lembreteEnviado24h = false " +
           "AND a.dataHora BETWEEN :inicio AND :fim")
    List<Agendamento> findNeedingReminder24h(
        @Param("inicio") LocalDateTime inicio,
        @Param("fim") LocalDateTime fim
    );

    // Find appointments that need 2h reminder
    @Query("SELECT a FROM Agendamento a WHERE a.status = 'CONFIRMADO' " +
           "AND a.lembreteEnviado2h = false " +
           "AND a.dataHora BETWEEN :inicio AND :fim")
    List<Agendamento> findNeedingReminder2h(
        @Param("inicio") LocalDateTime inicio,
        @Param("fim") LocalDateTime fim
    );

    // Find no-show candidates (past appointment time, still confirmed)
    @Query("SELECT a FROM Agendamento a WHERE a.status = 'CONFIRMADO' " +
           "AND a.dataHora < :cutoff")
    List<Agendamento> findNoShowCandidates(@Param("cutoff") LocalDateTime cutoff);

    // Daily appointments for a professional
    @Query("SELECT a FROM Agendamento a WHERE a.profissional.id = :profId " +
           "AND a.dataHora >= :dayStart AND a.dataHora < :dayEnd " +
           "AND a.status NOT IN ('CANCELADO', 'NO_SHOW') " +
           "ORDER BY a.dataHora")
    List<Agendamento> findDailyByProfissional(
        @Param("profId") Long profissionalId,
        @Param("dayStart") LocalDateTime dayStart,
        @Param("dayEnd") LocalDateTime dayEnd
    );

    // Count by status for metrics
    @Query("SELECT a.status, COUNT(a) FROM Agendamento a " +
           "WHERE a.salon.id = :salonId AND a.dataHora BETWEEN :inicio AND :fim " +
           "GROUP BY a.status")
    List<Object[]> countByStatusAndPeriod(
        @Param("salonId") Long salonId,
        @Param("inicio") LocalDateTime inicio,
        @Param("fim") LocalDateTime fim
    );

    // Count appointments in a period for a salon
    @Query("SELECT COUNT(a) FROM Agendamento a WHERE a.salon.id = :salonId " +
           "AND a.criadoEm BETWEEN :inicio AND :fim")
    long countBySalonIdAndPeriod(
        @Param("salonId") Long salonId,
        @Param("inicio") LocalDateTime inicio,
        @Param("fim") LocalDateTime fim
    );

    // Find appointments by salon and date range (for metrics)
    @Query("SELECT a FROM Agendamento a WHERE a.salon.id = :salonId " +
           "AND a.dataHora BETWEEN :inicio AND :fim " +
           "ORDER BY a.dataHora")
    List<Agendamento> findBySalonIdAndDataHoraBetween(
        @Param("salonId") Long salonId,
        @Param("inicio") LocalDateTime inicio,
        @Param("fim") LocalDateTime fim
    );
}
