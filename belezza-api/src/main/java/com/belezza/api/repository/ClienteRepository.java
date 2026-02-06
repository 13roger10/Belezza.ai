package com.belezza.api.repository;

import com.belezza.api.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByUsuarioIdAndSalonId(Long usuarioId, Long salonId);

    List<Cliente> findBySalonIdAndAtivoTrue(Long salonId);

    List<Cliente> findByUsuarioId(Long usuarioId);

    boolean existsByUsuarioIdAndSalonId(Long usuarioId, Long salonId);

    @Query("SELECT c FROM Cliente c WHERE c.salon.id = :salonId AND c.bloqueado = false AND c.ativo = true")
    List<Cliente> findActiveNotBlockedBySalonId(@Param("salonId") Long salonId);

    @Query("SELECT c FROM Cliente c WHERE c.salon.id = :salonId AND c.noShows >= :maxNoShows")
    List<Cliente> findByNoShowsExceeded(@Param("salonId") Long salonId, @Param("maxNoShows") int maxNoShows);

    @Modifying
    @Query("UPDATE Cliente c SET c.noShows = c.noShows + 1 WHERE c.id = :clienteId")
    void incrementNoShows(@Param("clienteId") Long clienteId);

    @Modifying
    @Query("UPDATE Cliente c SET c.totalAgendamentos = c.totalAgendamentos + 1 WHERE c.id = :clienteId")
    void incrementTotalAgendamentos(@Param("clienteId") Long clienteId);

    @Query("SELECT COUNT(c) FROM Cliente c WHERE c.salon.id = :salonId AND c.ativo = true")
    long countActiveBySalonId(@Param("salonId") Long salonId);
}
