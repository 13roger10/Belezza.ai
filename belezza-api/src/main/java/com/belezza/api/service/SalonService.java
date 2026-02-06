package com.belezza.api.service;

import com.belezza.api.dto.salon.SalonRequest;
import com.belezza.api.dto.salon.SalonResponse;
import com.belezza.api.entity.Role;
import com.belezza.api.entity.Salon;
import com.belezza.api.entity.Usuario;
import com.belezza.api.exception.BusinessException;
import com.belezza.api.exception.DuplicateResourceException;
import com.belezza.api.exception.ResourceNotFoundException;
import com.belezza.api.repository.SalonRepository;
import com.belezza.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SalonService {

    private final SalonRepository salonRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public SalonResponse criar(SalonRequest request, String emailAdmin) {
        log.info("Criando salão para admin: {}", emailAdmin);

        Usuario admin = usuarioRepository.findByEmailAndAtivoTrue(emailAdmin)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "email", emailAdmin));

        if (admin.getRole() != Role.ADMIN) {
            throw new BusinessException("Apenas usuários ADMIN podem criar salões");
        }

        if (salonRepository.existsByAdminId(admin.getId())) {
            throw new DuplicateResourceException("Salão", "admin", emailAdmin);
        }

        Salon salon = Salon.builder()
                .nome(request.getNome().trim())
                .descricao(request.getDescricao())
                .endereco(request.getEndereco())
                .cidade(request.getCidade())
                .estado(request.getEstado())
                .cep(request.getCep())
                .telefone(request.getTelefone())
                .cnpj(request.getCnpj())
                .horarioAbertura(parseTime(request.getHorarioAbertura(), "08:00"))
                .horarioFechamento(parseTime(request.getHorarioFechamento(), "20:00"))
                .intervaloAgendamentoMinutos(request.getIntervaloAgendamentoMinutos() != null ? request.getIntervaloAgendamentoMinutos() : 30)
                .antecedenciaMinimaHoras(request.getAntecedenciaMinimaHoras() != null ? request.getAntecedenciaMinimaHoras() : 2)
                .cancelamentoMinimoHoras(request.getCancelamentoMinimoHoras() != null ? request.getCancelamentoMinimoHoras() : 2)
                .maxNoShowsPermitidos(request.getMaxNoShowsPermitidos() != null ? request.getMaxNoShowsPermitidos() : 3)
                .aceitaAgendamentoOnline(request.getAceitaAgendamentoOnline() != null ? request.getAceitaAgendamentoOnline() : true)
                .admin(admin)
                .build();

        salon = salonRepository.save(salon);
        log.info("Salão criado com id: {}", salon.getId());

        return SalonResponse.fromEntity(salon);
    }

    @Transactional(readOnly = true)
    public SalonResponse buscarPorId(Long id) {
        Salon salon = salonRepository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salão", id));
        return SalonResponse.fromEntity(salon);
    }

    @Transactional(readOnly = true)
    public SalonResponse buscarPorAdmin(String emailAdmin) {
        Usuario admin = usuarioRepository.findByEmailAndAtivoTrue(emailAdmin)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "email", emailAdmin));

        Salon salon = salonRepository.findByAdminIdAndAtivoTrue(admin.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Salão", "admin", emailAdmin));

        return SalonResponse.fromEntity(salon);
    }

    @Transactional(readOnly = true)
    public List<SalonResponse> listarAtivos() {
        return salonRepository.findByAtivoTrue().stream()
                .map(SalonResponse::fromEntity)
                .toList();
    }

    @Transactional
    public SalonResponse atualizar(Long id, SalonRequest request, String emailAdmin) {
        log.info("Atualizando salão id: {}", id);

        Salon salon = getSalonDoAdmin(id, emailAdmin);

        salon.setNome(request.getNome().trim());
        if (request.getDescricao() != null) salon.setDescricao(request.getDescricao());
        if (request.getEndereco() != null) salon.setEndereco(request.getEndereco());
        if (request.getCidade() != null) salon.setCidade(request.getCidade());
        if (request.getEstado() != null) salon.setEstado(request.getEstado());
        if (request.getCep() != null) salon.setCep(request.getCep());
        if (request.getTelefone() != null) salon.setTelefone(request.getTelefone());
        if (request.getCnpj() != null) salon.setCnpj(request.getCnpj());
        if (request.getHorarioAbertura() != null) salon.setHorarioAbertura(LocalTime.parse(request.getHorarioAbertura()));
        if (request.getHorarioFechamento() != null) salon.setHorarioFechamento(LocalTime.parse(request.getHorarioFechamento()));
        if (request.getIntervaloAgendamentoMinutos() != null) salon.setIntervaloAgendamentoMinutos(request.getIntervaloAgendamentoMinutos());
        if (request.getAntecedenciaMinimaHoras() != null) salon.setAntecedenciaMinimaHoras(request.getAntecedenciaMinimaHoras());
        if (request.getCancelamentoMinimoHoras() != null) salon.setCancelamentoMinimoHoras(request.getCancelamentoMinimoHoras());
        if (request.getMaxNoShowsPermitidos() != null) salon.setMaxNoShowsPermitidos(request.getMaxNoShowsPermitidos());
        if (request.getAceitaAgendamentoOnline() != null) salon.setAceitaAgendamentoOnline(request.getAceitaAgendamentoOnline());

        salon = salonRepository.save(salon);
        log.info("Salão atualizado com sucesso: {}", salon.getId());

        return SalonResponse.fromEntity(salon);
    }

    @Transactional
    public void desativar(Long id, String emailAdmin) {
        log.info("Desativando salão id: {}", id);
        Salon salon = getSalonDoAdmin(id, emailAdmin);
        salon.setAtivo(false);
        salonRepository.save(salon);
        log.info("Salão desativado: {}", id);
    }

    // Helper to get salon and validate admin ownership
    public Salon getSalonDoAdmin(Long salonId, String emailAdmin) {
        Usuario admin = usuarioRepository.findByEmailAndAtivoTrue(emailAdmin)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "email", emailAdmin));

        Salon salon = salonRepository.findById(salonId)
                .orElseThrow(() -> new ResourceNotFoundException("Salão", salonId));

        if (!salon.getAdmin().getId().equals(admin.getId())) {
            throw new BusinessException("Você não tem permissão para gerenciar este salão");
        }

        return salon;
    }

    // Helper to get salon entity for other services
    public Salon getSalonEntity(Long salonId) {
        return salonRepository.findByIdAndAtivoTrue(salonId)
                .orElseThrow(() -> new ResourceNotFoundException("Salão", salonId));
    }

    // Helper to get salon by admin email
    public Salon getSalonByAdminEmail(String emailAdmin) {
        Usuario admin = usuarioRepository.findByEmailAndAtivoTrue(emailAdmin)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "email", emailAdmin));

        return salonRepository.findByAdminIdAndAtivoTrue(admin.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Salão", "admin", emailAdmin));
    }

    private LocalTime parseTime(String time, String defaultTime) {
        if (time == null || time.isBlank()) {
            return LocalTime.parse(defaultTime);
        }
        return LocalTime.parse(time);
    }
}
