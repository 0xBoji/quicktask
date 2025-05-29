"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "@/components/task-form";
import { useState } from "react";
import { Plus } from "lucide-react";

interface TaskDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function TaskDialog({ onSuccess, trigger }: TaskDialogProps) {
  const [open, setOpen] = useState(false);

  function handleSuccess() {
    setOpen(false);
    if (onSuccess) onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your list. Click create when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}