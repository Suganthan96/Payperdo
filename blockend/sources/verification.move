/// Verification Contract
/// Purpose: Receives AI verdict and triggers payment
/// 
/// This module handles the verification of task submissions by the AI backend
/// and triggers payment release upon approval.
module payperdo::verification {
    use std::signer;
    use std::vector;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};
    use payperdo::task_escrow;

    // ==================== Error Codes ====================
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_NOT_AUTHORIZED: u64 = 3;
    const E_ALREADY_VERIFIED: u64 = 4;
    const E_VERIFICATION_NOT_FOUND: u64 = 5;

    // ==================== Structs ====================
    
    /// Verification record
    struct VerificationRecord has store, copy, drop {
        task_id: u64,
        user: address,
        approved: bool,
        confidence_score: u64,  // AI confidence 0-100
        verified_by: address,   // Backend verifier address
        verified_at: u64,
        reason: vector<u8>,     // Reason for rejection if applicable
    }

    /// Verification registry
    struct VerificationRegistry has key {
        records: Table<vector<u8>, VerificationRecord>,  // key: task_id + user_addr
        authorized_verifiers: vector<address>,
        total_verifications: u64,
        total_approved: u64,
        total_rejected: u64,
        escrow_registry_addr: address,
    }

    // ==================== Events ====================
    
    #[event]
    struct VerdictRecordedEvent has drop, store {
        task_id: u64,
        user: address,
        approved: bool,
        confidence_score: u64,
        verified_by: address,
        verified_at: u64,
    }

    #[event]
    struct VerifierAddedEvent has drop, store {
        verifier: address,
        added_by: address,
        added_at: u64,
    }

    #[event]
    struct VerifierRemovedEvent has drop, store {
        verifier: address,
        removed_by: address,
        removed_at: u64,
    }

    // ==================== Initialization ====================
    
    /// Initialize the verification registry (called once by admin)
    public entry fun initialize(
        admin: &signer,
        escrow_registry_addr: address,
    ) {
        let admin_addr = signer::address_of(admin);
        
        assert!(!exists<VerificationRegistry>(admin_addr), E_ALREADY_INITIALIZED);
        
        // Admin is the first authorized verifier
        let verifiers = vector::empty<address>();
        vector::push_back(&mut verifiers, admin_addr);
        
        move_to(admin, VerificationRegistry {
            records: table::new(),
            authorized_verifiers: verifiers,
            total_verifications: 0,
            total_approved: 0,
            total_rejected: 0,
            escrow_registry_addr,
        });
    }

    // ==================== Admin Functions ====================
    
    /// Add an authorized verifier (AI backend address)
    public entry fun add_verifier(
        admin: &signer,
        registry_addr: address,
        verifier: address,
    ) acquires VerificationRegistry {
        let admin_addr = signer::address_of(admin);
        
        assert!(exists<VerificationRegistry>(registry_addr), E_NOT_INITIALIZED);
        
        let registry = borrow_global_mut<VerificationRegistry>(registry_addr);
        
        // Check if admin is authorized
        assert!(vector::contains(&registry.authorized_verifiers, &admin_addr), E_NOT_AUTHORIZED);
        
        // Add verifier if not already added
        if (!vector::contains(&registry.authorized_verifiers, &verifier)) {
            vector::push_back(&mut registry.authorized_verifiers, verifier);
            
            event::emit(VerifierAddedEvent {
                verifier,
                added_by: admin_addr,
                added_at: timestamp::now_seconds(),
            });
        };
    }

    /// Remove an authorized verifier
    public entry fun remove_verifier(
        admin: &signer,
        registry_addr: address,
        verifier: address,
    ) acquires VerificationRegistry {
        let admin_addr = signer::address_of(admin);
        
        assert!(exists<VerificationRegistry>(registry_addr), E_NOT_INITIALIZED);
        
        let registry = borrow_global_mut<VerificationRegistry>(registry_addr);
        
        // Check if admin is authorized
        assert!(vector::contains(&registry.authorized_verifiers, &admin_addr), E_NOT_AUTHORIZED);
        
        let (found, index) = vector::index_of(&registry.authorized_verifiers, &verifier);
        if (found) {
            vector::remove(&mut registry.authorized_verifiers, index);
            
            event::emit(VerifierRemovedEvent {
                verifier,
                removed_by: admin_addr,
                removed_at: timestamp::now_seconds(),
            });
        };
    }

    // ==================== Verification Functions ====================
    
    /// Record AI verdict for a task submission
    /// - Called by authorized AI backend
    /// - If approved = true, triggers payment release
    public entry fun record_verdict(
        verifier: &signer,
        registry_addr: address,
        task_id: u64,
        user: address,
        approved: bool,
        confidence_score: u64,
        reason: vector<u8>,
    ) acquires VerificationRegistry {
        let verifier_addr = signer::address_of(verifier);
        
        assert!(exists<VerificationRegistry>(registry_addr), E_NOT_INITIALIZED);
        
        let registry = borrow_global_mut<VerificationRegistry>(registry_addr);
        
        // Check if verifier is authorized
        assert!(vector::contains(&registry.authorized_verifiers, &verifier_addr), E_NOT_AUTHORIZED);
        
        // Create verification key (task_id + user)
        let key = create_verification_key(task_id, user);
        
        // Check if already verified
        assert!(!table::contains(&registry.records, key), E_ALREADY_VERIFIED);
        
        let verified_at = timestamp::now_seconds();
        
        // Create verification record
        let record = VerificationRecord {
            task_id,
            user,
            approved,
            confidence_score,
            verified_by: verifier_addr,
            verified_at,
            reason,
        };
        
        table::add(&mut registry.records, key, record);
        
        // Update stats
        registry.total_verifications = registry.total_verifications + 1;
        if (approved) {
            registry.total_approved = registry.total_approved + 1;
            
            // Update escrow submission status to APPROVED
            task_escrow::update_submission_status(
                registry.escrow_registry_addr,
                task_id,
                user,
                task_escrow::status_approved(),
            );
            
            // Trigger payment release
            task_escrow::release_payment(
                registry.escrow_registry_addr,
                task_id,
                user,
            );
        } else {
            registry.total_rejected = registry.total_rejected + 1;
            
            // Update escrow submission status to REJECTED
            task_escrow::update_submission_status(
                registry.escrow_registry_addr,
                task_id,
                user,
                task_escrow::status_rejected(),
            );
        };
        
        event::emit(VerdictRecordedEvent {
            task_id,
            user,
            approved,
            confidence_score,
            verified_by: verifier_addr,
            verified_at,
        });
    }

    // ==================== View Functions ====================
    
    #[view]
    /// Get verification status for a task submission
    public fun get_verification_status(
        registry_addr: address,
        task_id: u64,
        user: address,
    ): (bool, bool, u64) acquires VerificationRegistry {
        let registry = borrow_global<VerificationRegistry>(registry_addr);
        let key = create_verification_key(task_id, user);
        
        if (!table::contains(&registry.records, key)) {
            // Not verified yet: (exists, approved, confidence)
            return (false, false, 0)
        };
        
        let record = table::borrow(&registry.records, key);
        (true, record.approved, record.confidence_score)
    }

    #[view]
    /// Get verification record details
    public fun get_verification_record(
        registry_addr: address,
        task_id: u64,
        user: address,
    ): VerificationRecord acquires VerificationRegistry {
        let registry = borrow_global<VerificationRegistry>(registry_addr);
        let key = create_verification_key(task_id, user);
        
        assert!(table::contains(&registry.records, key), E_VERIFICATION_NOT_FOUND);
        
        *table::borrow(&registry.records, key)
    }

    #[view]
    /// Check if an address is an authorized verifier
    public fun is_authorized_verifier(
        registry_addr: address,
        verifier: address,
    ): bool acquires VerificationRegistry {
        let registry = borrow_global<VerificationRegistry>(registry_addr);
        vector::contains(&registry.authorized_verifiers, &verifier)
    }

    #[view]
    /// Get total verification stats
    public fun get_verification_stats(
        registry_addr: address,
    ): (u64, u64, u64) acquires VerificationRegistry {
        let registry = borrow_global<VerificationRegistry>(registry_addr);
        (registry.total_verifications, registry.total_approved, registry.total_rejected)
    }

    // ==================== Helper Functions ====================
    
    /// Create a unique key from task_id and user address
    fun create_verification_key(task_id: u64, user: address): vector<u8> {
        let key = std::bcs::to_bytes(&task_id);
        let user_bytes = std::bcs::to_bytes(&user);
        vector::append(&mut key, user_bytes);
        key
    }
}
