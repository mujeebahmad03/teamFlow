"use client";

import { CalendarIcon, ClockIcon, Edit, UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { formatDate, getInitials } from "@/lib/utils";
import { priorityColors, statusColors } from "@/tasks/utils";
import { type Task } from "@/tasks/types";
import { Button } from "@/components/ui/button";

interface TaskDetailsModalProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
}

export const TaskDetailsDialog = ({
  task,
  open,
  onOpenChange,
  onEdit,
}: TaskDetailsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-balance">
            {task.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Badge className={statusColors[task.status]} variant="secondary">
                {task.status.replace("_", " ")}
              </Badge>
              <Badge
                className={priorityColors[task.priority]}
                variant="secondary"
              >
                {task.priority} Priority
              </Badge>
            </div>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {task.description}
              </p>
            </div>
          )}

          {/* Assignee */}
          {task.assignee && (
            <div>
              <h3 className="font-medium mb-2">Assigned to</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={task.assignee.profileImage || "/placeholder.svg"}
                    alt={task.assignee.username}
                  />
                  <AvatarFallback className="text-xs">
                    {getInitials(
                      task.assignee.firstName,
                      task.assignee.lastName,
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{task.assignee.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {task.assignee.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Due Date</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                {formatDate(task.dueDate)}
              </p>
            </div>

            {task.completedAt && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Completed</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  {formatDate(task.completedAt)}
                </p>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="border-t pt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Created:</span>
                <p className="text-muted-foreground">
                  {formatDate(task.createdAt)}
                </p>
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>
                <p className="text-muted-foreground">
                  {formatDate(task.updatedAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Task ID:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                {task.id}
              </code>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
