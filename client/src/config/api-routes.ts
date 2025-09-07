export const apiRoutes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refreshAccessToken: "/auth/refresh",
    logout: "/auth/logout",
  },
  users: {
    getProfile: "/users/profile",
    updateProfile: "/users/update-profile",
  },
  dashboard: {
    getTeamAnalytics: (teamId: string) =>
      `/teams/${teamId}/dashboard/analytics`,
    getAllAnalytics: "dashboard/all-analytics",
  },
  teams: {
    getTeams: "/teams",
    createTeam: "/teams",
    getTeamMembers: (teamId: string) => `/teams/${teamId}/members`,
    inviteUser: (teamId: string) => `/teams/${teamId}/invite`,
    bulkInviteUsers: (teamId: string) => `/teams/${teamId}/bulk-invite`,
    removeUser: (teamId: string, userId: string) =>
      `/teams/${teamId}/members/${userId}`,
    bulkRemoveUsers: (teamId: string) => `/teams/${teamId}/bulk-remove`,
    getTeamInvitations: "/teams/invitations",
    acceptInvitation: (invitationId: string) =>
      `/teams/invitations/${invitationId}/accept`,
  },
  tasks: {
    createTask: (teamId: string) => `teams/${teamId}/tasks`,
    getTasks: (teamId: string) => `teams/${teamId}/tasks`,
    getBoardTasks: (teamId: string) => `teams/${teamId}/tasks/board`,
    getTask: (teamId: string, taskId: string) =>
      `teams/${teamId}/tasks/${taskId}`,
    updateTask: (teamId: string, taskId: string) =>
      `teams/${teamId}/tasks/${taskId}`,
    deleteTask: (teamId: string, taskId: string) =>
      `teams/${teamId}/tasks/${taskId}`,
    assignTask: (teamId: string, taskId: string) =>
      `teams/${teamId}/tasks/${taskId}/assign`,
  },
} as const;
