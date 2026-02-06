package com.belezza.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Appointment entity linking a client, professional, and service.
 */
@Entity
@Table(name = "agendamentos", indexes = {
    @Index(name = "idx_agendamento_cliente", columnList = "cliente_id"),
    @Index(name = "idx_agendamento_profissional", columnList = "profissional_id"),
    @Index(name = "idx_agendamento_servico", columnList = "servico_id"),
    @Index(name = "idx_agendamento_salon", columnList = "salon_id"),
    @Index(name = "idx_agendamento_status", columnList = "status"),
    @Index(name = "idx_agendamento_data_hora", columnList = "data_hora"),
    @Index(name = "idx_agendamento_token", columnList = "token_confirmacao")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "salon_id", nullable = false)
    private Salon salon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profissional_id", nullable = false)
    private Profissional profissional;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servico_id", nullable = false)
    private Servico servico;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    @Column(nullable = false)
    private LocalDateTime fimPrevisto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private StatusAgendamento status = StatusAgendamento.PENDENTE;

    @Column(length = 500)
    private String observacoes;

    @Column(length = 300)
    private String motivoCancelamento;

    @Column(precision = 10, scale = 2)
    private BigDecimal valorCobrado;

    @Column(length = 100, unique = true)
    private String tokenConfirmacao;

    @Column(nullable = false)
    @Builder.Default
    private boolean lembreteEnviado24h = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean lembreteEnviado2h = false;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime atualizadoEm;
}
