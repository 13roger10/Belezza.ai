package com.belezza.api.controller;

import com.belezza.api.dto.cliente.ClienteResponse;
import com.belezza.api.security.annotation.AdminOnly;
import com.belezza.api.service.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Clientes", description = "Gerenciamento de clientes do salão")
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping("/{id}")
    @Operation(summary = "Buscar cliente", description = "Busca um cliente por ID")
    public ResponseEntity<ClienteResponse> buscarPorId(@PathVariable Long id) {
        ClienteResponse response = clienteService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/salon/{salonId}")
    @Operation(summary = "Listar clientes do salão", description = "Lista todos os clientes ativos de um salão")
    public ResponseEntity<List<ClienteResponse>> listarPorSalon(@PathVariable Long salonId) {
        List<ClienteResponse> response = clienteService.listarPorSalon(salonId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/observacoes")
    @AdminOnly
    @Operation(summary = "Atualizar observações", description = "Atualiza observações de um cliente")
    public ResponseEntity<ClienteResponse> atualizarObservacoes(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        ClienteResponse response = clienteService.atualizarObservacoes(
                id, body.get("observacoes"), userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/bloquear")
    @AdminOnly
    @Operation(summary = "Bloquear cliente", description = "Bloqueia um cliente de fazer agendamentos")
    public ResponseEntity<Map<String, String>> bloquear(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        clienteService.bloquear(id, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Cliente bloqueado com sucesso"));
    }

    @PostMapping("/{id}/desbloquear")
    @AdminOnly
    @Operation(summary = "Desbloquear cliente", description = "Desbloqueia um cliente")
    public ResponseEntity<Map<String, String>> desbloquear(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        clienteService.desbloquear(id, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Cliente desbloqueado com sucesso"));
    }
}
