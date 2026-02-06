package com.belezza.api.dto.agendamento;

import com.belezza.api.entity.Agendamento;
import com.belezza.api.entity.StatusAgendamento;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgendamentoResponse {

    private Long id;
    private Long salonId;
    private String salonNome;
    private Long clienteId;
    private String clienteNome;
    private String clienteTelefone;
    private Long profissionalId;
    private String profissionalNome;
    private Long servicoId;
    private String servicoNome;
    private int servicoDuracaoMinutos;
    private LocalDateTime dataHora;
    private LocalDateTime fimPrevisto;
    private StatusAgendamento status;
    private String statusDescricao;
    private String observacoes;
    private String motivoCancelamento;
    private BigDecimal valorCobrado;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public static AgendamentoResponse fromEntity(Agendamento a) {
        return AgendamentoResponse.builder()
                .id(a.getId())
                .salonId(a.getSalon().getId())
                .salonNome(a.getSalon().getNome())
                .clienteId(a.getCliente().getId())
                .clienteNome(a.getCliente().getUsuario().getNome())
                .clienteTelefone(a.getCliente().getUsuario().getTelefone())
                .profissionalId(a.getProfissional().getId())
                .profissionalNome(a.getProfissional().getUsuario().getNome())
                .servicoId(a.getServico().getId())
                .servicoNome(a.getServico().getNome())
                .servicoDuracaoMinutos(a.getServico().getDuracaoMinutos())
                .dataHora(a.getDataHora())
                .fimPrevisto(a.getFimPrevisto())
                .status(a.getStatus())
                .statusDescricao(a.getStatus().getDescription())
                .observacoes(a.getObservacoes())
                .motivoCancelamento(a.getMotivoCancelamento())
                .valorCobrado(a.getValorCobrado())
                .criadoEm(a.getCriadoEm())
                .atualizadoEm(a.getAtualizadoEm())
                .build();
    }
}
