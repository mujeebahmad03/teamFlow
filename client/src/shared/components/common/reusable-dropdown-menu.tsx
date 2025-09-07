import { ChevronDown } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  className?: string; // Allow custom styling for individual items
}

interface ReusableDropdownMenuProps {
  triggerText?: string;
  triggerVariant?:
    | "primary"
    | "mono"
    | "destructive"
    | "secondary"
    | "outline"
    | "dashed"
    | "ghost"
    | "dim"
    | "foreground"
    | "inverse";
  customTrigger?: React.ReactNode; // New prop for custom trigger
  menuItems: MenuItem[];
  contentWidth?: string;
  align?: "start" | "center" | "end";
  open?: boolean; // Allow external control of open state
  onOpenChange?: (open: boolean) => void; // Allow external control of open state
}

export function ReusableDropdownMenu({
  triggerText,
  triggerVariant = "primary",
  customTrigger,
  menuItems,
  contentWidth = "w-56",
  align = "end",
  open,
  onOpenChange,
}: ReusableDropdownMenuProps) {
  // Determine which trigger to use
  const triggerElement = customTrigger ? (
    customTrigger
  ) : (
    <Button variant={triggerVariant}>
      {triggerText}
      <ChevronDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{triggerElement}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={contentWidth}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <DropdownMenuItem
              key={uuidv4()}
              onClick={item.onClick}
              className={item.className}
            >
              <IconComponent className="mr-2 h-4 w-4" />
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
