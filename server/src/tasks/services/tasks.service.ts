import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ResponseHelperService } from "src/helper/response-helper.service";
import { PaginationHelperService } from "src/helper/pagination-helper.service";
import { HelperService } from "src/helper/helper.service";
import { ResponseModel } from "src/models/global.model";
import { QueryOptionsDto } from "src/common/dto";
import {
  AssignTaskDto,
  CreateTaskDto,
  TaskResponseModel,
  UpdateTaskDto,
} from "../dto";
import { Prisma } from "prisma/generated/prisma/client";
import { TaskPriority, TaskStatus } from "prisma/generated/prisma/enums";

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly taskResponseHelper: ResponseHelperService<TaskResponseModel>,
    private readonly tasksResponseHelper: PaginationHelperService<
      TaskResponseModel[]
    >,
    private readonly helperService: HelperService,
  ) {}

  async listTasks(
    teamId: string,
    userId: string,
    query?: QueryOptionsDto,
  ): Promise<ResponseModel<TaskResponseModel[]>> {
    const { limit = 10, page = 1, searchKey = "", filters } = query || {};
    const skip = (page - 1) * limit;

    // Ensure membership
    await this.validateTeamMember(
      teamId,
      userId,
      "You don't have access to this team",
    );

    const where: Prisma.TaskWhereInput = {
      teamId,
      ...(searchKey && {
        OR: [
          { title: { contains: searchKey, mode: "insensitive" } },
          { description: { contains: searchKey, mode: "insensitive" } },
        ],
      }),
      ...(filters?.status && {
        status: { equals: filters.status.eq as TaskStatus },
      }),
      ...(filters?.priority && {
        priority: { equals: filters.priority.eq as TaskPriority },
      }),
      ...(filters?.assignedTo && {
        assignedTo: { equals: filters.assignedTo.eq as string },
      }),
    };

    const [tasks, count] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              email: true,
              profileImage: true,
            },
          },
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    const pagination = this.helperService.paginate(count, page, limit);

    return this.tasksResponseHelper.returnSuccessObjectWithPagination(
      "Tasks retrieved successfully",
      tasks,
      pagination,
    );
  }

  async createTask(
    teamId: string,
    creatorId: string,
    dto: CreateTaskDto,
  ): Promise<ResponseModel<TaskResponseModel>> {
    // Validate creator membership
    await this.validateTeamMember(
      teamId,
      creatorId,
      "You don't have access to this team",
    );

    // Validate assignee if provided
    if (dto.assigneeId) {
      await this.validateTeamMember(
        teamId,
        dto.assigneeId,
        "Assignee must be a member of the team",
      );
    }

    const task = await this.prisma.task.create({
      data: {
        teamId,
        createdBy: creatorId,
        title: dto.title,
        description: dto.description,
        priority: dto.priority || TaskPriority.MEDIUM,
        status: dto.status || TaskStatus.TODO,
        assignedTo: dto.assigneeId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        completedAt: dto.status === TaskStatus.DONE ? new Date() : null,
      },
    });

    return this.taskResponseHelper.returnSuccessObject(
      "Task created successfully",
      task,
    );
  }

  async getTask(
    teamId: string,
    taskId: string,
    userId?: string,
  ): Promise<ResponseModel<TaskResponseModel>> {
    // If userId is provided, validate team membership
    if (userId) {
      await this.validateTeamMember(
        teamId,
        userId,
        "You don't have access to this team",
      );
    }

    const task = await this.findTaskByIdAndTeam(taskId, teamId);

    return this.taskResponseHelper.returnSuccessObject(
      "Task retrieved successfully",
      task,
    );
  }

  async updateTask(
    teamId: string,
    taskId: string,
    dto: UpdateTaskDto,
  ): Promise<ResponseModel<TaskResponseModel>> {
    // Validate task exists and belongs to team
    await this.findTaskByIdAndTeam(taskId, teamId);

    // Validate new assignee if provided
    if (dto.assigneeId) {
      await this.validateTeamMember(
        teamId,
        dto.assigneeId,
        "Assignee must be a member of the team",
      );
    }

    const updateData: Prisma.TaskUpdateInput = {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.priority !== undefined && { priority: dto.priority }),
      ...(dto.assigneeId !== undefined && { assignedTo: dto.assigneeId }),
      ...(dto.dueDate !== undefined && {
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      }),
    };

    // Handle completedAt logic
    if (dto.status !== undefined) {
      updateData.completedAt =
        dto.status === TaskStatus.DONE ? new Date() : null;
    }

    const updated = await this.prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    return this.taskResponseHelper.returnSuccessObject(
      "Task updated successfully",
      updated,
    );
  }

  async deleteTask(
    teamId: string,
    taskId: string,
  ): Promise<ResponseModel<TaskResponseModel>> {
    // Validate task exists and belongs to team
    await this.findTaskByIdAndTeam(taskId, teamId);

    await this.prisma.task.delete({ where: { id: taskId } });

    return this.taskResponseHelper.returnSuccessObject(
      "Task deleted successfully",
    );
  }

  async assignTask(
    teamId: string,
    taskId: string,
    dto: AssignTaskDto,
  ): Promise<ResponseModel<TaskResponseModel>> {
    // Validate assignee is team member
    await this.validateTeamMember(
      teamId,
      dto.assigneeId,
      "Assignee must be a member of the team",
    );

    // Validate task exists and belongs to team
    await this.findTaskByIdAndTeam(taskId, teamId);

    const updated = await this.prisma.task.update({
      where: { id: taskId },
      data: { assignedTo: dto.assigneeId },
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            profileImage: true,
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });

    return this.taskResponseHelper.returnSuccessObject(
      "Task assigned successfully",
      updated,
    );
  }

  // Private helper methods
  private async validateTeamMember(
    teamId: string,
    userId: string,
    errorMessage: string = "User is not a member of the team",
  ): Promise<void> {
    const member = await this.prisma.teamMember.findUnique({
      where: { userId_teamId: { userId, teamId } },
      select: { id: true },
    });

    if (!member) {
      if (errorMessage.includes("access")) {
        this.taskResponseHelper.throwForbidden(errorMessage);
      } else {
        this.taskResponseHelper.throwBadRequest(errorMessage);
      }
    }
  }

  private async findTaskByIdAndTeam(taskId: string, teamId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            profileImage: true,
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });

    if (!task || task.teamId !== teamId) {
      this.taskResponseHelper.throwNotFound("Task not found");
    }

    return task;
  }
}
