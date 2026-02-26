
import React, { useState } from "react";
import { GripVertical } from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/utils/util";

export interface SortableItemData {
    id: string;
    [key: string]: unknown;
}

function SortableItem<T extends SortableItemData>({
    item,
    renderItem,
}: {
    item: T;
    renderItem: (item: T) => React.ReactNode;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                "bg-(--color-bg-secondary) border border-(--color-border)",
                isDragging
                    ? "opacity-50 shadow-(--shadow-elevated) z-10"
                    : "hover:bg-(--color-bg-hover)",
            )}
        >
            <button
                {...attributes}
                {...listeners}
                className="shrink-0 p-0.5 rounded cursor-grab active:cursor-grabbing text-(--color-text-disabled) hover:text-(--color-text-tertiary) touch-none"
            >
                <GripVertical className="w-4 h-4" />
            </button>
            <div className="flex-1">{renderItem(item)}</div>
        </div>
    );
}

export interface SortableListProps<T extends SortableItemData> {
    items: T[];
    onReorder: (items: T[]) => void;
    renderItem: (item: T) => React.ReactNode;
    className?: string;
}

export function SortableList<T extends SortableItemData>({
    items,
    onReorder,
    renderItem,
    className,
}: SortableListProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 4 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        onReorder(arrayMove(items, oldIndex, newIndex));
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <div className={cn("flex flex-col gap-1.5", className)}>
                    {items.map((item) => (
                        <SortableItem
                            key={item.id}
                            item={item}
                            renderItem={renderItem}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
