"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconList,
  IconCoin,
  IconUserBolt,
  IconPhoto,
  IconMapPin,
  IconShare,
  IconMessage,
  IconCheck,
  IconClock,
  IconWallet,
  IconArrowUpRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function Earning() {
  const { user, logout, authenticated } = usePrivy();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authenticated) {
      router.push("/");
    }
  }, [authenticated, router]);

  // Get wallet address
  const walletAddress = user?.wallet?.address || "";
  const shortenedAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "";

  // Mock data for earnings from each task
  const earnings = [
    {
      id: 1,
      task: "Photo at Starbucks",
      description: "Take a photo with your coffee",
      type: "Photo Verification",
      amount: 10,
      status: "Completed",
      date: "2025-12-30",
      time: "2:30 PM",
      txHash: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      business: "Starbucks Corp",
    },
    {
      id: 2,
      task: "McDonald's Check-in",
      description: "Check in at McDonald's location",
      type: "Location Check-in",
      amount: 5,
      status: "Pending",
      date: "2025-12-30",
      time: "1:15 PM",
      txHash: "",
      business: "McDonald's Inc",
    },
    {
      id: 3,
      task: "Coffee Shop Review",
      description: "Write a review of local coffee shop",
      type: "Survey/Feedback",
      amount: 15,
      status: "Completed",
      date: "2025-12-29",
      time: "4:00 PM",
      txHash: "0x8ba35Cc6634C0532925a3b844Bc454e4438f55f",
      business: "Local Brew Co",
    },
    {
      id: 4,
      task: "Gym Workout Selfie",
      description: "Share a workout selfie with hashtag",
      type: "Social Media Post",
      amount: 12,
      status: "Completed",
      date: "2025-12-29",
      time: "10:00 AM",
      txHash: "0x9cd45Cc6634C0532925a3b844Bc454e4438f66g",
      business: "FitLife Gyms",
    },
    {
      id: 5,
      task: "Product Feedback Survey",
      description: "Complete survey about shopping experience",
      type: "Survey/Feedback",
      amount: 8,
      status: "Completed",
      date: "2025-12-28",
      time: "3:30 PM",
      txHash: "0xabc55Cc6634C0532925a3b844Bc454e4438f77h",
      business: "ShopMart",
    },
    {
      id: 6,
      task: "Restaurant Visit",
      description: "Photo of meal at partner restaurant",
      type: "Photo Verification",
      amount: 20,
      status: "Completed",
      date: "2025-12-27",
      time: "7:00 PM",
      txHash: "0xdef65Cc6634C0532925a3b844Bc454e4438f88i",
      business: "Tasty Eats",
    },
  ];

  const links = [
    {
      label: "Dashboard",
      href: "/consumer/dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Browse Tasks",
      href: "/consumer/Tasks",
      icon: (
        <IconList className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "My Earnings",
      href: "/consumer/Earning",
      icon: (
        <IconCoin className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "My Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
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
        return <IconCoin className="h-5 w-5" />;
    }
  };

  const totalEarned = earnings
    .filter((e) => e.status === "Completed")
    .reduce((acc, e) => acc + e.amount, 0);

  const pendingEarnings = earnings
    .filter((e) => e.status === "Pending")
    .reduce((acc, e) => acc + e.amount, 0);

  const completedTasks = earnings.filter((e) => e.status === "Completed").length;

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
                label: user?.email?.address || "Consumer",
                href: "#",
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-neutral-800 dark:bg-neutral-200 flex items-center justify-center text-white dark:text-black text-xs font-bold">
                    {user?.email?.address?.charAt(0).toUpperCase() || "C"}
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
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
              My Earnings
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Track your MOV token earnings from completed tasks
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-1">
                <IconCoin className="h-4 w-4" />
                Total Earned
              </div>
              <p className="text-2xl font-bold text-black dark:text-white">{totalEarned} MOV</p>
              <p className="text-xs text-neutral-500">All time</p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-1">
                <IconClock className="h-4 w-4" />
                Pending
              </div>
              <p className="text-2xl font-bold text-black dark:text-white">{pendingEarnings} MOV</p>
              <p className="text-xs text-neutral-500">Awaiting verification</p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-1">
                <IconCheck className="h-4 w-4" />
                Completed
              </div>
              <p className="text-2xl font-bold text-black dark:text-white">{completedTasks}</p>
              <p className="text-xs text-neutral-500">Tasks done</p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-1">
                <IconWallet className="h-4 w-4" />
                Wallet
              </div>
              <p className="text-lg font-bold text-black dark:text-white font-mono">
                {shortenedAddress || "..."}
              </p>
              <p className="text-xs text-neutral-500">Connected</p>
            </div>
          </div>

          {/* Earnings List */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-lg font-semibold text-black dark:text-white">
                Earnings History
              </h2>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {earnings.map((earning) => (
                <div
                  key={earning.id}
                  className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white">
                        {getTaskTypeIcon(earning.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-black dark:text-white">
                            {earning.task}
                          </h3>
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium",
                              earning.status === "Completed"
                                ? "bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                            )}
                          >
                            {earning.status}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {earning.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-neutral-500">
                          <span>by {earning.business}</span>
                          <span>{earning.date}</span>
                          <span>{earning.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-black dark:text-white">
                          +{earning.amount} MOV
                        </p>
                        {earning.txHash && (
                          <a
                            href={`https://explorer.movementlabs.xyz/tx/${earning.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1 justify-end"
                          >
                            View tx
                            <IconArrowUpRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Withdraw Section */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6">
            <h2 className="text-lg font-semibold text-black dark:text-white mb-2">
              Withdraw Earnings
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Your MOV tokens are stored in your embedded wallet. You can withdraw to an external wallet.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 bg-black dark:bg-white text-white dark:text-black font-semibold px-6 py-3 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                Withdraw to External Wallet
              </button>
              <button className="flex-1 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white font-semibold px-6 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                View Wallet Details
              </button>
            </div>
          </div>
        </div>
      </div>
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
