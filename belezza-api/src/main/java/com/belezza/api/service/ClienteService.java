package com.belezza.api.service;

import com.belezza.api.dto.cliente.ClienteResponse;
import com.belezza.api.entity.Cliente;
import com.belezza.api.entity.Salon;
import com.belezza.api.entity.Usuario;
import com.belezza.api.exception.BusinessException;
import com.belezza.api.exception.ResourceNotFoundException;
import com.belezza.api.repository.ClienteRepository;
import com.belezza.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final SalonService salonService;

    @Transactional
    public ClienteResponse criarOuBuscar(Long salonId, String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmailAndAtivoTrue(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "email", emailUsuario));

        Salon salon = salonService.getSalonEntity(salonId);

        return clienteRepository.findByUsuarioIdAndSalonId(usuario.getId(), salonId)
                .map(ClienteResponse::fromEntity)
                .orElseGet(() -> {
                    Cliente cliente = Cliente.builder()
                            .usuario(usuario)
                            .salon(salon)
                            .build();
                    cliente = clienteRepository.save(cliente);
                    log.info("Cliente criado: {} no salão {}", cliente.getId(), salonId);
                    return ClienteResponse.fromEntity(cliente);
                });
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));
        return ClienteResponse.fromEntity(cliente);
    }

    @Transactional(readOnly = true)
    public List<ClienteResponse> listarPorSalon(Long salonId) {
        return clienteRepository.findBySalonIdAndAtivoTrue(salonId).stream()
                .map(ClienteResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ClienteResponse> listarBloqueados(Long salonId, int maxNoShows) {
        return clienteRepository.findByNoShowsExceeded(salonId, maxNoShows).stream()
                .map(ClienteResponse::fromEntity)
                .toList();
    }

    @Transactional
    public ClienteResponse atualizarObservacoes(Long id, String observacoes, String emailAdmin) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));

        Salon salon = salonService.getSalonByAdminEmail(emailAdmin);
        if (!cliente.getSalon().getId().equals(salon.getId())) {
            throw new BusinessException("Cliente não pertence a este salão");
        }

        cliente.setObservacoes(observacoes);
        cliente = clienteRepository.save(cliente);

        return ClienteResponse.fromEntity(cliente);
    }

    @Transactional
    public void bloquear(Long id, String emailAdmin) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));

        Salon salon = salonService.getSalonByAdminEmail(emailAdmin);
        if (!cliente.getSalon().getId().equals(salon.getId())) {
            throw new BusinessException("Cliente não pertence a este salão");
        }

        cliente.setBloqueado(true);
        clienteRepository.save(cliente);
        log.info("Cliente bloqueado: {}", id);
    }

    @Transactional
    public void desbloquear(Long id, String emailAdmin) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));

        Salon salon = salonService.getSalonByAdminEmail(emailAdmin);
        if (!cliente.getSalon().getId().equals(salon.getId())) {
            throw new BusinessException("Cliente não pertence a este salão");
        }

        cliente.setBloqueado(false);
        clienteRepository.save(cliente);
        log.info("Cliente desbloqueado: {}", id);
    }

    public Cliente getOrCreateCliente(Long salonId, String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmailAndAtivoTrue(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "email", emailUsuario));

        Salon salon = salonService.getSalonEntity(salonId);

        return clienteRepository.findByUsuarioIdAndSalonId(usuario.getId(), salonId)
                .orElseGet(() -> {
                    Cliente cliente = Cliente.builder()
                            .usuario(usuario)
                            .salon(salon)
                            .build();
                    return clienteRepository.save(cliente);
                });
    }

    public Cliente getClienteEntity(Long id) {
        return clienteRepository.findById(id)
                .filter(Cliente::isAtivo)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));
    }
}
