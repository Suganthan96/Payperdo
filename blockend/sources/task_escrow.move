/// TaskEscrow Contract
/// Purpose: Holds funds safely until task is verified
/// 
/// This module manages the escrow of funds for task completions,
/// handles user submissions, and releases payments upon verification.
/// Uses a resource account to hold and automatically transfer funds.
module payperdo::task_escrow {
    use std::signer;
    use std::string::String;
    use std::vector;
    use aptos_framework::event;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use aptos_framework::account::{Self, SignerCapability};
    use aptos_std::table::{Self, Table};

    // ==================== Error Codes ====================
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_TASK_NOT_FOUND: u64 = 3;
    const E_INSUFFICIENT_FUNDS: u64 = 4;
    const E_TASK_ALREADY_ACCEPTED: u64 = 5;
    const E_NO_SLOTS_AVAILABLE: u64 = 6;
    const E_NOT_TASK_PARTICIPANT: u64 = 7;
    const E_ALREADY_SUBMITTED: u64 = 8;
    const E_NOT_AUTHORIZED: u64 = 9;
    const E_ALREADY_PAID: u64 = 10;
    const E_NOT_VERIFIED: u64 = 11;
    const E_TASK_NOT_ACTIVE: u64 = 12;

    // ==================== Constants ====================
    const PLATFORM_FEE_PERCENT: u64 = 8; // 8% platform fee
    const ESCROW_SEED: vector<u8> = b"payperdo_escrow";
    
    // Submission status
    const STATUS_PENDING: u8 = 0;
    const STATUS_APPROVED: u8 = 1;
    const STATUS_REJECTED: u8 = 2;
    const STATUS_PAID: u8 = 3;

    // ==================== Structs ====================
    
    /// User's task submission
    struct Submission has store, copy, drop {
        user: address,
        task_id: u64,
        proof_data: String,  // IPFS hash or proof URL
        submitted_at: u64,
        status: u8,
        verified_at: u64,
    }

    /// Escrow for a specific task - holds actual coins
    struct TaskEscrowVault has store {
        task_id: u64,
        business: address,
        reward_amount: u64,
        platform_fee: u64,
        total_deposit: u64,
        slots_total: u64,
        slots_available: u64,
        slots_completed: u64,
        coins: Coin<AptosCoin>,  // Actual coins held in escrow
        is_active: bool,
        submissions: Table<address, Submission>,
        participants: vector<address>,
    }

    /// Global escrow registry with resource account capability
    struct EscrowRegistry has key {
        escrows: Table<u64, TaskEscrowVault>,
        platform_address: address,
        total_fees_collected: u64,
        signer_cap: SignerCapability,  // Capability to sign transactions
        resource_address: address,      // Address of resource account
    }

    /// User's accepted tasks tracker
    struct UserTasks has key {
        accepted_task_ids: vector<u64>,
        completed_task_ids: vector<u64>,
        total_earned: u64,
    }

    // ==================== Events ====================
    
    #[event]
    struct FundsDepositedEvent has drop, store {
        task_id: u64,
        business: address,
        amount: u64,
        deposited_at: u64,
    }

    #[event]
    struct TaskAcceptedEvent has drop, store {
        task_id: u64,
        user: address,
        accepted_at: u64,
    }

    #[event]
    struct ProofSubmittedEvent has drop, store {
        task_id: u64,
        user: address,
        proof_data: String,
        submitted_at: u64,
    }

    #[event]
    struct PaymentReleasedEvent has drop, store {
        task_id: u64,
        user: address,
        reward_amount: u64,
        platform_fee: u64,
        released_at: u64,
    }

    #[event]
    struct RefundIssuedEvent has drop, store {
        task_id: u64,
        business: address,
        amount: u64,
        refunded_at: u64,
    }

    // ==================== Initialization ====================
    
    /// Initialize the escrow registry with a resource account
    /// The resource account will hold all escrowed funds
    public entry fun initialize(admin: &signer, platform_address: address) {
        let admin_addr = signer::address_of(admin);
        
        assert!(!exists<EscrowRegistry>(admin_addr), E_ALREADY_INITIALIZED);
        
        // Create a resource account to hold escrow funds
        let (resource_signer, signer_cap) = account::create_resource_account(admin, ESCROW_SEED);
        let resource_address = signer::address_of(&resource_signer);
        
        // Register the resource account to receive AptosCoin
        coin::register<AptosCoin>(&resource_signer);
        
        move_to(admin, EscrowRegistry {
            escrows: table::new(),
            platform_address,
            total_fees_collected: 0,
            signer_cap,
            resource_address,
        });
    }

    /// Initialize user tasks tracker
    public entry fun initialize_user(user: &signer) {
        let user_addr = signer::address_of(user);
        
        if (!exists<UserTasks>(user_addr)) {
            move_to(user, UserTasks {
                accepted_task_ids: vector::empty(),
                completed_task_ids: vector::empty(),
                total_earned: 0,
            });
        };
    }

    // ==================== Business Functions ====================
    
    /// Deposit funds for a task escrow
    /// Business locks (reward + fee) * slots amount
    public entry fun deposit_funds(
        business: &signer,
        registry_addr: address,
        task_id: u64,
        reward_amount: u64,
        slots: u64,
    ) acquires EscrowRegistry {
        let business_addr = signer::address_of(business);
        
        assert!(exists<EscrowRegistry>(registry_addr), E_NOT_INITIALIZED);
        
        // Calculate amounts
        let platform_fee = (reward_amount * PLATFORM_FEE_PERCENT) / 100;
        let deposit_per_slot = reward_amount + platform_fee;
        let total_deposit = deposit_per_slot * slots;
        
        // Withdraw coins from business account
        let coins = coin::withdraw<AptosCoin>(business, total_deposit);
        
        let registry = borrow_global_mut<EscrowRegistry>(registry_addr);
        
        // Create escrow entry with actual coins
        let escrow = TaskEscrowVault {
            task_id,
            business: business_addr,
            reward_amount,
            platform_fee,
            total_deposit,
            slots_total: slots,
            slots_available: slots,
            slots_completed: 0,
            coins,  // Store the actual coins
            is_active: true,
            submissions: table::new(),
            participants: vector::empty(),
        };
        
        table::add(&mut registry.escrows, task_id, escrow);
        
        event::emit(FundsDepositedEvent {
            task_id,
            business: business_addr,
            amount: total_deposit,
            deposited_at: timestamp::now_seconds(),
        });
    }

    /// Refund remaining funds to business (for cancelled/completed tasks)
    public entry fun refund_remaining(
        business: &signer,
        registry_addr: address,
        task_id: u64,
    ) acquires EscrowRegistry {
        let business_addr = signer::address_of(business);
        
        assert!(exists<EscrowRegistry>(registry_addr), E_NOT_INITIALIZED);
        
        let registry = borrow_global_mut<EscrowRegistry>(registry_addr);
        
        assert!(table::contains(&registry.escrows, task_id), E_TASK_NOT_FOUND);
        
        let escrow = table::borrow_mut(&mut registry.escrows, task_id);
        
        assert!(escrow.business == business_addr, E_NOT_AUTHORIZED);
        assert!(!escrow.is_active, E_TASK_NOT_ACTIVE); // Can only refund inactive tasks
        
        let remaining = coin::value(&escrow.coins);
        
        if (remaining > 0) {
            let refund_coins = coin::extract(&mut escrow.coins, remaining);
            coin::deposit(business_addr, refund_coins);
            
            event::emit(RefundIssuedEvent {
                task_id,
                business: business_addr,
                amount: remaining,
                refunded_at: timestamp::now_seconds(),
            });
        };
    }

    // ==================== User Functions ====================
    
    /// Accept a task (reserve a slot)
    public entry fun accept_task(
        user: &signer,
        registry_addr: address,
        task_id: u64,
    ) acquires EscrowRegistry, UserTasks {
        let user_addr = signer::address_of(user);
        
        assert!(exists<EscrowRegistry>(registry_addr), E_NOT_INITIALIZED);
        
        // Initialize user if not already
        if (!exists<UserTasks>(user_addr)) {
            move_to(user, UserTasks {
                accepted_task_ids: vector::empty(),
                completed_task_ids: vector::empty(),
                total_earned: 0,
            });
        };
        
        let registry = borrow_global_mut<EscrowRegistry>(registry_addr);
        
        assert!(table::contains(&registry.escrows, task_id), E_TASK_NOT_FOUND);
        
        let escrow = table::borrow_mut(&mut registry.escrows, task_id);
        
        assert!(escrow.is_active, E_TASK_NOT_ACTIVE);
        assert!(escrow.slots_available > 0, E_NO_SLOTS_AVAILABLE);
        assert!(!table::contains(&escrow.submissions, user_addr), E_TASK_ALREADY_ACCEPTED);
        
        // Create pending submission
        let submission = Submission {
            user: user_addr,
            task_id,
            proof_data: std::string::utf8(b""),
            submitted_at: 0,
            status: STATUS_PENDING,
            verified_at: 0,
        };
        
        table::add(&mut escrow.submissions, user_addr, submission);
        vector::push_back(&mut escrow.participants, user_addr);
        escrow.slots_available = escrow.slots_available - 1;
        
        // Track in user's tasks
        let user_tasks = borrow_global_mut<UserTasks>(user_addr);
        vector::push_back(&mut user_tasks.accepted_task_ids, task_id);
        
        event::emit(TaskAcceptedEvent {
            task_id,
            user: user_addr,
            accepted_at: timestamp::now_seconds(),
        });
    }

    /// Submit proof of task completion
    public entry fun submit_proof(
        user: &signer,
        registry_addr: address,
        task_id: u64,
        proof_data: String,
    ) acquires EscrowRegistry {
        let user_addr = signer::address_of(user);
        
        assert!(exists<EscrowRegistry>(registry_addr), E_NOT_INITIALIZED);
        
        let registry = borrow_global_mut<EscrowRegistry>(registry_addr);
        
        assert!(table::contains(&registry.escrows, task_id), E_TASK_NOT_FOUND);
        
        let escrow = table::borrow_mut(&mut registry.escrows, task_id);
        
        assert!(table::contains(&escrow.submissions, user_addr), E_NOT_TASK_PARTICIPANT);
        
        let submission = table::borrow_mut(&mut escrow.submissions, user_addr);
        
        assert!(submission.status == STATUS_PENDING, E_ALREADY_SUBMITTED);
        
        submission.proof_data = proof_data;
        submission.submitted_at = timestamp::now_seconds();
        
        event::emit(ProofSubmittedEvent {
            task_id,
            user: user_addr,
            proof_data,
            submitted_at: submission.submitted_at,
        });
    }

    // ==================== Payment Functions ====================

    /// Release payment to user - AUTOMATICALLY transfers coins
    /// Called by verification contract after AI approval
    public fun release_payment(
        registry_addr: address,
        task_id: u64,
        user_addr: address,
    ) acquires EscrowRegistry, UserTasks {
        assert!(exists<EscrowRegistry>(registry_addr), E_NOT_INITIALIZED);
        
        let registry = borrow_global_mut<EscrowRegistry>(registry_addr);
        
        assert!(table::contains(&registry.escrows, task_id), E_TASK_NOT_FOUND);
        
        let platform_address = registry.platform_address;
        let escrow = table::borrow_mut(&mut registry.escrows, task_id);
        
        assert!(table::contains(&escrow.submissions, user_addr), E_NOT_TASK_PARTICIPANT);
        
        let submission = table::borrow_mut(&mut escrow.submissions, user_addr);
        
        assert!(submission.status == STATUS_APPROVED, E_NOT_VERIFIED);
        
        // Calculate payment amounts
        let reward = escrow.reward_amount;
        let fee = escrow.platform_fee;
        let total_payment = reward + fee;
        
        assert!(coin::value(&escrow.coins) >= total_payment, E_INSUFFICIENT_FUNDS);
        
        // Extract reward coins and send to user
        let reward_coins = coin::extract(&mut escrow.coins, reward);
        coin::deposit(user_addr, reward_coins);
        
        // Extract fee coins and send to platform
        let fee_coins = coin::extract(&mut escrow.coins, fee);
        coin::deposit(platform_address, fee_coins);
        
        // Update escrow state
        escrow.slots_completed = escrow.slots_completed + 1;
        
        // Update submission status to PAID
        submission.status = STATUS_PAID;
        
        // Update platform fees collected
        registry.total_fees_collected = registry.total_fees_collected + fee;
        
        // Update user earnings
        if (exists<UserTasks>(user_addr)) {
            let user_tasks = borrow_global_mut<UserTasks>(user_addr);
            vector::push_back(&mut user_tasks.completed_task_ids, task_id);
            user_tasks.total_earned = user_tasks.total_earned + reward;
        };
        
        // Deactivate if all slots completed
        if (escrow.slots_completed == escrow.slots_total) {
            escrow.is_active = false;
        };
        
        event::emit(PaymentReleasedEvent {
            task_id,
            user: user_addr,
            reward_amount: reward,
            platform_fee: fee,
            released_at: timestamp::now_seconds(),
        });
    }

    /// Update submission status (called by verification contract)
    public fun update_submission_status(
        registry_addr: address,
        task_id: u64,
        user_addr: address,
        new_status: u8,
    ) acquires EscrowRegistry {
        let registry = borrow_global_mut<EscrowRegistry>(registry_addr);
        let escrow = table::borrow_mut(&mut registry.escrows, task_id);
        let submission = table::borrow_mut(&mut escrow.submissions, user_addr);
        
        submission.status = new_status;
        submission.verified_at = timestamp::now_seconds();
    }

    // ==================== View Functions ====================
    
    #[view]
    /// Get escrow balance for a task
    public fun get_escrow_balance(registry_addr: address, task_id: u64): u64 acquires EscrowRegistry {
        let registry = borrow_global<EscrowRegistry>(registry_addr);
        let escrow = table::borrow(&registry.escrows, task_id);
        coin::value(&escrow.coins)
    }

    #[view]
    /// Get submission status for a user
    public fun get_submission_status(registry_addr: address, task_id: u64, user_addr: address): u8 acquires EscrowRegistry {
        let registry = borrow_global<EscrowRegistry>(registry_addr);
        let escrow = table::borrow(&registry.escrows, task_id);
        let submission = table::borrow(&escrow.submissions, user_addr);
        submission.status
    }

    #[view]
    /// Get user's total earnings
    public fun get_user_earnings(user_addr: address): u64 acquires UserTasks {
        if (!exists<UserTasks>(user_addr)) {
            return 0
        };
        let user_tasks = borrow_global<UserTasks>(user_addr);
        user_tasks.total_earned
    }

    #[view]
    /// Get user's completed task count
    public fun get_user_completed_count(user_addr: address): u64 acquires UserTasks {
        if (!exists<UserTasks>(user_addr)) {
            return 0
        };
        let user_tasks = borrow_global<UserTasks>(user_addr);
        vector::length(&user_tasks.completed_task_ids)
    }

    #[view]
    /// Get available slots for a task
    public fun get_available_slots(registry_addr: address, task_id: u64): u64 acquires EscrowRegistry {
        let registry = borrow_global<EscrowRegistry>(registry_addr);
        let escrow = table::borrow(&registry.escrows, task_id);
        escrow.slots_available
    }

    #[view]
    /// Get platform fees collected
    public fun get_total_fees_collected(registry_addr: address): u64 acquires EscrowRegistry {
        let registry = borrow_global<EscrowRegistry>(registry_addr);
        registry.total_fees_collected
    }

    #[view]
    /// Get resource account address (where funds are held)
    public fun get_escrow_resource_address(registry_addr: address): address acquires EscrowRegistry {
        let registry = borrow_global<EscrowRegistry>(registry_addr);
        registry.resource_address
    }

    #[view]
    /// Get escrow details for a task
    public fun get_escrow_info(registry_addr: address, task_id: u64): (address, u64, u64, u64, u64, bool) acquires EscrowRegistry {
        let registry = borrow_global<EscrowRegistry>(registry_addr);
        let escrow = table::borrow(&registry.escrows, task_id);
        (
            escrow.business,
            escrow.reward_amount,
            escrow.slots_total,
            escrow.slots_available,
            escrow.slots_completed,
            escrow.is_active
        )
    }

    // ==================== Helper Constants ====================
    
    public fun status_pending(): u8 { STATUS_PENDING }
    public fun status_approved(): u8 { STATUS_APPROVED }
    public fun status_rejected(): u8 { STATUS_REJECTED }
    public fun status_paid(): u8 { STATUS_PAID }
}
