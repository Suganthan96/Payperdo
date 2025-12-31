"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconPlus,
  IconCheck,
  IconCoin,
  IconUser,
  IconCalendar,
  IconPhoto,
  IconMapPin,
  IconShare,
  IconMessage,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function CompletedTask() {
  const { user, logout, authenticated } = usePrivy();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authenticated) {
      router.push("/");
    }
  }, [authenticated, router]);

  // Mock data for completed tasks
  const completedTasks = [
    {
      id: 1,
      title: "Product Review",
      description: "Write a detailed review of our new product",
      completedBy: "0x742d...01a",
      completedByEmail: "user1@email.com",
      reward: 15,
      type: "Survey/Feedback",
      verifiedAt: "2025-12-20",
      totalCompleted: 50,
      totalTasks: 50,
    },
    {
      id: 2,
      title: "Brand Awareness Survey",
      description: "Complete our brand awareness questionnaire",
      completedBy: "0x8ba3...01b",
      completedByEmail: "user2@email.com",
      reward: 8,
      type: "Survey/Feedback",
      verifiedAt: "2025-12-18",
      totalCompleted: 200,
      totalTasks: 200,
    },
    {
      id: 3,
      title: "Holiday Photo Contest",
      description: "Share a festive photo with our product",
      completedBy: "0x9cd4...02c",
      completedByEmail: "user3@email.com",
      reward: 20,
      type: "Photo Verification",
      verifiedAt: "2025-12-15",
      totalCompleted: 75,
      totalTasks: 75,
    },
    {
      id: 4,
      title: "Store Visit Check-in",
      description: "Visit our partner store and check in",
      completedBy: "0xabc5...03d",
      completedByEmail: "user4@email.com",
      reward: 12,
      type: "Location Check-in",
      verifiedAt: "2025-12-10",
      totalCompleted: 150,
      totalTasks: 150,
    },
  ];

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

  const totalRewardsPaid = completedTasks.reduce(
    (acc, t) => acc + t.reward * t.totalCompleted,
    0
  );

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
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
              Completed Tasks
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              View all tasks that have been fully completed
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                <IconCheck className="h-4 w-4" />
                Total Completed
              </div>
              <p className="text-2xl font-bold text-black dark:text-white">
                {completedTasks.length}
              </p>
              <p className="text-xs text-neutral-500">Task campaigns</p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                <IconUser className="h-4 w-4" />
                Total Submissions
              </div>
              <p className="text-2xl font-bold text-black dark:text-white">
                {completedTasks.reduce((acc, t) => acc + t.totalCompleted, 0)}
              </p>
              <p className="text-xs text-neutral-500">From all tasks</p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                <IconCoin className="h-4 w-4" />
                Total Paid Out
              </div>
              <p className="text-2xl font-bold text-black dark:text-white">
                {totalRewardsPaid} MOV
              </p>
              <p className="text-xs text-neutral-500">Rewards distributed</p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                <IconCalendar className="h-4 w-4" />
                This Month
              </div>
              <p className="text-2xl font-bold text-black dark:text-white">
                {completedTasks.filter((t) => t.verifiedAt.startsWith("2025-12")).length}
              </p>
              <p className="text-xs text-neutral-500">Completed in Dec</p>
            </div>
          </div>

          {/* Completed Tasks List */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-lg font-semibold text-black dark:text-white">
                Completed Task Campaigns
              </h2>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {completedTasks.map((task) => (
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
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-black dark:text-white">
                            {task.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white">
                            Completed
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          {task.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <IconCoin className="h-3 w-3" />
                            {task.reward} MOV per task
                          </span>
                          <span className="flex items-center gap-1">
                            <IconUser className="h-3 w-3" />
                            {task.totalCompleted} completions
                          </span>
                          <span className="flex items-center gap-1">
                            <IconCalendar className="h-3 w-3" />
                            Completed on {task.verifiedAt}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-lg font-bold text-black dark:text-white">
                          {task.reward * task.totalCompleted} MOV
                        </p>
                        <p className="text-xs text-neutral-500">Total paid</p>
                      </div>
                      <button className="px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-black dark:text-white">
                        View Report
                      </button>
                    </div>
                  </div>
                  {/* Completion indicator */}
                  <div className="mt-4 md:ml-16">
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                      <span>100% Complete</span>
                      <span>{task.totalCompleted}/{task.totalTasks} tasks</span>
                    </div>
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black dark:bg-white rounded-full"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty state if no completed tasks */}
          {completedTasks.length === 0 && (
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-12 text-center">
              <IconCheck className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                No Completed Tasks Yet
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Once your task campaigns are fully completed, they will appear here.
              </p>
              <a
                href="/business/Createtask"
                className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold px-6 py-3 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                <IconPlus className="h-5 w-5" />
                Create New Task
              </a>
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
