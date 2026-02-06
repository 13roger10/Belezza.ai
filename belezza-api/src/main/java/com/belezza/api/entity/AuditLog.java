package com.belezza.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Audit log for tracking important actions in the system.
 */
@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_entidade", columnList = "entidade, entidade_id"),
    @Index(name = "idx_audit_usuario", columnList = "usuario_id"),
    @Index(name = "idx_audit_criado_em", columnList = "criado_em")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String acao;

    @Column(nullable = false, length = 50)
    private String entidade;

    @Column(nullable = false)
    private Long entidadeId;

    private Long usuarioId;

    @Column(length = 45)
    private String ipAddress;

    @Column(columnDefinition = "TEXT")
    private String dadosAntigos;

    @Column(columnDefinition = "TEXT")
    private String dadosNovos;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;
}
