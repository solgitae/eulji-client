
import React from "react";
import { Plus, ChevronRight, History, User, Tag, Target, Calendar } from "lucide-react";
import { cn } from "@/utils/util";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { PropertyRow } from "@/components/ui/PropertyRow";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { InlineEditor } from "@/components/ui/InlineEditor";
import {
    SidePanelSection,
    SidePanelDivider,
} from "@/components/ui/SidePanel";

// --- Types ---

export interface Milestone {
    id: string;
    title: string;
    dueDate?: string;
}

export interface ActivityItem {
    id: string;
    userName: string;
    userAvatar?: string;
    action: string;
    date: string;
}

export interface ProjectRightPanelProps {
    project?: {
        name: string;
        description?: string;
        clients?: { name: string };
        status?: string;
    };
    milestones?: Milestone[];
    scopeCount?: number;
    completedCount?: number;
    assignees?: { name: string; avatar?: string }[];
    labels?: { name: string; color?: string }[];
    activities?: ActivityItem[];
    isLoading?: boolean;
    onUpdate?: (field: string, value: any) => void;
}

// --- Sub-components ---

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between h-8 mb-1">
            <h3 className="text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-widest">
                {title}
            </h3>
            {action}
        </div>
    );
}

const MilestoneSection = ({
    milestones = [],
    isLoading,
}: {
    milestones?: Milestone[];
    isLoading?: boolean;
}) => {
    return (
        <SidePanelSection flat>
            <SectionHeader 
                title="마일스톤" 
                action={
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-(--color-text-tertiary) hover:text-(--color-text-primary)">
                        <Plus className="w-4 h-4" />
                    </Button>
                } 
            />
            
            <div className="space-y-1">
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton variant="text" className="w-full h-8" />
                        <Skeleton variant="text" className="w-full h-8" />
                    </div>
                ) : milestones.length > 0 ? (
                    milestones.map((m) => (
                        <div key={m.id} className="flex items-center justify-between h-9 px-2 rounded-md hover:bg-(--color-bg-hover) group cursor-pointer transition-colors">
                            <span className="text-[13px] text-(--color-text-primary) font-medium truncate">{m.title}</span>
                            <div className="flex items-center gap-2 shrink-0">
                                {m.dueDate && <span className="text-[11px] text-(--color-text-tertiary)">{m.dueDate}</span>}
                                <ChevronRight className="w-3.5 h-3.5 text-(--color-text-tertiary) opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-4 text-center border border-dashed border-(--color-border) rounded-lg bg-(--color-bg-secondary)/30">
                        <p className="text-[11px] text-(--color-text-tertiary)">설정된 마일스톤이 없습니다.</p>
                    </div>
                )}
            </div>
        </SidePanelSection>
    );
};

const ProgressSection = ({
    scope,
    completed,
    isLoading,
}: {
    scope: number;
    completed: number;
    isLoading?: boolean;
}) => {
    const progress = scope > 0 ? Math.round((completed / scope) * 100) : 0;

    if (isLoading) {
        return (
            <SidePanelSection flat>
                <div className="flex items-center gap-4 p-4 rounded-xl border border-(--color-border) bg-(--color-bg-secondary)/50">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/3" />
                    </div>
                </div>
            </SidePanelSection>
        );
    }

    return (
        <SidePanelSection flat>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-(--color-border) bg-(--color-bg-secondary)/30">
                <CircularProgress value={progress} size={48} strokeWidth={5} showLabel />
                <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-(--color-text-primary)">{progress}% 완료됨</span>
                    <span className="text-[11px] text-(--color-text-tertiary)">{completed} / {scope} 태스크 완료</span>
                </div>
            </div>
        </SidePanelSection>
    );
};

const ActivitySection = ({
    activities = [],
}: {
    activities?: ActivityItem[];
}) => {
    return (
        <SidePanelSection flat>
            <SectionHeader 
                title="최근 활동" 
                action={
                    <button className="text-[11px] text-(--color-accent) hover:underline font-bold uppercase tracking-tighter">
                        View All
                    </button>
                } 
            />
            
            <div className="relative pt-2">
                {activities.length > 0 ? (
                    <div className="space-y-6">
                        {activities.map((item, idx) => (
                            <div key={item.id} className="relative flex gap-3 group">
                                {idx !== activities.length - 1 && (
                                    <div className="absolute left-[11px] top-[24px] bottom-[-24px] w-px bg-(--color-border)" />
                                )}
                                <Avatar name={item.userName} src={item.userAvatar} size="xs" className="z-10 ring-2 ring-(--color-bg-primary)" />
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[13px] font-bold text-(--color-text-primary) truncate">{item.userName}</span>
                                        <span className="text-[10px] text-(--color-text-tertiary) shrink-0 uppercase font-medium">{item.date}</span>
                                    </div>
                                    <p className="text-[12px] text-(--color-text-secondary) leading-snug">
                                        {item.action}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center bg-(--color-bg-secondary)/30 rounded-lg border border-dashed border-(--color-border)">
                        <History className="w-8 h-8 text-(--color-text-tertiary) mb-2 opacity-10" />
                        <p className="text-[11px] text-(--color-text-tertiary)">최근 활동 내역이 없습니다.</p>
                    </div>
                )}
            </div>
        </SidePanelSection>
    );
};

// --- Main Component ---

export function ProjectRightPanel({
    project,
    milestones = [],
    scopeCount = 0,
    completedCount = 0,
    assignees = [],
    labels = [],
    activities = [],
    isLoading = false,
    onUpdate,
}: ProjectRightPanelProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-8 p-5">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                </div>
                <Skeleton className="h-32 w-full" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 bg-(--color-bg-primary) h-full overflow-y-auto custom-scrollbar p-5 pb-20">
            {/* Header / Meta */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <SectionHeader title="Project Info" />
                    <div className="space-y-1">
                        <PropertyRow 
                            variant="ghost"
                            icon={<Target className="w-3.5 h-3.5" />}
                            label="Client"
                            value={project?.clients?.name || "No client"}
                            readonly
                        />
                        <PropertyRow 
                            variant="ghost"
                            icon={<User className="w-3.5 h-3.5" />}
                            label="Assignees"
                            value={assignees.length > 0 ? assignees.map(a => a.name).join(", ") : "Unassigned"}
                            options={assignees.map(a => ({ value: a.name, label: a.name }))}
                        />
                        <PropertyRow 
                            variant="ghost"
                            icon={<Tag className="w-3.5 h-3.5" />}
                            label="Labels"
                            value={labels.length > 0 ? labels.map(l => l.name).join(", ") : "No labels"}
                            multiSelect
                            selectedValues={labels.map(l => l.name)}
                            options={labels.map(l => ({ value: l.name, label: l.name }))}
                        />
                    </div>
                </div>

                <SidePanelDivider className="mx-0 opacity-50" />
                
                <ProgressSection scope={scopeCount} completed={completedCount} />
            </div>

            <SidePanelDivider className="mx-0 opacity-50" />
            
            <MilestoneSection milestones={milestones} />
            
            <SidePanelDivider className="mx-0 opacity-50" />
            
            <ActivitySection activities={activities} />
        </div>
    );
}

export default ProjectRightPanel;
