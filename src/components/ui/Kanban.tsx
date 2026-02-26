import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';

export type Task = { id: string; content: string; status: string; tag?: string };
export type Columns = Record<string, Task[]>;

export interface KanbanBoardProps {
  initialData: Columns;
  className?: string;
}

export const KanbanBoard = ({ initialData, className }: KanbanBoardProps) => {
  const [data, setData] = useState(initialData);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // 1. Drag Start
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(task));
    
    // Optional: Set custom drag image if needed
    // e.dataTransfer.setDragImage(img, 0, 0);
  };

  // 2. Drag Over (Drop Zone 감지)
  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault(); // allow drop
    setDragOverColumn(colId);
  };

  const handleDragLeave = () => {
      // Optional: Logic to clear highlight if leaving container completely
      // But clearing here often causes flicker if not careful with bubbling
  }

  // 3. Drop (데이터 이동)
  const handleDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (!draggedTask) return;

    // Deep copy for immutability
    const newData: Columns = JSON.parse(JSON.stringify(data));
    
    // Remove from all source columns
    Object.keys(newData).forEach(key => {
        newData[key] = newData[key].filter(t => t.id !== draggedTask.id);
    });

    // Add to target column
    newData[targetColId].push({ ...draggedTask, status: targetColId });
    
    setData(newData);
    setDraggedTask(null);
  };

  // 4. Drag End (Cleanup if dropped outside or cancelled)
  const handleDragEnd = () => {
      setDraggedTask(null);
      setDragOverColumn(null);
  }

  return (
    <div className={cn("flex h-full w-full gap-4 overflow-x-auto p-1", className)}>
      {Object.entries(data).map(([colId, tasks]) => (
        <div
          key={colId}
          // Lane Container
          className={cn(
            "flex h-full min-w-[300px] w-[300px] flex-col rounded-lg border border-border-default bg-background-secondary backdrop-blur-md transition-all duration-200",
            dragOverColumn === colId && "border-border-strong bg-background-tertiary" // Highlight with border instead of shadow
          )}
          onDragOver={(e) => handleDragOver(e, colId)}
          onDrop={(e) => handleDrop(e, colId)}
          onDragLeave={handleDragLeave}
        >
          {/* Lane Header */}
          <div className={cn(
              "sticky top-0 z-10 flex items-center justify-between p-4 border-t-4 bg-background-tertiary/50 backdrop-blur-sm rounded-t-lg mb-2",
              // Color coding based on semantic status
              colId === 'Todo' ? "border-t-border-default" :
              colId === 'In Progress' ? "border-t-action-primary" :
              colId === 'Review' ? "border-t-status-warning-text" :
              colId === 'Done' ? "border-t-status-success-text" : "border-t-border-emphasis"
          )}>
            <div className="flex items-baseline gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-content-primary">{colId}</h3>
                <span className="text-xs text-content-tertiary font-medium">{tasks.length}</span>
            </div>
          </div>

          {/* Lane Body */}
          <div className="flex-1 flex flex-col gap-3 p-3 pt-0 overflow-y-auto min-h-[150px]">
            {tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                onDragEnd={handleDragEnd}
                className="group cursor-grab active:cursor-grabbing touch-none"
              >
                <Card 
                  className={cn(
                      "transition-all duration-200 border-border-default select-none shadow-none hover:border-border-strong rounded-lg",
                      // Shake animation or scale effects could go here
                      "active:scale-[1.02] active:rotate-1" 
                  )}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-content-primary leading-snug">{task.content}</p>
                    </div>
                    {task.tag && (
                         <span className={cn(
                             "inline-block text-xs px-2 py-0.5 rounded-lg font-semibold uppercase tracking-wide",
                             task.tag === 'Design' ? "bg-status-info-bg text-status-info-text border border-status-info-border" :
                             task.tag === 'Dev' ? "bg-status-success-bg text-status-success-text border border-status-success-border" :
                             "bg-background-secondary text-content-primary border border-border-default"
                         )}>
                             {task.tag}
                         </span>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
            {/* Empty State placeholder if needed, but min-h on body handles drop zone area */}
            {tasks.length === 0 && (
                <div className="h-24 border-2 border-dashed border-border-default rounded-lg flex items-center justify-center text-xs text-content-tertiary">
                    Empty
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
