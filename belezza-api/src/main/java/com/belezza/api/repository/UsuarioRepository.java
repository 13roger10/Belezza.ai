package com.belezza.api.repository;

import com.belezza.api.entity.Role;
import com.belezza.api.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Usuario entity operations.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByEmailAndAtivoTrue(String email);

    boolean existsByEmail(String email);

    boolean existsByTelefone(String telefone);

    Optional<Usuario> findByResetPasswordToken(String token);

    Optional<Usuario> findByEmailVerificationToken(String token);

    List<Usuario> findByRoleAndAtivoTrue(Role role);

    @Modifying
    @Query("UPDATE Usuario u SET u.ultimoLogin = :loginTime WHERE u.id = :userId")
    void updateLastLogin(@Param("userId") Long userId, @Param("loginTime") LocalDateTime loginTime);

    @Query("SELECT u FROM Usuario u WHERE u.ativo = true AND u.role = :role")
    List<Usuario> findActiveByRole(@Param("role") Role role);

    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.ativo = true")
    long countActiveUsers();
}
