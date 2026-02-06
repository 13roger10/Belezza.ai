package com.belezza.api.repository;

import com.belezza.api.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findByEntidadeAndEntidadeId(String entidade, Long entidadeId, Pageable pageable);

    Page<AuditLog> findByUsuarioId(Long usuarioId, Pageable pageable);

    Page<AuditLog> findAllByOrderByCriadoEmDesc(Pageable pageable);
}
