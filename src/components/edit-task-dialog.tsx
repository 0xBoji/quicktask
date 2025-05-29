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
import { useState } from "react";
import { Edit } from "lucide-react";
import { Task } from "@/types";
import { EditTaskForm } from "@/components/edit-task-form";

interface EditTaskDialogProps {
  task: Task;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function EditTaskDialog({ task, onSuccess, trigger }: EditTaskDialogProps) {
  const [open, setOpen] = useState(false);

  function handleSuccess() {
    setOpen(false);
    if (onSuccess) onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update your task details. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <EditTaskForm
          task={task}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
