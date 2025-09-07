"use client";

import { motion } from "framer-motion";
import { Calendar, Download, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardHeaderProps {
  lastUpdated?: Date;
  onRefresh?: () => void;
  onExport?: () => void;
}

export function DashboardHeader({
  lastUpdated = new Date(),
  onRefresh,
  onExport,
}: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-balance">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your team's performance and productivity metrics
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  className="ml-4 bg-transparent"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={onExport}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
