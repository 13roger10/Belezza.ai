package com.belezza.api.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when trying to create a resource that already exists.
 */
public class DuplicateResourceException extends BusinessException {

    public DuplicateResourceException(String message) {
        super(message, HttpStatus.CONFLICT, "DUPLICATE_RESOURCE");
    }

    public static DuplicateResourceException email(String email) {
        return new DuplicateResourceException("Email já cadastrado: " + email);
    }

    public static DuplicateResourceException telefone(String telefone) {
        return new DuplicateResourceException("Telefone já cadastrado: " + telefone);
    }
}
