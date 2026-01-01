/// TaskFactory Contract
/// Purpose: Creates new tasks and manages lifecycle
/// 
/// This module handles the creation of tasks by businesses and maintains
/// a registry of all active tasks that consumers can browse and accept.
module payperdo::task_factory {
    use std::signer;
    use std::string::String;
    use std::vector;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};

    // ==================== Error Codes ====================
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_INVALID_REWARD: u64 = 3;
    const E_INVALID_QUANTITY: u64 = 4;
    const E_TASK_NOT_FOUND: u64 = 5;
    const E_NOT_AUTHORIZED: u64 = 6;

    // ==================== Constants ====================
    const PLATFORM_FEE_PERCENT: u64 = 8; // 8% platform fee

    // ==================== Structs ====================
    
    /// Task metadata stored in the factory
    struct Task has store, copy, drop {
        task_id: u64,
        business: address,
        title: String,
        description: String,
        task_type: String,  // "photo", "location", "social", "survey"
        reward_amount: u64, // Reward per task in MOV (smallest unit)
        total_slots: u64,
        available_slots: u64,
        total_deposit: u64, // Total funds locked (reward + fee) * slots
        location: String,
        created_at: u64,
        is_active: bool,
    }

    /// Global task registry
    struct TaskRegistry has key {
        tasks: Table<u64, Task>,
        task_count: u64,
        active_task_ids: vector<u64>,
    }

    // ==================== Events ====================
    
    #[event]
    struct TaskCreatedEvent has drop, store {
        task_id: u64,
        business: address,
        title: String,
        reward_amount: u64,
        total_slots: u64,
        total_deposit: u64,
        created_at: u64,
    }

    #[event]
    struct TaskDeactivatedEvent has drop, store {
        task_id: u64,
        business: address,
        deactivated_at: u64,
    }

    // ==================== Initialization ====================
    
    /// Initialize the task registry (called once by admin)
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        assert!(!exists<TaskRegistry>(admin_addr), E_ALREADY_INITIALIZED);
        
        move_to(admin, TaskRegistry {
            tasks: table::new(),
            task_count: 0,
            active_task_ids: vector::empty(),
        });
    }

    // ==================== Public Functions ====================
    
    /// Create a new task campaign
    /// - reward: Reward amount per task completion (in MOV smallest unit)
    /// - quantity: Number of task slots available
    /// - Returns: task_id
    public entry fun create_task(
        business: &signer,
        registry_addr: address,
        title: String,
        description: String,
        task_type: String,
        reward_amount: u64,
        quantity: u64,
        location: String,
    ) acquires TaskRegistry {
        let business_addr = signer::address_of(business);
        
        // Validations
        assert!(exists<TaskRegistry>(registry_addr), E_NOT_INITIALIZED);
        assert!(reward_amount > 0, E_INVALID_REWARD);
        assert!(quantity > 0, E_INVALID_QUANTITY);
        
        let registry = borrow_global_mut<TaskRegistry>(registry_addr);
        
        // Calculate total deposit (reward + 8% platform fee) * quantity
        let fee_per_task = (reward_amount * PLATFORM_FEE_PERCENT) / 100;
        let deposit_per_task = reward_amount + fee_per_task;
        let total_deposit = deposit_per_task * quantity;
        
        // Create task
        let task_id = registry.task_count + 1;
        let created_at = timestamp::now_seconds();
        
        let task = Task {
            task_id,
            business: business_addr,
            title,
            description,
            task_type,
            reward_amount,
            total_slots: quantity,
            available_slots: quantity,
            total_deposit,
            location,
            created_at,
            is_active: true,
        };
        
        // Store task
        table::add(&mut registry.tasks, task_id, task);
        vector::push_back(&mut registry.active_task_ids, task_id);
        registry.task_count = task_id;
        
        // Emit event
        event::emit(TaskCreatedEvent {
            task_id,
            business: business_addr,
            title: task.title,
            reward_amount,
            total_slots: quantity,
            total_deposit,
            created_at,
        });
    }

    /// Deactivate a task (only business owner can do this)
    public entry fun deactivate_task(
        business: &signer,
        registry_addr: address,
        task_id: u64,
    ) acquires TaskRegistry {
        let business_addr = signer::address_of(business);
        
        assert!(exists<TaskRegistry>(registry_addr), E_NOT_INITIALIZED);
        
        let registry = borrow_global_mut<TaskRegistry>(registry_addr);
        
        assert!(table::contains(&registry.tasks, task_id), E_TASK_NOT_FOUND);
        
        let task = table::borrow_mut(&mut registry.tasks, task_id);
        
        assert!(task.business == business_addr, E_NOT_AUTHORIZED);
        
        task.is_active = false;
        
        // Remove from active list
        let (found, index) = vector::index_of(&registry.active_task_ids, &task_id);
        if (found) {
            vector::remove(&mut registry.active_task_ids, index);
        };
        
        event::emit(TaskDeactivatedEvent {
            task_id,
            business: business_addr,
            deactivated_at: timestamp::now_seconds(),
        });
    }

    /// Decrease available slots when a user accepts a task
    public fun decrease_available_slots(
        registry_addr: address,
        task_id: u64,
    ) acquires TaskRegistry {
        let registry = borrow_global_mut<TaskRegistry>(registry_addr);
        let task = table::borrow_mut(&mut registry.tasks, task_id);
        
        if (task.available_slots > 0) {
            task.available_slots = task.available_slots - 1;
        };
        
        // Deactivate if no more slots
        if (task.available_slots == 0) {
            task.is_active = false;
            let (found, index) = vector::index_of(&registry.active_task_ids, &task_id);
            if (found) {
                vector::remove(&mut registry.active_task_ids, index);
            };
        };
    }

    // ==================== View Functions ====================
    
    #[view]
    /// Get task details by ID
    public fun get_task(registry_addr: address, task_id: u64): Task acquires TaskRegistry {
        let registry = borrow_global<TaskRegistry>(registry_addr);
        assert!(table::contains(&registry.tasks, task_id), E_TASK_NOT_FOUND);
        *table::borrow(&registry.tasks, task_id)
    }

    #[view]
    /// Get all active task IDs
    public fun get_active_task_ids(registry_addr: address): vector<u64> acquires TaskRegistry {
        let registry = borrow_global<TaskRegistry>(registry_addr);
        registry.active_task_ids
    }

    #[view]
    /// Get total task count
    public fun get_task_count(registry_addr: address): u64 acquires TaskRegistry {
        let registry = borrow_global<TaskRegistry>(registry_addr);
        registry.task_count
    }

    #[view]
    /// Get platform fee percentage
    public fun get_platform_fee_percent(): u64 {
        PLATFORM_FEE_PERCENT
    }

    #[view]
    /// Calculate total deposit required for a task
    public fun calculate_total_deposit(reward_amount: u64, quantity: u64): u64 {
        let fee_per_task = (reward_amount * PLATFORM_FEE_PERCENT) / 100;
        let deposit_per_task = reward_amount + fee_per_task;
        deposit_per_task * quantity
    }
}
