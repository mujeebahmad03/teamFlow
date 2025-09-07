"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  DateFormField,
  InputFormField,
  SelectFormField,
  TextareaFormField,
} from "@/components/form-fields";
import { LoadingButton } from "@/components/ui/loading-button";
import { AssignmentField } from "./assignment-field";

import { cn } from "@/lib/utils";
import {
  CreateTaskFormData,
  UpdateTaskFormData,
  createTaskSchema,
  updateTaskSchema,
} from "@/tasks/validations";
import { useCreateTask, useUpdateTask } from "@/tasks/hooks";
import { getPriorityColor, getStatusColor } from "@/tasks/utils";

import { Task, TaskPriority, TaskStatus } from "@/tasks/types";
import { TeamMember } from "@/teams/types";

interface TaskFormProps {
  mode: "create" | "edit";
  task?: Task;
  teamMembers: TeamMember[];
  teamId: string;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskForm = ({
  teamId,
  mode,
  onOpenChange,
  task,
  teamMembers,
}: TaskFormProps) => {
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const createTaskMutation = useCreateTask(teamId);
  const updateTaskMutation = useUpdateTask(teamId, task?.id ?? "");
  const isLoading =
    createTaskMutation.isPending || updateTaskMutation.isPending;

  const schema = mode === "create" ? createTaskSchema : updateTaskSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? TaskStatus.TODO,
      priority: task?.priority ?? TaskPriority.MEDIUM,
      assignedTo: task?.assignedTo ?? "",
      dueDate: new Date(task?.dueDate ?? new Date()),
    },
  });

  const selectedAssignee = teamMembers.find(
    (member) => member.userId === form.watch("assignedTo"),
  );

  const handleSubmit = async (
    data: CreateTaskFormData | UpdateTaskFormData,
  ) => {
    try {
      if (mode === "create") {
        await createTaskMutation.mutateAsync(data as CreateTaskFormData);
      } else if (task) {
        await updateTaskMutation.mutateAsync(data);
      }
    } catch (error) {
      console.log({ error });
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-4">
          {/* Title Field */}
          <InputFormField
            form={form}
            name="title"
            label="Title"
            placeholder="Enter task title..."
            required
          />

          {/* Description Field */}
          <TextareaFormField
            form={form}
            name="description"
            label="Description"
            placeholder="Add a description for this task..."
            description="Optional. Provide additional context or requirements."
            rows={3}
          />

          {/* Status and Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectFormField
              control={form.control}
              name="status"
              label="Status"
              placeholder="Select status"
              options={Object.values(TaskStatus)}
              getLabel={(status) => status.replace("_", " ")}
              getValue={(status) => status}
              renderOption={(status) => (
                <span className={cn("font-medium", getStatusColor(status))}>
                  {status}
                </span>
              )}
            />

            <SelectFormField
              control={form.control}
              name="priority"
              label="Priority"
              placeholder="Select priority"
              options={Object.values(TaskPriority)}
              getLabel={(priority) => priority}
              getValue={(priority) => priority}
              renderOption={(priority) => (
                <span className={cn("font-medium", getPriorityColor(priority))}>
                  {priority}
                </span>
              )}
            />
          </div>

          {/* Assignee Field */}
          <AssignmentField
            form={form}
            name="assignedTo"
            assigneeOpen={assigneeOpen}
            setAssigneeOpen={setAssigneeOpen}
            selectedAssignee={selectedAssignee}
            teamMembers={teamMembers}
            description="Optional. Choose a team member to assign this task to."
          />

          {/* Due Date Field */}
          <DateFormField
            form={form}
            name="dueDate"
            label="Due Date"
            description="Optional. Set a deadline for this task."
            disabledDates={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0))
            }
          />
        </div>

        <DialogFooter className="gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <LoadingButton
            isLoading={isLoading}
            type="submit"
            className="w-auto"
            disabled={isLoading}
          >
            {mode === "create" ? "Create Task" : "Update Task"}
          </LoadingButton>
        </DialogFooter>
      </form>
    </Form>
  );
};
