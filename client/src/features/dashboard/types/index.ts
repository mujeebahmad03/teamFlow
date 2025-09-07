import type { ReactNode } from "react";

import type { CrumbItem } from "@/types/ui";
import { TaskPriority, TaskStatus } from "@/tasks/types";

export interface DashboardHeaderProps {
  breadcrumbs: CrumbItem[];
  currentPage: string;
}

export interface DashboardLayoutContentProps extends DashboardHeaderProps {
  children: ReactNode;
}

export interface DashboardAnalytics {
  // Overview Stats
  overview: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    totalTeams: number;
    totalMembers: number;
  };

  // Task Analytics
  taskStats: {
    byStatus: Array<{ status: TaskStatus; count: number; percentage: number }>;
    byPriority: Array<{
      priority: TaskPriority;
      count: number;
      percentage: number;
    }>;
    completionRate: number;
    averageCompletionTime: number; // in days
  };

  // Personal Performance
  personalStats: {
    tasksAssigned: number;
    tasksCompleted: number;
    tasksPending: number;
    completionRate: number;
    overdueTasks: number;
  };

  // Team Performance
  teamStats: Array<{
    teamId: string;
    teamName: string;
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    memberCount: number;
    overdueTasks: number;
  }>;

  // Activity & Trends
  activityStats: {
    tasksCreatedThisWeek: number;
    tasksCompletedThisWeek: number;
    mostActiveTeam: { name: string; taskCount: number } | null;
    recentActivity: Array<{
      action: string;
      details: string;
      createdAt: Date;
      teamName?: string;
    }>;
  };

  // Workload Distribution
  workloadStats: {
    topPerformers: Array<{
      userId: string;
      username: string;
      completedTasks: number;
      totalAssigned: number;
      completionRate: number;
    }>;
    taskDistribution: Array<{
      userId: string;
      username: string;
      assignedTasks: number;
      completedTasks: number;
      pendingTasks: number;
    }>;
  };

  // Time-based Analytics
  timeAnalytics: {
    tasksCreatedLast7Days: Array<{ date: string; count: number }>;
    tasksCompletedLast7Days: Array<{ date: string; count: number }>;
    averageTasksPerDay: number;
    peakActivityDay: string;
  };
}
