import { ApiProperty } from "@nestjs/swagger";

export class OverviewStatsDto {
  @ApiProperty({ example: 120 })
  totalTasks: number;

  @ApiProperty({ example: 80 })
  completedTasks: number;

  @ApiProperty({ example: 10 })
  overdueTasks: number;

  @ApiProperty({ example: 5 })
  totalTeams: number;

  @ApiProperty({ example: 25 })
  totalMembers: number;
}

export class TaskStatusStatsDto {
  @ApiProperty({ example: "todo", description: "Task status" })
  status: string;

  @ApiProperty({ example: 30 })
  count: number;

  @ApiProperty({ example: 25.0, description: "Percentage of total tasks" })
  percentage: number;
}

export class TaskPriorityStatsDto {
  @ApiProperty({ example: "high", description: "Task priority" })
  priority: string;

  @ApiProperty({ example: 15 })
  count: number;

  @ApiProperty({ example: 12.5 })
  percentage: number;
}

export class TaskAnalyticsDto {
  @ApiProperty({ type: [TaskStatusStatsDto] })
  byStatus: TaskStatusStatsDto[];

  @ApiProperty({ type: [TaskPriorityStatsDto] })
  byPriority: TaskPriorityStatsDto[];

  @ApiProperty({ example: 75.0 })
  completionRate: number;

  @ApiProperty({ example: 3.2, description: "Average completion time in days" })
  averageCompletionTime: number;
}

export class PersonalStatsDto {
  @ApiProperty({ example: 40 })
  tasksAssigned: number;

  @ApiProperty({ example: 30 })
  tasksCompleted: number;

  @ApiProperty({ example: 8 })
  tasksPending: number;

  @ApiProperty({ example: 75.0 })
  completionRate: number;

  @ApiProperty({ example: 2 })
  overdueTasks: number;
}

export class TeamStatsDto {
  @ApiProperty({ example: "team_123" })
  teamId: string;

  @ApiProperty({ example: "Frontend Team" })
  teamName: string;

  @ApiProperty({ example: 50 })
  totalTasks: number;

  @ApiProperty({ example: 40 })
  completedTasks: number;

  @ApiProperty({ example: 80.0 })
  completionRate: number;

  @ApiProperty({ example: 8 })
  memberCount: number;

  @ApiProperty({ example: 5 })
  overdueTasks: number;
}

export class MostActiveTeamDto {
  @ApiProperty({ example: "Backend Team" })
  name: string;

  @ApiProperty({ example: 25 })
  taskCount: number;
}

export class RecentActivityDto {
  @ApiProperty({ example: "Task Created" })
  action: string;

  @ApiProperty({ example: 'User John created a new task "Fix login bug"' })
  details: string;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ example: "Frontend Team", required: false })
  teamName?: string;
}

export class ActivityStatsDto {
  @ApiProperty({ example: 12 })
  tasksCreatedThisWeek: number;

  @ApiProperty({ example: 9 })
  tasksCompletedThisWeek: number;

  @ApiProperty({ type: MostActiveTeamDto, nullable: true })
  mostActiveTeam: MostActiveTeamDto | null;

  @ApiProperty({ type: [RecentActivityDto] })
  recentActivity: RecentActivityDto[];
}

export class TopPerformerDto {
  @ApiProperty({ example: "user_123" })
  userId: string;

  @ApiProperty({ example: "Jane Doe" })
  username: string;

  @ApiProperty({ example: 20 })
  completedTasks: number;

  @ApiProperty({ example: 25 })
  totalAssigned: number;

  @ApiProperty({ example: 80.0 })
  completionRate: number;
}

export class TaskDistributionDto {
  @ApiProperty({ example: "user_456" })
  userId: string;

  @ApiProperty({ example: "John Smith" })
  username: string;

  @ApiProperty({ example: 15 })
  assignedTasks: number;

  @ApiProperty({ example: 10 })
  completedTasks: number;

  @ApiProperty({ example: 5 })
  pendingTasks: number;
}

export class WorkloadStatsDto {
  @ApiProperty({ type: [TopPerformerDto] })
  topPerformers: TopPerformerDto[];

  @ApiProperty({ type: [TaskDistributionDto] })
  taskDistribution: TaskDistributionDto[];
}

export class TimeSeriesDto {
  @ApiProperty({ example: "2025-09-01" })
  date: string;

  @ApiProperty({ example: 5 })
  count: number;
}

export class TimeAnalyticsDto {
  @ApiProperty({ type: [TimeSeriesDto] })
  tasksCreatedLast7Days: TimeSeriesDto[];

  @ApiProperty({ type: [TimeSeriesDto] })
  tasksCompletedLast7Days: TimeSeriesDto[];

  @ApiProperty({ example: 6.5 })
  averageTasksPerDay: number;

  @ApiProperty({ example: "Wednesday" })
  peakActivityDay: string;
}

export class DashboardAnalyticsResponse {
  @ApiProperty({ type: OverviewStatsDto })
  overview: OverviewStatsDto;

  @ApiProperty({ type: TaskAnalyticsDto })
  taskStats: TaskAnalyticsDto;

  @ApiProperty({ type: PersonalStatsDto })
  personalStats: PersonalStatsDto;

  @ApiProperty({ type: [TeamStatsDto] })
  teamStats: TeamStatsDto[];

  @ApiProperty({ type: ActivityStatsDto })
  activityStats: ActivityStatsDto;

  @ApiProperty({ type: WorkloadStatsDto })
  workloadStats: WorkloadStatsDto;

  @ApiProperty({ type: TimeAnalyticsDto })
  timeAnalytics: TimeAnalyticsDto;
}
