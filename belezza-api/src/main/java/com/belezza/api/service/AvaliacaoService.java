package com.belezza.api.service;

import com.belezza.api.dto.avaliacao.AvaliacaoRequest;
import com.belezza.api.dto.avaliacao.AvaliacaoResponse;
import com.belezza.api.entity.Agendamento;
import com.belezza.api.entity.Avaliacao;
import com.belezza.api.entity.StatusAgendamento;
import com.belezza.api.exception.BusinessException;
import com.belezza.api.exception.ResourceNotFoundException;
import com.belezza.api.repository.AgendamentoRepository;
import com.belezza.api.repository.AvaliacaoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final AgendamentoRepository agendamentoRepository;

    @Transactional
    public AvaliacaoResponse criar(AvaliacaoRequest request) {
        Agendamento agendamento = agendamentoRepository.findById(request.getAgendamentoId())
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento", request.getAgendamentoId()));

        if (agendamento.getStatus() != StatusAgendamento.CONCLUIDO) {
            throw new BusinessException("Apenas agendamentos concluídos podem ser avaliados");
        }

        if (avaliacaoRepository.existsByAgendamentoId(request.getAgendamentoId())) {
            throw new BusinessException("Este agendamento já foi avaliado");
        }

        Avaliacao avaliacao = Avaliacao.builder()
                .agendamento(agendamento)
                .profissional(agendamento.getProfissional())
                .salon(agendamento.getSalon())
                .nota(request.getNota())
                .comentario(request.getComentario())
                .build();

        avaliacao = avaliacaoRepository.save(avaliacao);
        log.info("Avaliação criada: {} para agendamento {}", avaliacao.getId(), request.getAgendamentoId());

        return AvaliacaoResponse.fromEntity(avaliacao);
    }

    @Transactional(readOnly = true)
    public AvaliacaoResponse buscarPorAgendamento(Long agendamentoId) {
        Avaliacao avaliacao = avaliacaoRepository.findByAgendamentoId(agendamentoId)
                .orElseThrow(() -> new ResourceNotFoundException("Avaliação", "agendamento", agendamentoId.toString()));
        return AvaliacaoResponse.fromEntity(avaliacao);
    }

    @Transactional(readOnly = true)
    public Page<AvaliacaoResponse> listarPorSalon(Long salonId, Pageable pageable) {
        return avaliacaoRepository.findBySalonId(salonId, pageable)
                .map(AvaliacaoResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<AvaliacaoResponse> listarPorProfissional(Long profissionalId, Pageable pageable) {
        return avaliacaoRepository.findByProfissionalId(profissionalId, pageable)
                .map(AvaliacaoResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Double mediaSalon(Long salonId) {
        return avaliacaoRepository.findAverageNotaBySalonId(salonId);
    }

    @Transactional(readOnly = true)
    public Double mediaProfissional(Long profissionalId) {
        return avaliacaoRepository.findAverageNotaByProfissionalId(profissionalId);
    }
}
