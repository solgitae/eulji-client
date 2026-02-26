
import {
    Building2,
    ChevronDown,
    DollarSign,
    HeartHandshake,
    Inbox,
    Search,
    ShieldAlert,
    Users,
    Globe,
    ToggleRight,
    Settings,
    SquarePen,
    User2,
    Workflow,
    ArrowLeft,
    SearchIcon,
    Handshake,
    Calendar,
    ListCheck,
    UserPlus,
    Users2,
    LayoutDashboard,
    Columns3,
    Logs,
    InboxIcon,
    Group,
    LogOut,
    UserX,
    AlertTriangle,
    ArrowLeftRight,
    User,
    PieChart,
} from "lucide-react";
import { Image } from "@/components/ui/Image";
import { useSidebar } from "@/store/useSidebar";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/utils/util";
import {
    Dropdown,
    DropdownTrigger,
    DropdownButton,
    DropdownContent,
    DropdownItem,
    DropdownLabel,
    DropdownSeparator,
} from "@/components/ui/Dropdown";
import Tooltip from "@/components/ui/Tooltip";
import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useEffect, useState } from "react";
import ProfileModal from "@/components/ui/ProfileModal";

export default function Sidebar() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { isOpen, width, isResizing } = useSidebar();

    const isSettingsPage = pathname?.startsWith(`/dashboard/settings`);

    const companyName = "을지";
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [withdrawError, setWithdrawError] = useState<string | null>(null);

    const [showProfileModal, setShowProfileModal] = useState(false);

    const handleWithdraw = async () => {
        setIsWithdrawing(true);
        setWithdrawError(null);
        try {
            const res = await fetch("/api/users/withdraw", { method: "POST" });
            const json = await res.json();
            if (!res.ok) {
                setWithdrawError(
                    json.error || "탈퇴 처리 중 오류가 발생했습니다.",
                );
                setIsWithdrawing(false);
                return;
            }
            await supabase.auth.signOut();
            navigate("/login", { replace: true });
        } catch (err: any) {
            setWithdrawError(err.message);
            setIsWithdrawing(false);
        }
    };

    const defaultMenuItems = [
        {
            id: 1,
            name: "대시보드",
            icon: LayoutDashboard,
            path: `/dashboard`,
        },
        {
            id: 2,
            name: "수신함",
            icon: InboxIcon,
            path: `/dashboard/inbox`,
        },
    ];
    const mainMenuItems = [
        {
            id: 1,
            name: "리드",
            icon: Handshake,
            path: `/dashboard/leads`,
        },
        {
            id: 2,
            name: "고객",
            icon: Users,
            path: `/dashboard/clients`,
        },
        {
            id: 3,
            name: "프로젝트",
            icon: Workflow,
            path: `/dashboard/projects`,
        },
        {
            id: 4,
            name: "인보이스",
            icon: DollarSign,
            path: `/dashboard/invoices`,
        },
        {
            id: 5,
            name: "설정",
            icon: Settings,
            path: `/dashboard/settings`,
        },
    ];

    const settingsMenuItems = [
        {
            id: "general",
            name: "일반",
            icon: Settings,
            path: `/dashboard/settings#general`,
        },
        {
            id: "urls",
            name: "URL 및 내비게이션",
            icon: Globe,
            path: `/dashboard/settings#urls`,
        },
        {
            id: "features",
            name: "기능",
            icon: ToggleRight,
            path: `/dashboard/settings#features`,
        },
        {
            id: "danger",
            name: "위험 구역",
            icon: ShieldAlert,
            path: `/dashboard/settings#danger`,
        },
    ];

    return (
        <>
            <div
                style={{
                    width: isOpen
                        ? `${width}px`
                        : "var(--sidebar-width-collapsed)",
                }}
                className={cn(
                    "flex flex-col gap-2 h-full p-2",
                    !isResizing &&
                        "transition-[width] duration-200 ease-in-out",
                )}
            >
                <div className="flex justify-between items-center h-[48px] px-1">
                    <Dropdown>
                        <DropdownTrigger className="w-full">
                            <DropdownButton
                                className="w-full px-0 gap-0"
                                leftIconClassName="w-10 h-10"
                                rightIconClassName={cn(
                                    "transition-all duration-200 overflow-hidden",
                                    isOpen
                                        ? "w-4 opacity-100"
                                        : "w-0 opacity-0",
                                )}
                                leftIcon={
                                    <div className="w-6 h-6 rounded-md bg-(--color-bg-inverse) flex items-center justify-center shrink-0">
                                        <Image
                                            src="/logo.svg"
                                            alt="Logo"
                                            width={16}
                                            height={16}
                                        />
                                    </div>
                                }
                                rightIcon={
                                    <ChevronDown width={12} height={12} />
                                }
                            >
                                <div
                                    className={cn(
                                        "text-sm font-semibold transition-all duration-200 overflow-hidden text-left truncate",
                                        isOpen
                                            ? "max-w-[120px] opacity-100 ml-2"
                                            : "max-w-0 opacity-0 ml-0",
                                    )}
                                >
                                    {companyName}
                                </div>
                            </DropdownButton>
                        </DropdownTrigger>

                        <DropdownContent className="w-[220px]">
                            <DropdownLabel>워크스페이스</DropdownLabel>
                            <DropdownSeparator />
                            <DropdownItem
                                onClick={() =>
                                    navigate("/workspaces?switch=true")
                                }
                                icon={ArrowLeftRight}
                            >
                                워크스페이스 변경
                            </DropdownItem>
                            <DropdownItem
                                onClick={() =>
                                    navigate(`/dashboard/settings`)
                                }
                                icon={Settings}
                            >
                                워크스페이스 설정
                            </DropdownItem>
                        </DropdownContent>
                    </Dropdown>
                </div>

                <div className="flex flex-col flex-1 px-1 gap-2">
                    {!isSettingsPage ? (
                        <>
                            <div className="flex flex-col gap-0.5">
                                {!isOpen && (
                                <div className="h-px bg-(--color-border) mx-2 my-1" />
                            )}
                                <div
                                    className={cn(
                                        "flex items-center gap-1 mb-1 text-xs font-medium text-(--color-text-tertiary) transition-all duration-200 overflow-hidden h-4",
                                        !isOpen && "opacity-0 h-0 mb-0",
                                    )}
                                >
                                    <span>기본</span>
                                </div>
                                <div className="flex flex-col gap-0.5"></div>
                                {defaultMenuItems.map((item) => {
                                    const isActive =
                                        item.path === `/dashboard`
                                            ? pathname === item.path
                                            : pathname.startsWith(item.path);

                                    const content = (
                                        <Link
                                            key={item.id}
                                            className={cn(
                                                "flex items-center h-[32px] px-0 rounded-md hover:bg-(--color-bg-hover) group/link transition-colors",
                                                isActive &&
                                                    isOpen &&
                                                    "bg-(--color-bg-active)",
                                            )}
                                            to={item.path}
                                        >
                                            <div className="w-[40px] h-10 flex items-center justify-center shrink-0">
                                                <item.icon
                                                    className="stroke-(--color-icon) group-hover/link:stroke-(--color-text-primary) transition-colors"
                                                    width={16}
                                                    height={16}
                                                />
                                            </div>
                                            <div
                                                className={cn(
                                                    "text-sm font-medium text-(--color-text-primary) transition-all duration-200 overflow-hidden whitespace-nowrap",
                                                    isOpen
                                                        ? "max-w-[200px] opacity-100"
                                                        : "max-w-0 opacity-0",
                                                )}
                                            >
                                                {item.name}
                                            </div>
                                        </Link>
                                    );

                                    if (!isOpen) {
                                        return (
                                            <Tooltip
                                                key={item.id}
                                                content={item.name}
                                                side="right"
                                                wrapperClassName="w-full"
                                            >
                                                {content}
                                            </Tooltip>
                                        );
                                    }

                                    return content;
                                })}
                            </div>

        
                            <div className="flex flex-col gap-0.5">
                                {!isOpen && (
                                <div className="h-px bg-(--color-border) mx-2 my-1" />
                            )}
                                <div
                                    className={cn(
                                        "flex items-center gap-1 mb-1 text-xs font-medium text-(--color-text-tertiary) transition-all duration-200 overflow-hidden h-4",
                                        !isOpen && "opacity-0 h-0 mb-0",
                                    )}
                                >
                                    <span>업무</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    {mainMenuItems.map((item) => {
                                        const isActive = pathname.startsWith(
                                            item.path,
                                        );
                                        const content = (
                                            <Link
                                                key={item.id}
                                                className={cn(
                                                    "flex items-center h-[32px] px-0 rounded-md hover:bg-(--color-bg-hover) group/link transition-colors",
                                                    isActive &&
                                                        isOpen &&
                                                        "bg-(--color-bg-active)",
                                                )}
                                                to={item.path}
                                            >
                                                <div className="w-[40px] h-10 flex items-center justify-center shrink-0">
                                                    <item.icon
                                                        className="stroke-(--color-icon) group-hover/link:stroke-(--color-text-primary) transition-colors"
                                                        width={16}
                                                        height={16}
                                                    />
                                                </div>
                                                <div
                                                    className={cn(
                                                        "text-sm font-medium text-(--color-text-primary) transition-all duration-200 overflow-hidden whitespace-nowrap",
                                                        isOpen
                                                            ? "max-w-[200px] opacity-100"
                                                            : "max-w-0 opacity-0",
                                                    )}
                                                >
                                                    {item.name}
                                                </div>
                                            </Link>
                                        );

                                        if (!isOpen) {
                                            return (
                                                <Tooltip
                                                    key={item.id}
                                                    content={item.name}
                                                    side="right"
                                                    wrapperClassName="w-full"
                                                >
                                                    {content}
                                                </Tooltip>
                                            );
                                        }
                                        return content;
                                    })}
                                </div>
                            </div>

                            
                        </>
                    ) : (
                        <div className="flex flex-col gap-0.5">
                            <Link
                                to={`/dashboard/leads`}
                                className="flex items-center h-[32px] px-0 hover:bg-(--color-bg-hover) rounded-md text-(--color-text-secondary) hover:text-(--color-text-primary) mb-2 transition-colors"
                            >
                                <div className="w-[40px] h-10 flex items-center justify-center shrink-0">
                                    <ArrowLeft className="w-4 h-4" />
                                </div>
                                <div
                                    className={cn(
                                        "text-sm font-medium transition-all duration-200 overflow-hidden whitespace-nowrap",
                                        isOpen
                                            ? "max-w-[200px] opacity-100"
                                            : "max-w-0 opacity-0",
                                    )}
                                >
                                    Back to Workspace
                                </div>
                            </Link>

                            <div
                                className={cn(
                                    "flex items-center gap-1 px-0 mb-1 mt-2 text-xs font-medium text-(--color-text-tertiary) transition-all duration-200 overflow-hidden h-4",
                                    !isOpen && "opacity-0 h-0 mt-0",
                                )}
                            >
                                <span>Settings</span>
                            </div>

                            <div className="flex flex-col gap-0.5">
                                {settingsMenuItems.map((item) => {
                                    const content = (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                window.location.hash = item.id;
                                                window.dispatchEvent(
                                                    new HashChangeEvent(
                                                        "hashchange",
                                                    ),
                                                );
                                            }}
                                            className="flex items-center h-[32px] px-0 hover:bg-(--color-bg-hover) rounded-md group/link transition-colors w-full"
                                        >
                                            <div className="w-[40px] h-10 flex items-center justify-center shrink-0">
                                                <item.icon className="w-4 h-4 text-(--color-icon)" />
                                            </div>
                                            <div
                                                className={cn(
                                                    "text-sm font-medium text-(--color-text-secondary) truncate text-left transition-all duration-200 overflow-hidden whitespace-nowrap",
                                                    isOpen
                                                        ? "max-w-[200px] opacity-100"
                                                        : "max-w-0 opacity-0",
                                                )}
                                            >
                                                {item.name}
                                            </div>
                                        </button>
                                    );

                                    if (!isOpen) {
                                        return (
                                            <Tooltip
                                                key={item.id}
                                                content={item.name}
                                                side="right"
                                                wrapperClassName="w-full"
                                            >
                                                {content}
                                            </Tooltip>
                                        );
                                    }
                                    return content;
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
