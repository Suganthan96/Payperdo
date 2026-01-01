"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconPlus,
  IconChartBar,
  IconUsers,
  IconCoin,
  IconTrophy,
  IconSearch,
  IconCheck,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useMovementBalance } from "@/hooks/useMovementBalance";
import { fetchBusinessTasks, Task, requestTestTokens, initializeTaskRegistry } from "@/utils/blockchain";
import { convertEthToMoveAddress } from "@/utils/addressConverter";

export default function BusinessDashboard() {
  const { user, authenticated, logout } = usePrivy();
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [createdTasks, setCreatedTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [requestingTokens, setRequestingTokens] = useState(false);
  const [initializingContract, setInitializingContract] = useState(false);
  
  // Fetch MOV balance from Movement blockchain
  const { balance: movBalance, loading: balanceLoading, error: balanceError } = useMovementBalance(walletAddress);

  useEffect(() => {
    if (user?.wallet) {
      setWalletAddress(user.wallet.address);
    }
  }, [user]);

  useEffect(() => {
    if (!authenticated) {
      router.push("/");
    }
  }, [authenticated, router]);

  // Load business tasks when wallet address is available
  useEffect(() => {
    if (walletAddress && authenticated && user?.wallet?.address) {
      loadBusinessTasks();
    }
  }, [walletAddress, authenticated, user]);

  const loadBusinessTasks = async () => {
    if (!walletAddress) return;
    
    setTasksLoading(true);
    try {
      console.log('🔍 Loading real business tasks from blockchain dashboard...', walletAddress);
      
      // Convert to Movement address
      const moveAddress = convertEthToMoveAddress(walletAddress);
      
      // Fetch real tasks from blockchain
      // Fetch real tasks from blockchain
      const realTasks = await fetchBusinessTasks(moveAddress);
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
          businessAddress: walletAddress,
          createdAt: new Date().toISOString(),
          status: 'active' as const
        }));
        
        console.log('✅ Real business tasks loaded:', businessTasks);
        setCreatedTasks(businessTasks);
      } else {
        console.log('ℹ️ No real tasks found on blockchain yet');
        setCreatedTasks([]);
      }
    } catch (error) {
      console.error('Failed to load real business tasks:', error);
      setCreatedTasks([]);
    } finally {
      setTasksLoading(false);
    }
  };

  const handleRequestTestTokens = async () => {
    if (!walletAddress || requestingTokens) return;
    
    setRequestingTokens(true);
    try {
      const result = await requestTestTokens(walletAddress);
      if (result.success) {
        // Reload balance after a delay
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        alert('Test MOV tokens requested! Balance will update in a few moments.');
      } else {
        alert('Failed to request test tokens: ' + result.error);
      }
    } catch (error) {
      console.error('Error requesting tokens:', error);
      alert('Error requesting test tokens. Please try again.');
    } finally {
      setRequestingTokens(false);
    }
  };

  const handleInitializeContract = async () => {
    if (!user || initializingContract) return;
    
    setInitializingContract(true);
    try {
      const result = await initializeTaskRegistry(user);
      if (result.success) {
        alert(`Contract initialized successfully!\n\nTransaction Hash: ${result.txHash}\n\nYou can now create tasks!`);
        // Reload tasks after initialization
        setTimeout(() => {
          loadBusinessTasks();
        }, 2000);
      } else {
        alert('Failed to initialize contract: ' + result.error);
      }
    } catch (error) {
      console.error('Error initializing contract:', error);
      alert('Error initializing contract. Please try again.');
    } finally {
      setInitializingContract(false);
    }
  };

  // Don't render the main content until we know authentication status
  if (!authenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-black rounded-full"></div>
      </div>
    );
  }

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
                label: user?.email?.address || "Business User",
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
      <DashboardContent 
        user={user} 
        walletAddress={walletAddress} 
        movBalance={movBalance}
        balanceLoading={balanceLoading}
        balanceError={balanceError}
        createdTasks={createdTasks}
        tasksLoading={tasksLoading}
        loadBusinessTasks={loadBusinessTasks}
        requestingTokens={requestingTokens}
        handleRequestTestTokens={handleRequestTestTokens}
        initializingContract={initializingContract}
        handleInitializeContract={handleInitializeContract}
      />
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

const LogoIcon = () => {
  return (
    <a
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

const DashboardContent = ({ 
  user, 
  walletAddress, 
  movBalance, 
  balanceLoading, 
  balanceError,
  createdTasks,
  tasksLoading,
  loadBusinessTasks,
  requestingTokens,
  handleRequestTestTokens,
  initializingContract,
  handleInitializeContract
}: { 
  user: any; 
  walletAddress: string;
  movBalance: string;
  balanceLoading: boolean;
  balanceError: string | null;
  createdTasks: Task[];
  tasksLoading: boolean;
  loadBusinessTasks: () => Promise<void>;
  requestingTokens: boolean;
  handleRequestTestTokens: () => Promise<void>;
  initializingContract: boolean;
  handleInitializeContract: () => Promise<void>;
}) => {
  const router = useRouter();
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-4 md:rounded-tl-2xl border-0 md:border border-neutral-200 bg-white p-4 md:p-8 lg:p-10 dark:border-neutral-700 dark:bg-black overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2 md:mb-4">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-black dark:text-white">
              Welcome back, Business
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">
              Last updated: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleInitializeContract}
              disabled={initializingContract}
              className="px-3 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-lg text-xs transition-colors"
              title="Initialize your Move contract before creating tasks"
            >
              {initializingContract ? '⏳ Initializing...' : '🚀 Init Contract'}
            </button>
            <button 
              onClick={loadBusinessTasks}
              className="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors border border-neutral-200 dark:border-neutral-700"
              title="Refresh tasks from blockchain"
            >
              🔄 Refresh Tasks
            </button>
          </div>
        </div>

        {/* Stats Cards - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <IconChartBar className="h-4 w-4 md:h-5 md:w-5 text-neutral-600 dark:text-neutral-400" />
              <span className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Tasks</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-black dark:text-white">
              {tasksLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                createdTasks.length
              )}
            </p>
            <p className="text-neutral-400 text-xs mt-1 hidden md:block">Created</p>
          </div>
          <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <IconUsers className="h-4 w-4 md:h-5 md:w-5 text-neutral-600 dark:text-neutral-400" />
              <span className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Completed</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-black dark:text-white">
              {tasksLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                createdTasks.filter(task => task.availableSlots === 0).length
              )}
            </p>
            <p className="text-neutral-400 text-xs mt-1 hidden md:block">Tasks</p>
          </div>
          <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <IconCoin className="h-4 w-4 md:h-5 md:w-5 text-neutral-600 dark:text-neutral-400" />
              <span className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Total Rewards</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-black dark:text-white">
              {tasksLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                `${createdTasks.reduce((sum, task) => sum + (task.rewardAmount * task.totalSlots), 0).toFixed(2)} MOV`
              )}
            </p>
            <p className="text-neutral-400 text-xs mt-1 hidden md:block">Allocated</p>
          </div>
          <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <IconCoin className="h-4 w-4 md:h-5 md:w-5 text-neutral-600 dark:text-neutral-400" />
              <span className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Balance</span>
            </div>
            <p className="text-lg md:text-xl font-bold text-black dark:text-white">
              {balanceLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : balanceError ? (
                <span className="text-red-500">Error</span>
              ) : (
                `${movBalance} MOV`
              )}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-neutral-400 text-xs mt-1">
                {balanceError ? "Failed to load" : "Movement Network"}
              </p>
              {!balanceLoading && !balanceError && parseFloat(movBalance) === 0 && (
                <button
                  onClick={handleRequestTestTokens}
                  disabled={requestingTokens}
                  className="text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-2 py-1 rounded mt-1"
                >
                  {requestingTokens ? 'Requesting...' : 'Get Test MOV'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Wallet Info */}
          <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-base md:text-lg font-semibold text-black dark:text-white mb-3 md:mb-4">Business Wallet</h3>
            <div className="space-y-2 md:space-y-3">
              <div className="flex flex-col md:flex-row md:justify-between py-2 border-b border-neutral-200 dark:border-neutral-800 gap-1">
                <span className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Business ID</span>
                <span className="text-black dark:text-white font-mono text-xs">{user?.id?.slice(0, 16) || "Loading..."}...</span>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between py-2 border-b border-neutral-200 dark:border-neutral-800 gap-1">
                <span className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Email</span>
                <span className="text-black dark:text-white text-xs md:text-sm truncate">{user?.email?.address || "Loading..."}</span>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between py-2 border-b border-neutral-200 dark:border-neutral-800 gap-1">
                <span className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Wallet</span>
                <span className="text-black dark:text-white font-mono text-xs break-all">
                  {walletAddress || "Creating..."}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Status</span>
                <span className="flex items-center gap-2 text-black dark:text-white text-xs md:text-sm">
                  <span className="w-2 h-2 bg-neutral-800 dark:bg-white rounded-full"></span>
                  Connected
                </span>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-base md:text-lg font-semibold text-black dark:text-white mb-3 md:mb-4">Performance</h3>
            <div className="space-y-2 md:space-y-3">
              <div className="p-3 md:p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <h4 className="text-black dark:text-white font-medium text-xs md:text-sm mb-1">Positive Engagement</h4>
                <p className="text-neutral-600 dark:text-neutral-300 text-xs">Social media engagement is trending upward with authentic interactions.</p>
                <button className="text-neutral-500 dark:text-neutral-400 text-xs mt-2 hover:underline">View details →</button>
              </div>
              <div className="p-3 md:p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <h4 className="text-black dark:text-white font-medium text-xs md:text-sm mb-1">Areas for Improvement</h4>
                <p className="text-neutral-600 dark:text-neutral-300 text-xs">Create more campaigns to boost brand visibility.</p>
                <button className="text-neutral-500 dark:text-neutral-400 text-xs mt-2 hover:underline">View details →</button>
              </div>
            </div>
          </div>
        </div>

        {/* My Created Tasks Section */}
        <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-semibold text-black dark:text-white">My Created Tasks</h3>
            <button 
              onClick={loadBusinessTasks}
              className="px-3 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
            >
              Refresh
            </button>
          </div>
          
          {tasksLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-black dark:border-t-white rounded-full mx-auto"></div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2">Loading tasks...</p>
            </div>
          ) : createdTasks.length > 0 ? (
            <div className="space-y-3">
              {createdTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-black dark:text-white font-medium text-sm">{task.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.availableSlots === 0 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    }`}>
                      {task.availableSlots === 0 ? 'Completed' : `${task.availableSlots}/${task.totalSlots} Available`}
                    </span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-300 text-xs mb-2 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex space-x-3">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        Reward: {task.rewardAmount} MOV
                      </span>
                      <span className="text-neutral-500 dark:text-neutral-400">
                        Types: {task.taskTypes.join(', ')}
                      </span>
                    </div>
                    <button className="text-blue-600 dark:text-blue-400 hover:underline">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
              {createdTasks.length > 3 && (
                <div className="text-center pt-2">
                  <button className="text-neutral-500 dark:text-neutral-400 text-xs hover:underline">
                    View all {createdTasks.length} tasks →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">No tasks created yet</p>
              <button 
                onClick={() => router.push('/business/Createtask')}
                className="mt-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs hover:opacity-80 transition-opacity"
              >
                Create Your First Task
              </button>
            </div>
          )}
        </div>

        {/* Campaign Creation - Full width */}
        <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-base md:text-lg font-semibold text-black dark:text-white mb-3 md:mb-4">Create Campaign</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <button className="p-3 md:p-4 rounded-lg bg-black dark:bg-white text-white dark:text-black transition-colors text-left hover:opacity-80 active:scale-95">
              <IconUsers className="h-5 w-5 md:h-6 md:w-6 mb-2" />
              <h4 className="font-medium text-xs md:text-sm">Social Media</h4>
              <p className="text-neutral-400 dark:text-neutral-600 text-xs mt-1 hidden md:block">Customer posts</p>
            </button>
            <button className="p-3 md:p-4 rounded-lg bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black transition-colors text-left hover:opacity-80 active:scale-95">
              <IconTrophy className="h-5 w-5 md:h-6 md:w-6 mb-2" />
              <h4 className="font-medium text-xs md:text-sm">Reviews</h4>
              <p className="text-neutral-400 dark:text-neutral-600 text-xs mt-1 hidden md:block">Product reviews</p>
            </button>
            <button className="p-3 md:p-4 rounded-lg bg-neutral-700 dark:bg-neutral-300 text-white dark:text-black transition-colors text-left hover:opacity-80 active:scale-95">
              <IconSearch className="h-5 w-5 md:h-6 md:w-6 mb-2" />
              <h4 className="font-medium text-xs md:text-sm">Mystery Shop</h4>
              <p className="text-neutral-400 dark:text-neutral-600 text-xs mt-1 hidden md:block">Service audit</p>
            </button>
            <button className="p-3 md:p-4 rounded-lg bg-neutral-600 dark:bg-neutral-400 text-white dark:text-black transition-colors text-left hover:opacity-80 active:scale-95">
              <IconChartBar className="h-5 w-5 md:h-6 md:w-6 mb-2" />
              <h4 className="font-medium text-xs md:text-sm">Research</h4>
              <p className="text-neutral-400 dark:text-neutral-600 text-xs mt-1 hidden md:block">Market insights</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
