package com.belezza.api.dto.profissional;

import com.belezza.api.entity.Profissional;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfissionalResponse {

    private Long id;
    private Long usuarioId;
    private String nome;
    private String email;
    private String telefone;
    private String especialidade;
    private String bio;
    private String fotoUrl;
    private boolean aceitaAgendamentoOnline;
    private boolean ativo;
    private Long salonId;
    private List<ServicoResumo> servicos;
    private LocalDateTime criadoEm;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServicoResumo {
        private Long id;
        private String nome;
        private String tipo;
    }

    public static ProfissionalResponse fromEntity(Profissional prof) {
        ProfissionalResponseBuilder builder = ProfissionalResponse.builder()
                .id(prof.getId())
                .usuarioId(prof.getUsuario().getId())
                .nome(prof.getUsuario().getNome())
                .email(prof.getUsuario().getEmail())
                .telefone(prof.getUsuario().getTelefone())
                .especialidade(prof.getEspecialidade())
                .bio(prof.getBio())
                .fotoUrl(prof.getFotoUrl())
                .aceitaAgendamentoOnline(prof.isAceitaAgendamentoOnline())
                .ativo(prof.isAtivo())
                .salonId(prof.getSalon().getId())
                .criadoEm(prof.getCriadoEm());

        if (prof.getServicos() != null) {
            builder.servicos(prof.getServicos().stream()
                    .map(s -> ServicoResumo.builder()
                            .id(s.getId())
                            .nome(s.getNome())
                            .tipo(s.getTipo().name())
                            .build())
                    .toList());
        }

        return builder.build();
    }
}
