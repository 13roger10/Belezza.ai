package com.belezza.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Webhook controller for Meta Graph API callbacks.
 * Handles verification and event notifications from Instagram/Facebook.
 */
@RestController
@RequestMapping("/api/webhooks/meta")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Webhooks", description = "Meta Graph API webhook endpoints")
public class MetaWebhookController {

    @Value("${meta.webhook.verify-token:belezza_webhook_verify_token}")
    private String verifyToken;

    /**
     * Webhook verification endpoint.
     * Meta will call this endpoint to verify the webhook URL during setup.
     */
    @GetMapping
    @Operation(
        summary = "Webhook verification",
        description = "Meta webhook verification endpoint. " +
                     "Validates the verify token and returns the challenge."
    )
    public ResponseEntity<?> verifyWebhook(
        @RequestParam("hub.mode") String mode,
        @RequestParam("hub.challenge") String challenge,
        @RequestParam("hub.verify_token") String token
    ) {
        log.info("Webhook verification request. Mode: {}, Token: {}", mode, token);

        // Verify mode and token
        if ("subscribe".equals(mode) && verifyToken.equals(token)) {
            log.info("Webhook verified successfully");
            // Return challenge as plain text
            return ResponseEntity.ok(challenge);
        }

        log.warn("Webhook verification failed. Invalid token or mode");
        return ResponseEntity.status(403).body("Verification failed");
    }

    /**
     * Webhook events endpoint.
     * Receives notifications from Meta about post updates, metrics, etc.
     */
    @PostMapping
    @Operation(
        summary = "Receive webhook events",
        description = "Receives event notifications from Meta (Instagram/Facebook). " +
                     "Processes post updates, metrics changes, and other events."
    )
    public ResponseEntity<String> handleWebhook(@RequestBody Map<String, Object> payload) {
        log.info("Webhook event received: {}", payload);

        try {
            // Parse webhook payload
            String object = (String) payload.get("object");

            if ("instagram".equals(object) || "page".equals(object)) {
                // Process entries
                if (payload.containsKey("entry")) {
                    java.util.List<Map<String, Object>> entries =
                        (java.util.List<Map<String, Object>>) payload.get("entry");

                    for (Map<String, Object> entry : entries) {
                        processEntry(entry);
                    }
                }
            }

            // Always return 200 OK to acknowledge receipt
            return ResponseEntity.ok("EVENT_RECEIVED");

        } catch (Exception e) {
            log.error("Error processing webhook: {}", e.getMessage(), e);
            // Still return 200 to avoid retries
            return ResponseEntity.ok("EVENT_RECEIVED");
        }
    }

    /**
     * Process a single webhook entry.
     */
    private void processEntry(Map<String, Object> entry) {
        try {
            String id = (String) entry.get("id");
            Long time = (Long) entry.get("time");

            log.debug("Processing entry: {} at {}", id, time);

            // Process changes
            if (entry.containsKey("changes")) {
                java.util.List<Map<String, Object>> changes =
                    (java.util.List<Map<String, Object>>) entry.get("changes");

                for (Map<String, Object> change : changes) {
                    processChange(change);
                }
            }

        } catch (Exception e) {
            log.error("Error processing entry: {}", e.getMessage(), e);
        }
    }

    /**
     * Process a single change event.
     */
    private void processChange(Map<String, Object> change) {
        try {
            String field = (String) change.get("field");
            Map<String, Object> value = (Map<String, Object>) change.get("value");

            log.debug("Processing change - Field: {}, Value: {}", field, value);

            switch (field) {
                case "comments":
                    handleCommentEvent(value);
                    break;

                case "likes":
                    handleLikeEvent(value);
                    break;

                case "shares":
                    handleShareEvent(value);
                    break;

                case "reactions":
                    handleReactionEvent(value);
                    break;

                case "feed":
                    handleFeedEvent(value);
                    break;

                default:
                    log.debug("Unhandled field type: {}", field);
            }

        } catch (Exception e) {
            log.error("Error processing change: {}", e.getMessage(), e);
        }
    }

    /**
     * Handle comment events.
     */
    private void handleCommentEvent(Map<String, Object> value) {
        log.info("Comment event received: {}", value);
        // TODO: Update post comment count in database
        // You would need to:
        // 1. Extract post ID from value
        // 2. Find corresponding Post entity
        // 3. Update comment count
        // 4. Save to database
    }

    /**
     * Handle like events.
     */
    private void handleLikeEvent(Map<String, Object> value) {
        log.info("Like event received: {}", value);
        // TODO: Update post like count in database
    }

    /**
     * Handle share events.
     */
    private void handleShareEvent(Map<String, Object> value) {
        log.info("Share event received: {}", value);
        // TODO: Update post share count in database
    }

    /**
     * Handle reaction events.
     */
    private void handleReactionEvent(Map<String, Object> value) {
        log.info("Reaction event received: {}", value);
        // TODO: Update post reaction count in database
    }

    /**
     * Handle feed events (post published, deleted, etc).
     */
    private void handleFeedEvent(Map<String, Object> value) {
        log.info("Feed event received: {}", value);
        // TODO: Handle post lifecycle events
    }
}
