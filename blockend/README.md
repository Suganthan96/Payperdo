# Payperdo Smart Contracts

Move smart contracts for the Payperdo platform on Movement Network.

## Overview

Payperdo is a task-based reward platform where businesses create tasks and consumers complete them to earn MOV tokens.

## Contract Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TaskFactory                                 │
│  • createTask(reward, requirements, quantity)                   │
│  • listActiveTasks()                                            │
│  • deactivateTask()                                             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TaskEscrow                                  │
│  • depositFunds() - Business locks funds                        │
│  • acceptTask() - User reserves slot                            │
│  • submitProof() - User submits completion proof                │
│  • releasePayment() - Called by Verification                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Verification                                │
│  • recordVerdict() - AI backend submits verdict                 │
│  • getVerificationStatus() - Check verification                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MOV Token                                   │
│  • Platform reward token                                        │
│  • 8% platform fee on all transactions                          │
└─────────────────────────────────────────────────────────────────┘
```

## Contracts

### 1. TaskFactory (`task_factory.move`)
Creates new tasks and manages their lifecycle.

**Functions:**
- `initialize(admin)` - Initialize the registry
- `create_task(business, title, description, type, reward, quantity, location)` - Create a new task
- `deactivate_task(business, task_id)` - Deactivate a task
- `get_task(task_id)` - Get task details
- `get_active_task_ids()` - List all active tasks

### 2. TaskEscrow (`task_escrow.move`)
Holds funds safely until task is verified.

**State:**
- `businessAddress` - Who created the task
- `rewardAmount` - Reward per completion
- `platformFee` - 8% fee
- `slotsAvailable` - Remaining slots
- `submissions` - User submissions

**Functions:**
- `deposit_funds(business, task_id, reward, slots)` - Lock funds
- `accept_task(user, task_id)` - Reserve a slot
- `submit_proof(user, task_id, proof_data)` - Submit completion
- `release_payment(task_id, user)` - Release funds (called by Verification)

### 3. Verification (`verification.move`)
Receives AI verdict and triggers payment.

**Functions:**
- `record_verdict(verifier, task_id, user, approved, confidence, reason)` - Submit AI verdict
- `get_verification_status(task_id, user)` - Check if verified
- `add_verifier(admin, verifier)` - Authorize AI backend
- `remove_verifier(admin, verifier)` - Remove authorization

### 4. MOV Token (`mov_token.move`)
Platform reward token.

**Functions:**
- `initialize(admin)` - Create the token
- `register(account)` - Register to receive tokens
- `mint(admin, to, amount)` - Mint tokens
- `burn(account, amount)` - Burn tokens
- `balance(account)` - Check balance

## Flow

### Task Creation (Business)
1. Business calls `task_factory::create_task()`
2. Business calls `task_escrow::deposit_funds()` to lock funds
3. Task appears in active tasks list

### Task Completion (Consumer)
1. Consumer browses `task_factory::get_active_task_ids()`
2. Consumer calls `task_escrow::accept_task()` to reserve slot
3. Consumer completes task and calls `task_escrow::submit_proof()`
4. AI backend verifies and calls `verification::record_verdict()`
5. If approved, payment is automatically released

### Payment Flow
```
Business deposits: ₹216 per slot (₹200 reward + ₹16 fee)
Total for 100 slots: ₹21,600

On approval:
├── ₹200 → User wallet
└── ₹16 → Platform wallet
```

## Development

### Prerequisites
- Rust & Cargo
- Aptos CLI (compatible with Movement)

### Build
```bash
cd blockend
aptos move compile
```

### Test
```bash
aptos move test
```

### Deploy to Movement Testnet
```bash
# Initialize account
aptos init --network custom --rest-url https://aptos.testnet.porto.movementlabs.xyz/v1

# Publish
aptos move publish --named-addresses payperdo=default
```

## Configuration

Update `Move.toml` with your deployed address:
```toml
[addresses]
payperdo = "0xYOUR_ADDRESS_HERE"
```

## Security Considerations

1. **Escrow Safety**: Funds are locked in escrow until verification
2. **Authorized Verifiers**: Only whitelisted AI backends can verify
3. **No Double Spend**: Each user can only complete a task once
4. **Slot Management**: Available slots decrease on acceptance

## License

MIT
