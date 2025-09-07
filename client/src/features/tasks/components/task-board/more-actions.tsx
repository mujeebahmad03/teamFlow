"use client";

import { Edit, Eye, MoreHorizontal, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";

import { ReusableDropdownMenu } from "@/components/common";
import { Button } from "@/components/ui/button";
import { TaskDeleteDialog } from "./delete-dialog";
import { UpdateTaskDialog } from "../update-task-dialog";
import { AssignTask } from "../assign-task";
import { TaskDetailsDialog } from "../task-details-dialog";

import { Task } from "@/tasks/types";

export function MoreAction({ task }: { task: Task }) {
  const [modalState, setModalState] = useState({
    assign: false,
    update: false,
    delete: false,
    details: false,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleAssignClick = () => {
    setDropdownOpen(false);
    setModalState((prev) => ({ ...prev, assign: true }));
  };

  const handleUpdateClick = () => {
    setDropdownOpen(false);
    setModalState((prev) => ({ ...prev, details: false, update: true }));
  };

  const handleDeleteClick = () => {
    setDropdownOpen(false);
    setModalState((prev) => ({ ...prev, delete: true }));
  };

  const handleDetailsClick = () => {
    setDropdownOpen(false);
    setModalState((prev) => ({ ...prev, details: true }));
  };

  // Define menu items
  const menuItems = [
    {
      icon: Eye,
      label: "View Details",
      onClick: handleDetailsClick,
      className: "cursor-pointer",
    },
    {
      icon: UserPlus,
      label: "Assign",
      onClick: handleAssignClick,
      className: "cursor-pointer",
    },
    {
      icon: Edit,
      label: "Edit Task",
      onClick: handleUpdateClick,
      className: "cursor-pointer",
    },
    {
      icon: Trash2,
      label: "Delete Task",
      onClick: handleDeleteClick,
      className: "cursor-pointer text-destructive focus:text-destructive",
    },
  ];

  // Custom trigger button
  const customTrigger = (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0 hover:bg-muted"
      onClick={(e) => e.stopPropagation()}
    >
      <MoreHorizontal className="h-3 w-3" />
      <span className="sr-only">More options</span>
    </Button>
  );

  return (
    <>
      <ReusableDropdownMenu
        customTrigger={customTrigger}
        menuItems={menuItems}
        contentWidth="w-40"
        align="end"
        open={dropdownOpen}
        onOpenChange={setDropdownOpen}
      />

      {/* Modals */}
      <AssignTask
        task={task}
        open={modalState.assign}
        setOpen={(open) => setModalState((prev) => ({ ...prev, assign: open }))}
      />

      <UpdateTaskDialog
        task={task}
        open={modalState.update}
        setOpen={(open) => setModalState((prev) => ({ ...prev, update: open }))}
      />

      <TaskDeleteDialog
        task={task}
        teamId={task.teamId}
        open={modalState.delete}
        onOpenChange={(open) =>
          setModalState((prev) => ({ ...prev, delete: open }))
        }
      />

      <TaskDetailsDialog
        task={task}
        open={modalState.details}
        onOpenChange={(open) =>
          setModalState((prev) => ({ ...prev, details: open }))
        }
        onEdit={handleUpdateClick}
      />
    </>
  );
}
