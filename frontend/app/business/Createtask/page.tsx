"use client";

import React, { useState } from "react";
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
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function CreateTask() {
  const { user, logout, authenticated } = usePrivy();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authenticated) {
      router.push("/");
    }
  }, [authenticated, router]);

  // Mock data for created tasks
  const [tasks] = useState([
    {
      id: 1,
      title: "Photo at Starbucks",
      description: "Take a photo with your coffee at any Starbucks location",
      reward: 10,
      totalTasks: 100,
      completedTasks: 45,
      type: "Photo Verification",
      status: "Active",
      createdAt: "2025-12-28",
    },
    {
      id: 2,
      title: "McDonald's Check-in",
      description: "Check in at McDonald's and share on social media",
      reward: 5,
      totalTasks: 200,
      completedTasks: 120,
      type: "Location Check-in",
      status: "Active",
      createdAt: "2025-12-25",
    },
    {
      id: 3,
      title: "Product Review",
      description: "Write a detailed review of our new product",
      reward: 15,
      totalTasks: 50,
      completedTasks: 50,
      type: "Survey/Feedback",
      status: "Completed",
      createdAt: "2025-12-20",
    },
  ]);

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
                {tasks.filter((t) => t.status === "Active").length}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                <IconCheck className="h-4 w-4" />
                Completed
              </div>
              <p className="text-2xl font-bold text-black dark:text-white">
                {tasks.filter((t) => t.status === "Completed").length}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                <IconCoin className="h-4 w-4" />
                Total Rewards
              </div>
              <p className="text-2xl font-bold text-black dark:text-white">
                {tasks.reduce((acc, t) => acc + t.reward * t.totalTasks, 0)} MOV
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
                        {getTaskTypeIcon(task.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-black dark:text-white">{task.title}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          {task.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <IconCoin className="h-3 w-3" />
                            {task.reward} MOV
                          </span>
                          <span className="flex items-center gap-1">
                            <IconUsers className="h-3 w-3" />
                            {task.completedTasks}/{task.totalTasks} completed
                          </span>
                          <span>{task.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          task.status === "Active"
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
                          width: `${(task.completedTasks / task.totalTasks) * 100}%`,
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
                  placeholder="e.g., Take a photo at Starbucks"
                  className="w-full p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 text-black dark:text-white placeholder:text-neutral-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                  Task Description
                </label>
                <textarea
                  placeholder="Describe what the user needs to do..."
                  rows={3}
                  className="w-full p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 text-black dark:text-white placeholder:text-neutral-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Reward (MOV)
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    className="w-full p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 text-black dark:text-white placeholder:text-neutral-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Number of Tasks
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 text-black dark:text-white placeholder:text-neutral-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                  Task Type
                </label>
                <select className="w-full p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 text-black dark:text-white">
                  <option>Photo Verification</option>
                  <option>Location Check-in</option>
                  <option>Social Media Post</option>
                  <option>Survey/Feedback</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-black dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-black dark:bg-white text-white dark:text-black font-semibold px-4 py-3 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                >
                  Create Task
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
