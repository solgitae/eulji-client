
import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { Image } from "./Image";
import { User2, ChevronDown, Settings, LogOut } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownButton, DropdownContent, DropdownLabel, DropdownSeparator, DropdownItem } from "./Dropdown";
import ProfileModal from "./ProfileModal";
import { useProfileStore } from "@/store/useProfileStore";

export function LayoutHeaderProfile() {
    const { user } = useAuthStore();
    const [supabase] = useState(() => createClient());
    const { avatarUrl: profileAvatarUrl, displayName: profileName } = useProfileStore();
    const [showProfileModal, setShowProfileModal] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (!user) return null;

    return (
        <div className="flex items-center">
            <Dropdown>
                <DropdownTrigger>
                    <button className="flex items-center gap-2 hover:bg-(--color-bg-hover) py-1 px-2 rounded-md transition-colors h-[32px]">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full overflow-hidden shrink-0 border border-(--color-border)">
                            {(profileAvatarUrl || user?.user_metadata?.avatar_url) ? (
                                <Image
                                    src={profileAvatarUrl || user.user_metadata.avatar_url}
                                    alt="Avatar"
                                    width={24}
                                    height={24}
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-(--color-bg-tertiary) flex items-center justify-center text-(--color-text-secondary) font-medium text-xs">
                                    {user?.email?.charAt(0).toUpperCase() || <User2 className="w-3.5 h-3.5" />}
                                </div>
                            )}
                        </div>
                        <span className="text-sm font-medium text-(--color-text-primary) truncate max-w-[120px] hidden sm:block">
                            {profileName || user?.user_metadata?.full_name || user?.user_metadata?.name || "사용자"}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-(--color-text-tertiary)" />
                    </button>
                </DropdownTrigger>

                <DropdownContent className="w-[220px]" align="end">
                    <DropdownLabel>
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm font-medium text-(--color-text-primary) truncate">
                                {profileName || user?.user_metadata?.full_name || user?.user_metadata?.name || "사용자"}
                            </span>
                            <span className="text-xs text-(--color-text-tertiary) truncate">
                                {user?.email}
                            </span>
                        </div>
                    </DropdownLabel>
                    <DropdownSeparator />
                    <DropdownItem onClick={() => setShowProfileModal(true)} icon={Settings}>
                        프로필 설정
                    </DropdownItem>
                    <DropdownItem onClick={handleLogout} icon={LogOut} destructive>
                        로그아웃
                    </DropdownItem>
                </DropdownContent>
            </Dropdown>

            <ProfileModal
                open={showProfileModal}
                onClose={() => setShowProfileModal(false)}
            />
        </div>
    );
}
