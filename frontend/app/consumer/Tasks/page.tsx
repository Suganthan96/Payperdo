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
  IconClock,
  IconSearch,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function Tasks() {
  const { user, logout, authenticated } = usePrivy();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authenticated) {
      router.push("/");
    }
  }, [authenticated, router]);

  // Mock data for available tasks
  const availableTasks = [
    {
      id: 1,
      title: "Photo at Starbucks",
      description: "Take a photo with your coffee at any Starbucks location",
      reward: 10,
      type: "Photo Verification",
      time: "2 min",
      location: "Any Starbucks",
      spotsLeft: 55,
      totalSpots: 100,
      business: "Starbucks Corp",
    },
    {
      id: 2,
      title: "McDonald's Check-in",
      description: "Check in at McDonald's and share your experience",
      reward: 5,
      type: "Location Check-in",
      time: "1 min",
      location: "Any McDonald's",
      spotsLeft: 80,
      totalSpots: 200,
      business: "McDonald's Inc",
    },
    {
      id: 3,
      title: "Coffee Shop Review",
      description: "Write a detailed review of your favorite local coffee shop",
      reward: 15,
      type: "Survey/Feedback",
      time: "5 min",
      location: "Any coffee shop",
      spotsLeft: 30,
      totalSpots: 50,
      business: "Local Brew Co",
    },
    {
      id: 4,
      title: "Gym Workout Selfie",
      description: "Share a workout selfie at the gym with our branded hashtag",
      reward: 12,
      type: "Social Media Post",
      time: "3 min",
      location: "Any gym",
      spotsLeft: 45,
      totalSpots: 75,
      business: "FitLife Gyms",
    },
    {
      id: 5,
      title: "Restaurant Visit",
      description: "Visit our partner restaurant and take a photo of your meal",
      reward: 20,
      type: "Photo Verification",
      time: "10 min",
      location: "Partner restaurants",
      spotsLeft: 25,
      totalSpots: 100,
      business: "Tasty Eats",
    },
    {
      id: 6,
      title: "Product Feedback Survey",
      description: "Complete a short survey about your shopping experience",
      reward: 8,
      type: "Survey/Feedback",
      time: "3 min",
      location: "Online",
      spotsLeft: 150,
      totalSpots: 200,
      business: "ShopMart",
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
        return <IconList className="h-5 w-5" />;
    }
  };

  const categories = ["All", "Photo Verification", "Location Check-in", "Social Media Post", "Survey/Feedback"];

  const filteredTasks = availableTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || task.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
              Browse Tasks
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Complete tasks and earn MOV tokens
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-black dark:text-white placeholder:text-neutral-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-black dark:text-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-1">
                <IconList className="h-4 w-4" />
                Available
              </div>
              <p className="text-2xl font-bold text-black dark:text-white">{filteredTasks.length}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-1">
                <IconCoin className="h-4 w-4" />
                Max Reward
              </div>
              <p className="text-2xl font-bold text-black dark:text-white">
                {Math.max(...filteredTasks.map(t => t.reward))} MOV
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-1">
                <IconClock className="h-4 w-4" />
                Quick Tasks
              </div>
              <p className="text-2xl font-bold text-black dark:text-white">
                {filteredTasks.filter(t => parseInt(t.time) <= 3).length}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-1">
                <IconCoin className="h-4 w-4" />
                Total Earnings
              </div>
              <p className="text-2xl font-bold text-black dark:text-white">
                {filteredTasks.reduce((acc, t) => acc + t.reward, 0)} MOV
              </p>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white">
                    {getTaskTypeIcon(task.type)}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-black dark:text-white">{task.reward} MOV</p>
                  </div>
                </div>

                <h3 className="font-semibold text-black dark:text-white mb-1">{task.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                  {task.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Time</span>
                    <span className="text-black dark:text-white flex items-center gap-1">
                      <IconClock className="h-3 w-3" />
                      {task.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Location</span>
                    <span className="text-black dark:text-white">{task.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Spots Left</span>
                    <span className="text-black dark:text-white">{task.spotsLeft}/{task.totalSpots}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black dark:bg-white rounded-full"
                      style={{ width: `${((task.totalSpots - task.spotsLeft) / task.totalSpots) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">by {task.business}</span>
                  <button className="bg-black dark:bg-white text-white dark:text-black font-semibold px-4 py-2 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors text-sm">
                    Start Task
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredTasks.length === 0 && (
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-12 text-center">
              <IconList className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                No Tasks Found
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Try adjusting your search or filter to find available tasks.
              </p>
            </div>
          )}
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
