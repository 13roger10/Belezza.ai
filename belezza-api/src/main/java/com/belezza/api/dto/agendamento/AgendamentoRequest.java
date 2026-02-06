package com.belezza.api.dto.agendamento;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgendamentoRequest {

    @NotNull(message = "ID do profissional é obrigatório")
    private Long profissionalId;

    @NotNull(message = "ID do serviço é obrigatório")
    private Long servicoId;

    @NotNull(message = "Data e hora são obrigatórios")
    @Future(message = "Data e hora devem ser no futuro")
    private LocalDateTime dataHora;

    @Size(max = 500)
    private String observacoes;
}
