"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconList,
  IconCoin,
  IconTrophy,
  IconUserBolt,
  IconCheck,
  IconClock,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function ConsumerDashboard() {
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
      <DashboardContent user={user} walletAddress={walletAddress} router={router} />
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

const DashboardContent = ({ user, walletAddress, router }: { user: any; walletAddress: string; router: any }) => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-4 md:rounded-tl-2xl border-0 md:border border-neutral-200 bg-white p-4 md:p-8 lg:p-10 dark:border-neutral-700 dark:bg-black overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-black dark:text-white">
              Welcome back!
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">
              Ready to earn some MOV tokens today?
            </p>
          </div>
        </div>

        {/* Stats Cards - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <IconList className="h-4 w-4 md:h-5 md:w-5 text-neutral-600 dark:text-neutral-400" />
              <span className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Tasks Done</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-black dark:text-white">12</p>
            <p className="text-neutral-400 text-xs mt-1 hidden md:block">This month</p>
          </div>
          <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <IconCoin className="h-4 w-4 md:h-5 md:w-5 text-neutral-600 dark:text-neutral-400" />
              <span className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Earned</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-black dark:text-white">245</p>
            <p className="text-neutral-400 text-xs mt-1">MOV</p>
          </div>
          <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <IconTrophy className="h-4 w-4 md:h-5 md:w-5 text-neutral-600 dark:text-neutral-400" />
              <span className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Success</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-black dark:text-white">94%</p>
            <p className="text-neutral-400 text-xs mt-1 hidden md:block">Excellent</p>
          </div>
          <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <IconUserBolt className="h-4 w-4 md:h-5 md:w-5 text-neutral-600 dark:text-neutral-400" />
              <span className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Rank</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-black dark:text-white">#127</p>
            <p className="text-neutral-400 text-xs mt-1 hidden md:block">Top 5%</p>
          </div>
        </div>

        {/* Quick Actions - Full width on mobile */}
        <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-base md:text-lg font-semibold text-black dark:text-white mb-3 md:mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <button 
              onClick={() => router.push('/consumer/Tasks')}
              className="p-4 md:p-6 rounded-xl bg-black dark:bg-white text-white dark:text-black transition-all hover:opacity-80 active:scale-95"
            >
              <IconList className="h-5 w-5 md:h-6 md:w-6 mb-2" />
              <p className="font-medium text-sm md:text-base">Browse Tasks</p>
              <p className="text-neutral-300 dark:text-neutral-600 text-xs mt-1 hidden md:block">Find new tasks</p>
            </button>
            <button 
              onClick={() => router.push('/consumer/Earning')}
              className="p-4 md:p-6 rounded-xl bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black transition-all hover:opacity-80 active:scale-95"
            >
              <IconCoin className="h-5 w-5 md:h-6 md:w-6 mb-2" />
              <p className="font-medium text-sm md:text-base">Earnings</p>
              <p className="text-neutral-300 dark:text-neutral-600 text-xs mt-1 hidden md:block">Check balance</p>
            </button>
          </div>
        </div>

        {/* Mobile: Stack wallet and activity, Desktop: Side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Wallet Card */}
          <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 order-1 lg:order-2">
            <h3 className="text-base md:text-lg font-semibold text-black dark:text-white mb-3 md:mb-4">Your Wallet</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="p-3 md:p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <p className="text-neutral-500 dark:text-neutral-400 text-xs mb-1">Address</p>
                <p className="text-black dark:text-white font-mono text-xs md:text-sm break-all">
                  {walletAddress ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}` : "Loading..."}
                </p>
              </div>
              <div className="p-3 md:p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <p className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Balance</p>
                <p className="text-xl md:text-2xl font-bold text-black dark:text-white">245.5 MOV</p>
                <p className="text-neutral-400 text-xs">≈ $12.28 USD</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 lg:col-span-2 order-2 lg:order-1">
            <h3 className="text-base md:text-lg font-semibold text-black dark:text-white mb-3 md:mb-4">Recent Activity</h3>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center justify-between p-2 md:p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center border border-neutral-300 dark:border-neutral-600">
                    <IconCheck className="h-3 w-3 md:h-4 md:w-4 text-black dark:text-white" />
                  </div>
                  <div>
                    <p className="text-black dark:text-white font-medium text-xs md:text-sm">Photo at Starbucks</p>
                    <p className="text-neutral-400 text-xs">2 hours ago</p>
                  </div>
                </div>
                <span className="text-black dark:text-white font-bold text-xs md:text-sm">+10 MOV</span>
              </div>
              <div className="flex items-center justify-between p-2 md:p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center border border-neutral-300 dark:border-neutral-600">
                    <IconClock className="h-3 w-3 md:h-4 md:w-4 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-black dark:text-white font-medium text-xs md:text-sm">McDonald's Check-in</p>
                    <p className="text-neutral-400 text-xs">1 day ago</p>
                  </div>
                </div>
                <span className="text-neutral-400 font-bold text-xs md:text-sm">+5 MOV</span>
              </div>
              <div className="flex items-center justify-between p-2 md:p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center border border-neutral-300 dark:border-neutral-600">
                    <IconCheck className="h-3 w-3 md:h-4 md:w-4 text-black dark:text-white" />
                  </div>
                  <div>
                    <p className="text-black dark:text-white font-medium text-xs md:text-sm">Product Review - Nike</p>
                    <p className="text-neutral-400 text-xs">3 days ago</p>
                  </div>
                </div>
                <span className="text-black dark:text-white font-bold text-xs md:text-sm">+25 MOV</span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Card - Hidden on small mobile, shown on larger screens */}
        <div className="p-4 md:p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-base md:text-lg font-semibold text-black dark:text-white mb-3 md:mb-4">Latest Achievement</h3>
          <div className="flex items-center md:flex-col md:text-center gap-4 md:gap-0">
            <div className="w-12 h-12 md:w-16 md:h-16 md:mx-auto md:mb-3 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 shrink-0">
              <IconTrophy className="h-6 w-6 md:h-8 md:w-8 text-black dark:text-white" />
            </div>
            <div className="flex-1 md:flex-none">
              <p className="text-black dark:text-white font-medium text-sm md:text-lg">Task Streak</p>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">Completed 5 tasks in a row!</p>
              <div className="mt-2 md:mt-4 p-2 md:p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 inline-block md:block">
                <span className="text-black dark:text-white font-bold text-xs md:text-sm">+5 Bonus MOV</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
