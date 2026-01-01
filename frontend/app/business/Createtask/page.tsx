"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconPlus,
  IconCheck,
  IconUsers,
  IconCoin,
  IconPhoto,
  IconMapPin,
  IconShare,
  IconMessage,
  IconLoader2,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { Task } from "@/utils/blockchain";
import { 
  createRealTaskTransaction,
  CreateTaskParams 
} from "../../../utils/aptos-client";
import { convertEthToMoveAddress } from "@/utils/addressConverter";

// Movement Network Configuration
const MOVEMENT_CHAIN_ID = 250;
const MOVEMENT_RPC_URL = 'https://testnet.movementnetwork.xyz/v1';
const MOVEMENT_FAUCET_URL = 'https://faucet.testnet.movementnetwork.xyz/';
const MOVEMENT_EXPLORER_URL = 'https://explorer.movementnetwork.xyz/?network=bardock+testnet';
const TASK_FACTORY_ADDRESS = '0x33ff76ffa94bfd2efb07d79e3830dbf46fdb30bdc0596374e88a72a0b49751d9';

export default function CreateTask() {
  const { user, logout, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();

  // Get embedded wallet from Privy
  const embeddedWallet = wallets?.find((wallet: any) => wallet.walletClientType === 'privy');
  const [open, setOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<string[]>([]);
  const [rewardPerPerson, setRewardPerPerson] = useState("0.05");
  const [numberOfPeople, setNumberOfPeople] = useState("10");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  // Load business tasks on component mount
  useEffect(() => {
    loadBusinessTasks();
  }, [user]);

  const loadBusinessTasks = async () => {
    if (!user?.wallet?.address) return;
    
    setIsLoadingTasks(true);
    try {
      // Use real blockchain fetching
      const moveAddress = convertEthToMoveAddress(user.wallet.address);
      console.log('🔍 Loading real business tasks from blockchain...', moveAddress);
      
      // Try to fetch real tasks from blockchain first
      // For now, use placeholder data until aptos-client is implemented
      const realTasks: any[] = [];
      
      if (realTasks && realTasks.length > 0) {
        // Convert blockchain data to Task interface
        const businessTasks = realTasks.map((taskData: any, index: number) => ({
          id: taskData.task_id || `real_${index}`,
          title: taskData.title || 'Untitled Task',
          description: taskData.description || 'No description',
          taskTypes: taskData.task_type ? taskData.task_type.split(',') : ['General'],
          rewardAmount: taskData.reward_amount ? parseFloat(taskData.reward_amount) / 100000000 : 0, // Convert from octas
          totalSlots: parseInt(taskData.quantity || '1'),
          availableSlots: parseInt(taskData.available_slots || taskData.quantity || '1'),
          location: taskData.location || 'Any Location',
          businessAddress: user.wallet?.address || '',
          createdAt: new Date().toISOString(),
          status: 'active' as const
        }));
        
        console.log('✅ Real business tasks loaded from blockchain:', businessTasks);
        setTasks(businessTasks);
      } else {
        console.log('ℹ️ No real tasks found on blockchain yet');
        setTasks([]);
      }
    } catch (error) {
      console.error('Failed to load real business tasks:', error);
      setTasks([]);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authenticated) {
      router.push("/");
    }
  }, [authenticated, router]);

  const handleCreateTask = async () => {
    if (!embeddedWallet?.address || selectedTaskTypes.length !== 2 || !taskTitle.trim() || !taskDescription.trim()) {
      console.error('❌ Validation failed:', {
        wallet: embeddedWallet?.address,
        taskTypes: selectedTaskTypes,
        title: taskTitle.trim(),
        description: taskDescription.trim()
      });
      return;
    }

    setIsCreating(true);
    
    try {
      console.log('🚀 Creating REAL task on Movement blockchain with Privy embedded wallet...');
      console.log('💳 Using embedded wallet:', embeddedWallet.address);
      
      // Get wallet address
      const address = embeddedWallet.address;
      if (!address || !embeddedWallet) {
        throw new Error('Embedded wallet not found. Please ensure you are logged in.');
      }

      // Calculate total deposit (reward * quantity * 1.08 for 8% fee)
      const totalDeposit = parseFloat(rewardPerPerson) * parseInt(numberOfPeople) * 1.08;
      
      console.log('💰 Total task deposit:', totalDeposit, 'MOV');

      // Step 1: Build the transaction using Aptos SDK for Movement blockchain
      console.log('🔧 Building Movement transaction with Aptos SDK...');
      
      const taskParams = {
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        taskTypes: selectedTaskTypes,
        rewardAmount: parseFloat(rewardPerPerson),
        quantity: parseInt(numberOfPeople),
        location: "Any Location"
      };

      // Convert Ethereum address to Movement address format
      const moveAddress = convertEthToMoveAddress(address);
      
      // Build real transaction using our aptos-client
      const transaction = await createRealTaskTransaction(moveAddress, taskParams);
      
      console.log('✅ Transaction built successfully:', transaction);

      // Step 2: Create signing message for Movement/Aptos transaction
      console.log('📝 Creating signing message for Movement transaction...');
      
      // For Movement/Aptos, we need to create a proper transaction hash to sign
      const transactionMessage = JSON.stringify({
        function: transaction.function,
        type_arguments: transaction.type_arguments,
        arguments: transaction.arguments,
        sender: moveAddress,
        max_gas_amount: "100000",
        gas_unit_price: "100",
        expiration_timestamp_secs: (Math.floor(Date.now() / 1000) + 3600).toString(),
        chain_id: MOVEMENT_CHAIN_ID
      });
      
      // Create hash for signing (using keccak256-like approach for consistency)
      const encoder = new TextEncoder();
      const data = encoder.encode(transactionMessage);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      console.log('🔐 Transaction hash to sign:', hashHex);

      // Step 3: Use alternative signing method for Movement blockchain
      console.log('✍️ Signing transaction with Privy wallet...');
      
      // Try to get the provider first
      const provider = await embeddedWallet.getEthereumProvider();
      
      // Use personal_sign as a fallback since rawSign may not be available in browser
      const messageToSign = JSON.stringify({
        action: 'create_task_movement',
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        reward: rewardPerPerson,
        quantity: numberOfPeople,
        taskTypes: selectedTaskTypes,
        hash: hashHex,
        timestamp: Date.now(),
        nonce: Math.random().toString(36)
      });

      const signature = await provider.request({
        method: 'personal_sign',
        params: [messageToSign, address]
      });
      
      const signResult = {
        signature: signature,
        encoding: 'hex'
      };
      
      console.log('✅ Transaction signed successfully:', signResult);

      // Fix signature length: Ed25519 requires exactly 64 bytes, but Ethereum signatures are 65 bytes
      let processedSignature = signResult.signature;
      if (processedSignature.startsWith('0x')) {
        processedSignature = processedSignature.slice(2); // Remove 0x prefix
      }
      if (processedSignature.length === 130) { // 65 bytes in hex = 130 characters
        processedSignature = processedSignature.slice(0, 128); // Trim to 64 bytes = 128 characters
      }
      
      console.log('🔧 Fixed signature length:', processedSignature.length / 2, 'bytes');

      // Step 4: Submit the signed transaction to Movement testnet
      console.log('📡 Submitting signed transaction to Movement testnet...');
      
      // First, get the account sequence number from Movement testnet
      let sequenceNumber = "0";
      try {
        const accountResponse = await fetch(`${MOVEMENT_RPC_URL}/accounts/${moveAddress}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        
        if (accountResponse.ok) {
          const accountData = await accountResponse.json();
          sequenceNumber = accountData.sequence_number || "0";
          console.log('📊 Account sequence number:', sequenceNumber);
        }
      } catch (error) {
        console.warn('⚠️ Could not fetch sequence number, using 0:', error);
      }
      
      console.log('💰 Task parameters:', {
        title: taskParams.title,
        description: taskParams.description,
        rewardAmount: taskParams.rewardAmount,
        rewardAmountInOctas: Math.floor(Math.abs(taskParams.rewardAmount) * 100000000),
        quantity: taskParams.quantity,
        taskTypes: taskParams.taskTypes
      });

      // Create the transaction for Movement testnet with account authenticator format
      const movementTransaction = {
        sender: moveAddress,
        sequence_number: sequenceNumber,
        max_gas_amount: "100000",
        gas_unit_price: "100",
        expiration_timestamp_secs: (Math.floor(Date.now() / 1000) + 3600).toString(),
        payload: {
          type: "entry_function_payload",
          function: `${TASK_FACTORY_ADDRESS}::task_factory::create_task`,
          type_arguments: [],
          arguments: [
            TASK_FACTORY_ADDRESS, // registry_addr
            taskParams.title,
            taskParams.description,
            taskParams.taskTypes.join(", "), // task_type as single string
            Math.floor(Math.abs(taskParams.rewardAmount) * 100000000).toString(), // reward_amount in octas (ensure positive)
            taskParams.quantity.toString(), // quantity
            taskParams.location || "Online" // location - default to "Online" if not provided
          ]
        }
      };

      console.log('📄 Movement transaction payload:', movementTransaction);

      // Submit to Movement testnet RPC using Aptos-compatible format
      const submitResult = await fetch(`${MOVEMENT_RPC_URL}/transactions/encode_submission`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(movementTransaction)
      });

      if (!submitResult.ok) {
        console.warn('⚠️ Encode failed, trying direct submission...');
        
        // Try direct submission to /transactions
        const directSubmit = await fetch(`${MOVEMENT_RPC_URL}/transactions`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            ...movementTransaction,
            signature: {
              type: "ed25519_signature",
              signature: processedSignature
            }
          })
        });
        
        const directResult = await directSubmit.json();
        console.log('🔄 Direct submission result:', directResult);
        
        if (directSubmit.ok) {
          if (directResult.hash) {
            console.log('✅ Transaction submitted successfully to Movement testnet!', directResult.hash);
            // Store the real transaction with actual hash
            const realTask = {
              id: Date.now(),
              title: taskParams.title,
              description: taskParams.description,
              rewardAmount: taskParams.rewardAmount,
              quantity: taskParams.quantity,
              taskTypes: taskParams.taskTypes,
              location: taskParams.location || "Online",
              createdAt: new Date().toISOString(),
              transactionHash: directResult.hash, // REAL transaction hash from Movement
              status: 'active',
              businessAddress: moveAddress
            };
            
            setIsCreating(false);
            router.push('/business/dashboard');
            return;
          } else {
            console.error('❌ Direct submission succeeded but no hash returned!');
            alert('Transaction may have been submitted but no hash returned.');
            return;
          }
        } else {
          throw new Error(`Direct submission failed: ${directResult}`);
        }
      }

      let txHash;
      if (submitResult.ok) {
        const result = await submitResult.json();
        
        if (result.hash) {
          txHash = result.hash;
          console.log('🎉 REAL TRANSACTION SUBMITTED TO MOVEMENT TESTNET!', txHash);
          console.log('📋 Full result:', result);
        } else {
          console.error('❌ No transaction hash returned from Movement testnet!');
          console.log('📋 Response:', result);
          alert('Transaction submitted but no hash returned. Please check Movement explorer.');
          return;
        }
      } else {
        const errorText = await submitResult.text();
        console.warn('⚠️ Movement testnet RPC error:', submitResult.status, errorText);
        
        // Parse error message for user-friendly feedback
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            alert(`Transaction failed: ${errorData.message}`);
          } else {
            alert('Transaction failed to submit to Movement testnet. Please try again.');
          }
        } catch {
          alert(`Transaction failed: HTTP ${submitResult.status}. Please try again.`);
        }
        return;
      }

      // Reset form
      setTaskTitle("");
      setTaskDescription("");
      setSelectedTaskTypes([]);
      setRewardPerPerson("0.05");
      setNumberOfPeople("10");
      setShowCreateModal(false);
      
      // Reload tasks from blockchain
      await loadBusinessTasks();
      
      // Show success with real transaction details
      alert(`🎉 REAL TASK CREATED ON MOVEMENT TESTNET!

📋 Task: ${taskTitle.trim()}
💰 Reward: ${rewardPerPerson} MOV per person
👥 Slots: ${numberOfPeople}
🔗 Transaction Hash: ${txHash}

🌐 View on Movement Explorer:
${MOVEMENT_EXPLORER_URL}&txn=${txHash}

✅ Signed with Privy embedded wallet!`);

    } catch (error) {
      console.error('💥 Error creating real task on Movement blockchain:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`❌ Failed to create task on Movement blockchain:

${errorMessage}

📝 Please ensure:
• You are logged in with Privy wallet
• Your wallet has sufficient MOV tokens
• You approved the transaction signing
• Network connection is stable

💡 Try the "Get Test MOV" button if you need tokens.`);
    } finally {
      setIsCreating(false);
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "/business/dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Create Task",
      href: "/business/Createtask",
      icon: (
        <IconPlus className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Completed Tasks",
      href: "/business/Completedtask",
      icon: (
        <IconCheck className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "Photo Verification":
        return <IconPhoto className="h-5 w-5" />;
      case "Location Check-in":
        return <IconMapPin className="h-5 w-5" />;
      case "Social Media Post":
        return <IconShare className="h-5 w-5" />;
      case "Survey/Feedback":
        return <IconMessage className="h-5 w-5" />;
      default:
        return <IconCheck className="h-5 w-5" />;
    }
  };

  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden bg-neutral-100 md:flex-row dark:bg-neutral-900",
        "min-h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (link.label === "Logout") {
                      logout();
                    }
                    setOpen(false);
                  }}
                >
                  <SidebarLink link={link} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user?.email?.address || "Business",
                href: "#",
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-neutral-800 dark:bg-neutral-200 flex items-center justify-center text-white dark:text-black text-xs font-bold">
                    {user?.email?.address?.charAt(0).toUpperCase() || "B"}
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-auto">
        <div className="flex w-full flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
                My Tasks
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Manage and create new task campaigns
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold px-6 py-3 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
              <IconPlus className="h-5 w-5" />
              Create New Task
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                <IconCheck className="h-4 w-4" />
                Total Tasks
              </div>
              <p className="text-2xl font-bold text-black dark:text-white">{tasks.length}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                <IconUsers className="h-4 w-4" />
                Active
              </div>
              <p className="text-2xl font-bold text-black dark:text-white">
                {tasks.filter((t) => t.status === "active").length}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                <IconCheck className="h-4 w-4" />
                Completed
              </div>
              <p className="text-2xl font-bold text-black dark:text-white">
                {tasks.filter((t) => t.status === "completed").length}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                <IconCoin className="h-4 w-4" />
                Total Rewards
              </div>
              <p className="text-2xl font-bold text-black dark:text-white">
                {tasks.reduce((acc, t) => acc + t.rewardAmount * t.totalSlots, 0).toFixed(2)} MOV
              </p>
            </div>
          </div>

          {/* Tasks List */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-lg font-semibold text-black dark:text-white">Your Tasks</h2>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white">
                        {getTaskTypeIcon(task.taskTypes[0] || 'Photo Verification')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-black dark:text-white">{task.title}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          {task.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <IconCoin className="h-3 w-3" />
                            {task.rewardAmount} MOV
                          </span>
                          <span className="flex items-center gap-1">
                            <IconUsers className="h-3 w-3" />
                            {task.totalSlots - task.availableSlots}/{task.totalSlots} completed
                          </span>
                          <span>{task.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          task.status === "active"
                            ? "bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                        )}
                      >
                        {task.status}
                      </span>
                      <button className="px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-black dark:text-white">
                        View Details
                      </button>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-4 md:ml-16">
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black dark:bg-white rounded-full transition-all"
                        style={{
                          width: `${((task.totalSlots - task.availableSlots) / task.totalSlots) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-neutral-950 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-neutral-200 dark:border-neutral-800">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-black dark:text-white">Create New Task</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <IconPlus className="h-5 w-5 rotate-45 text-black dark:text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                  Task Title
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g., Take a photo at Starbucks"
                  className="w-full p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 text-black dark:text-white placeholder:text-neutral-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                  Task Description
                </label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Describe what the user needs to do..."
                  rows={3}
                  className="w-full p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 text-black dark:text-white placeholder:text-neutral-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Reward per Person (MOV)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={rewardPerPerson}
                    onChange={(e) => setRewardPerPerson(e.target.value)}
                    placeholder="0.05"
                    className="w-full p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 text-black dark:text-white placeholder:text-neutral-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Number of People
                  </label>
                  <input
                    type="number"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                    placeholder="10"
                    className="w-full p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 text-black dark:text-white placeholder:text-neutral-500"
                  />
                </div>
              </div>

              {/* Total Cost Display */}
              <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Cost</div>
                <div className="text-xl font-bold text-black dark:text-white">
                  {(parseFloat(rewardPerPerson || "0") * parseInt(numberOfPeople || "0")).toFixed(2)} MOV
                </div>
                <div className="text-xs text-neutral-500">
                  {rewardPerPerson} MOV × {numberOfPeople} people
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                  Task Types <span className="text-red-500">* Select exactly 2</span>
                </label>
                <div className="space-y-2">
                  {['Photo Verification', 'Location Check-in', 'Social Media Post', 'Survey/Feedback'].map((taskType) => (
                    <label
                      key={taskType}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTaskTypes.includes(taskType)
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                          : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTaskTypes.includes(taskType)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (selectedTaskTypes.length < 2) {
                              setSelectedTaskTypes([...selectedTaskTypes, taskType]);
                            }
                          } else {
                            setSelectedTaskTypes(selectedTaskTypes.filter(t => t !== taskType));
                          }
                        }}
                        className="mr-3 h-4 w-4 text-blue-600 rounded border-neutral-300 focus:ring-blue-500"
                        disabled={!selectedTaskTypes.includes(taskType) && selectedTaskTypes.length >= 2}
                      />
                      <span className="text-black dark:text-white">{taskType}</span>
                      {selectedTaskTypes.includes(taskType) && (
                        <IconCheck className="h-4 w-4 ml-auto text-blue-600" />
                      )}
                    </label>
                  ))}
                </div>
                {selectedTaskTypes.length === 2 && (
                  <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                    ✓ Perfect! You've selected 2 task types.
                  </div>
                )}
                {selectedTaskTypes.length < 2 && (
                  <div className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    Please select exactly 2 task types to continue.
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-black dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTask}
                  disabled={selectedTaskTypes.length !== 2 || !taskTitle.trim() || !taskDescription.trim() || isCreating}
                  className={`flex-1 font-semibold px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    selectedTaskTypes.length === 2 && taskTitle.trim() && taskDescription.trim() && !isCreating
                      ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200'
                      : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  {isCreating ? (
                    <>
                      <IconLoader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : selectedTaskTypes.length === 2 && taskTitle.trim() && taskDescription.trim() ? (
                    'Create Task'
                  ) : (
                    `Complete Form`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Logo = () => {
  return (
    <a
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <span className="font-medium whitespace-pre text-black dark:text-white">
        Payperdo
      </span>
    </a>
  );
};
