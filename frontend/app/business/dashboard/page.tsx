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

export default function BusinessDashboard() {
  const { user, authenticated, logout } = usePrivy();
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [open, setOpen] = useState(false);

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
      <DashboardContent user={user} walletAddress={walletAddress} />
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

const DashboardContent = ({ user, walletAddress }: { user: any; walletAddress: string }) => {
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
          <button className="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs md:text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors border border-neutral-200 dark:border-neutral-700 w-fit">
            View Contract
          </button>
        </div>

        {/* Stats Cards - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <IconChartBar className="h-4 w-4 md:h-5 md:w-5 text-neutral-600 dark:text-neutral-400" />
              <span className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Campaigns</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-black dark:text-white">0</p>
            <p className="text-neutral-400 text-xs mt-1 hidden md:block">Running</p>
          </div>
          <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <IconUsers className="h-4 w-4 md:h-5 md:w-5 text-neutral-600 dark:text-neutral-400" />
              <span className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Done</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-black dark:text-white">0</p>
            <p className="text-neutral-400 text-xs mt-1 hidden md:block">Tasks</p>
          </div>
          <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <IconCoin className="h-4 w-4 md:h-5 md:w-5 text-neutral-600 dark:text-neutral-400" />
              <span className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Spent</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-black dark:text-white">$0</p>
            <p className="text-neutral-400 text-xs mt-1 hidden md:block">Total</p>
          </div>
          <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <IconCoin className="h-4 w-4 md:h-5 md:w-5 text-neutral-600 dark:text-neutral-400" />
              <span className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Balance</span>
            </div>
            <p className="text-lg md:text-xl font-bold text-black dark:text-white">0 MOV</p>
            <p className="text-neutral-400 text-xs mt-1 hidden md:block">Tokens</p>
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
                <span className="text-black dark:text-white font-mono text-xs">
                  {walletAddress ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}` : "Creating..."}
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
