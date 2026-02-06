package com.belezza.api.dto.cliente;

import com.belezza.api.entity.Cliente;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteResponse {

    private Long id;
    private Long usuarioId;
    private String nome;
    private String email;
    private String telefone;
    private int noShows;
    private int totalAgendamentos;
    private String observacoes;
    private boolean bloqueado;
    private boolean ativo;
    private Long salonId;
    private LocalDateTime criadoEm;

    public static ClienteResponse fromEntity(Cliente cliente) {
        return ClienteResponse.builder()
                .id(cliente.getId())
                .usuarioId(cliente.getUsuario().getId())
                .nome(cliente.getUsuario().getNome())
                .email(cliente.getUsuario().getEmail())
                .telefone(cliente.getUsuario().getTelefone())
                .noShows(cliente.getNoShows())
                .totalAgendamentos(cliente.getTotalAgendamentos())
                .observacoes(cliente.getObservacoes())
                .bloqueado(cliente.isBloqueado())
                .ativo(cliente.isAtivo())
                .salonId(cliente.getSalon().getId())
                .criadoEm(cliente.getCriadoEm())
                .build();
    }
}
