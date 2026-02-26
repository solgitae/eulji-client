
import React from "react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/utils/util";

export default function KakaoTalkFab() {
    const handleKakaoChat = () => {
        // TODO: 실제 카카오 비즈니스 채널 URL로 변경해 주세요.
        // 예: https://pf.kakao.com/_xxxxxx/chat
        window.open("http://pf.kakao.com/_FcmhX/chat", "_blank");
    };

    return (
        <div className="fixed bottom-6 right-6 z-100 flex flex-col items-end gap-4">
            <button
                onClick={handleKakaoChat}
                className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shadow-(--shadow-elevated) transition-transform duration-200 hover:scale-105 active:scale-95"
                )}
                style={{ 
                    backgroundColor: "#FEE500", // 카카오톡 공식 배경색 (Yellow)
                    color: "#000000"            // 카카오톡 공식 아이콘색 (Black)
                }}
                aria-label="카카오톡 1:1 채팅 문의"
            >
                <MessageSquare className="w-6 h-6 fill-current" />
            </button>
        </div>
    );
}
