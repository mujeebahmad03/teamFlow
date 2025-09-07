import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { TaskStatus, TaskPriority } from "prisma/generated/prisma/enums";
import { DashboardAnalyticsResponse } from "../dto";
import { ResponseHelperService } from "src/helper/response-helper.service";
import { ResponseModel } from "src/models/global.model";

@Injectable()
export class DashboardAnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseHelper: ResponseHelperService<DashboardAnalyticsResponse>,
  ) {}

  async getDashboardAnalytics(
    userId: string,
    teamId?: string,
  ): Promise<ResponseModel<DashboardAnalyticsResponse>> {
    // Get user's teams
    const userTeams = await this.prisma.teamMember.findMany({
      where: { userId },
      select: { teamId: true, team: { select: { name: true } } },
    });

    const teamIds = userTeams.map((tm) => tm.teamId);
    const targetTeamIds = teamId ? [teamId] : teamIds;

    if (targetTeamIds.length === 0) {
      return this.getEmptyAnalytics();
    }

    const [
      overview,
      taskStats,
      personalStats,
      teamStats,
      activityStats,
      workloadStats,
      timeAnalytics,
    ] = await Promise.all([
      this.getOverviewStats(targetTeamIds),
      this.getTaskStats(targetTeamIds),
      this.getPersonalStats(userId, targetTeamIds),
      this.getTeamStats(targetTeamIds),
      this.getActivityStats(targetTeamIds),
      this.getWorkloadStats(targetTeamIds),
      this.getTimeAnalytics(targetTeamIds),
    ]);

    return this.responseHelper.returnSuccessObject(
      "Dashboard analytics fetched successfully",
      {
        overview,
        taskStats,
        personalStats,
        teamStats,
        activityStats,
        workloadStats,
        timeAnalytics,
      },
    );
  }

  private async getOverviewStats(teamIds: string[]) {
    const [tasks, teams, members] = await Promise.all([
      this.prisma.task.findMany({
        where: { teamId: { in: teamIds } },
        select: {
          status: true,
          dueDate: true,
          completedAt: true,
        },
      }),
      this.prisma.team.count({
        where: { id: { in: teamIds } },
      }),
      this.prisma.teamMember.count({
        where: { teamId: { in: teamIds } },
      }),
    ]);

    const now = new Date();
    const completedTasks = tasks.filter(
      (t) => t.status === TaskStatus.DONE,
    ).length;
    const overdueTasks = tasks.filter(
      (t) => t.dueDate && t.dueDate < now && t.status !== TaskStatus.DONE,
    ).length;

    return {
      totalTasks: tasks.length,
      completedTasks,
      overdueTasks,
      totalTeams: teams,
      totalMembers: members,
    };
  }

  private async getTaskStats(teamIds: string[]) {
    const tasks = await this.prisma.task.findMany({
      where: { teamId: { in: teamIds } },
      select: {
        status: true,
        priority: true,
        createdAt: true,
        completedAt: true,
      },
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === TaskStatus.DONE);

    // Status distribution
    const statusCounts = Object.values(TaskStatus).map((status) => {
      const count = tasks.filter((t) => t.status === status).length;
      return {
        status,
        count,
        percentage: totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0,
      };
    });

    // Priority distribution
    const priorityCounts = Object.values(TaskPriority).map((priority) => {
      const count = tasks.filter((t) => t.priority === priority).length;
      return {
        priority,
        count,
        percentage: totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0,
      };
    });

    // Average completion time
    const avgCompletionTime =
      completedTasks.length > 0
        ? completedTasks.reduce((acc, task) => {
            if (task.completedAt) {
              const days = Math.ceil(
                (task.completedAt.getTime() - task.createdAt.getTime()) /
                  (1000 * 60 * 60 * 24),
              );
              return acc + days;
            }
            return acc;
          }, 0) / completedTasks.length
        : 0;

    return {
      byStatus: statusCounts,
      byPriority: priorityCounts,
      completionRate:
        totalTasks > 0
          ? Math.round((completedTasks.length / totalTasks) * 100)
          : 0,
      averageCompletionTime: Math.round(avgCompletionTime),
    };
  }

  private async getPersonalStats(userId: string, teamIds: string[]) {
    const assignedTasks = await this.prisma.task.findMany({
      where: {
        assignedTo: userId,
        teamId: { in: teamIds },
      },
      select: {
        status: true,
        dueDate: true,
      },
    });

    const now = new Date();
    const completed = assignedTasks.filter(
      (t) => t.status === TaskStatus.DONE,
    ).length;
    const pending = assignedTasks.filter(
      (t) => t.status !== TaskStatus.DONE,
    ).length;
    const overdue = assignedTasks.filter(
      (t) => t.dueDate && t.dueDate < now && t.status !== TaskStatus.DONE,
    ).length;

    return {
      tasksAssigned: assignedTasks.length,
      tasksCompleted: completed,
      tasksPending: pending,
      completionRate:
        assignedTasks.length > 0
          ? Math.round((completed / assignedTasks.length) * 100)
          : 0,
      overdueTasks: overdue,
    };
  }

  private async getTeamStats(teamIds: string[]) {
    const teams = await this.prisma.team.findMany({
      where: { id: { in: teamIds } },
      include: {
        tasks: {
          select: {
            status: true,
            dueDate: true,
          },
        },
        members: true,
      },
    });

    const now = new Date();

    return teams.map((team) => {
      const totalTasks = team.tasks.length;
      const completedTasks = team.tasks.filter(
        (t) => t.status === TaskStatus.DONE,
      ).length;
      const overdueTasks = team.tasks.filter(
        (t) => t.dueDate && t.dueDate < now && t.status !== TaskStatus.DONE,
      ).length;

      return {
        teamId: team.id,
        teamName: team.name,
        totalTasks,
        completedTasks,
        completionRate:
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        memberCount: team.members.length,
        overdueTasks,
      };
    });
  }

  private async getActivityStats(teamIds: string[]) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [tasksCreated, tasksCompleted, recentActivity, teams] =
      await Promise.all([
        this.prisma.task.count({
          where: {
            teamId: { in: teamIds },
            createdAt: { gte: oneWeekAgo },
          },
        }),
        this.prisma.task.count({
          where: {
            teamId: { in: teamIds },
            completedAt: { gte: oneWeekAgo },
          },
        }),
        this.prisma.activityLog.findMany({
          where: {
            teamId: { in: teamIds },
            createdAt: { gte: oneWeekAgo },
          },
          include: {
            team: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        this.prisma.team.findMany({
          where: { id: { in: teamIds } },
          include: {
            tasks: {
              where: { createdAt: { gte: oneWeekAgo } },
            },
          },
        }),
      ]);

    // Find most active team
    const mostActiveTeam = teams.reduce((prev, current) => {
      return current.tasks.length > (prev?.tasks.length || 0) ? current : prev;
    }, teams[0]);

    return {
      tasksCreatedThisWeek: tasksCreated,
      tasksCompletedThisWeek: tasksCompleted,
      mostActiveTeam: mostActiveTeam
        ? {
            name: mostActiveTeam.name,
            taskCount: mostActiveTeam.tasks.length,
          }
        : null,
      recentActivity: recentActivity.map((activity) => ({
        action: activity.action,
        details: activity.details || "",
        createdAt: activity.createdAt,
        teamName: activity.team?.name,
      })),
    };
  }

  private async getWorkloadStats(teamIds: string[]) {
    const users = await this.prisma.user.findMany({
      where: {
        teamMemberships: {
          some: { teamId: { in: teamIds } },
        },
      },
      include: {
        assignedTasks: {
          where: { teamId: { in: teamIds } },
          select: { status: true },
        },
      },
    });

    const workloadData = users.map((user) => {
      const assignedTasks = user.assignedTasks.length;
      const completedTasks = user.assignedTasks.filter(
        (t) => t.status === TaskStatus.DONE,
      ).length;
      const pendingTasks = assignedTasks - completedTasks;

      return {
        userId: user.id,
        username: user.username,
        assignedTasks,
        completedTasks,
        pendingTasks,
        completionRate:
          assignedTasks > 0
            ? Math.round((completedTasks / assignedTasks) * 100)
            : 0,
      };
    });

    const topPerformers = workloadData
      .filter((user) => user.assignedTasks > 0)
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 5)
      .map((user) => ({
        userId: user.userId,
        username: user.username,
        completedTasks: user.completedTasks,
        totalAssigned: user.assignedTasks,
        completionRate: user.completionRate,
      }));

    return {
      topPerformers,
      taskDistribution: workloadData,
    };
  }

  private async getTimeAnalytics(teamIds: string[]) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [createdTasks, completedTasks] = await Promise.all([
      this.prisma.task.findMany({
        where: {
          teamId: { in: teamIds },
          createdAt: { gte: sevenDaysAgo },
        },
        select: { createdAt: true },
      }),
      this.prisma.task.findMany({
        where: {
          teamId: { in: teamIds },
          completedAt: { gte: sevenDaysAgo },
        },
        select: { completedAt: true },
      }),
    ]);

    // Generate last 7 days data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    const tasksCreatedLast7Days = last7Days.map((date) => ({
      date,
      count: createdTasks.filter(
        (task) => task.createdAt.toISOString().split("T")[0] === date,
      ).length,
    }));

    const tasksCompletedLast7Days = last7Days.map((date) => ({
      date,
      count: completedTasks.filter(
        (task) =>
          task.completedAt &&
          task.completedAt.toISOString().split("T")[0] === date,
      ).length,
    }));

    const totalTasksLast7Days = tasksCreatedLast7Days.reduce(
      (sum, day) => sum + day.count,
      0,
    );
    const averageTasksPerDay = Math.round(totalTasksLast7Days / 7);

    const peakActivityDay = tasksCreatedLast7Days.reduce((prev, current) =>
      current.count > prev.count ? current : prev,
    ).date;

    return {
      tasksCreatedLast7Days,
      tasksCompletedLast7Days,
      averageTasksPerDay,
      peakActivityDay,
    };
  }

  private getEmptyAnalytics() {
    return this.responseHelper.returnSuccessObject(
      "Dashboard analytics fetched successfully",
      {
        overview: {
          totalTasks: 0,
          completedTasks: 0,
          overdueTasks: 0,
          totalTeams: 0,
          totalMembers: 0,
        },
        taskStats: {
          byStatus: [],
          byPriority: [],
          completionRate: 0,
          averageCompletionTime: 0,
        },
        personalStats: {
          tasksAssigned: 0,
          tasksCompleted: 0,
          tasksPending: 0,
          completionRate: 0,
          overdueTasks: 0,
        },
        teamStats: [],
        activityStats: {
          tasksCreatedThisWeek: 0,
          tasksCompletedThisWeek: 0,
          mostActiveTeam: null,
          recentActivity: [],
        },
        workloadStats: {
          topPerformers: [],
          taskDistribution: [],
        },
        timeAnalytics: {
          tasksCreatedLast7Days: [],
          tasksCompletedLast7Days: [],
          averageTasksPerDay: 0,
          peakActivityDay: "",
        },
      },
    );
  }
}
