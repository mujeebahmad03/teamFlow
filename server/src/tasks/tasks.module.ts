import { Module } from "@nestjs/common";
import { DashboardAnalyticsService, TasksService } from "./services";
import { DashboardAnalyticsController, TasksController } from "./controllers";

@Module({
  controllers: [TasksController, DashboardAnalyticsController],
  providers: [TasksService, DashboardAnalyticsService],
})
export class TasksModule {}
