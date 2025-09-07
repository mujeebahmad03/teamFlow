import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  getSchemaPath,
  ApiExtraModels,
  ApiParam,
} from "@nestjs/swagger";
import { DashboardAnalyticsService } from "../services/";
import { CurrentUser, RequireTeamAccess } from "src/common/decorators";
import { UserSelect } from "src/types/auth.types";
import { JwtAuthGuard, TeamAccessGuard } from "src/common/guards";
import { DashboardAnalyticsResponse } from "../dto";
import { ResponseModel } from "src/models/global.model";

@ApiTags("Dashboard Analytics")
@Controller("dashboard")
@UseGuards(JwtAuthGuard)
@ApiExtraModels(DashboardAnalyticsResponse, ResponseModel)
export class DashboardAnalyticsController {
  constructor(
    private readonly dashboardAnalyticsService: DashboardAnalyticsService,
  ) {}

  @Get("all-analytics")
  @ApiOperation({ summary: "Get dashboard analytics" })
  @ApiOkResponse({
    description: "Dashboard analytics retrieved successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              items: { $ref: getSchemaPath(DashboardAnalyticsResponse) },
            },
          },
        },
      ],
    },
  })
  async getDashboardAnalytics(@CurrentUser() user: UserSelect) {
    return this.dashboardAnalyticsService.getDashboardAnalytics(user.id);
  }

  @Get(":teamId/team-analytics")
  @UseGuards(TeamAccessGuard)
  @RequireTeamAccess()
  @ApiOperation({ summary: "Get dashboard analytics" })
  @ApiParam({ name: "teamId", required: true, description: "Team ID" })
  @ApiOkResponse({
    description: "Dashboard analytics retrieved successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              items: { $ref: getSchemaPath(DashboardAnalyticsResponse) },
            },
          },
        },
      ],
    },
  })
  async getTeamAnalytics(
    @CurrentUser() user: UserSelect,
    @Param("teamId") teamId: string,
  ) {
    return this.dashboardAnalyticsService.getDashboardAnalytics(
      user.id,
      teamId,
    );
  }
}
