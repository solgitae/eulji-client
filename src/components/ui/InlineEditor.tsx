
import { useState, useEffect, useRef } from "react";
import { cn } from "@/utils/util";

interface InlineEditorProps {
    value: string;
    onSave: (value: string) => void;
    placeholder?: string;
    multiline?: boolean;
    className?: string;
    textClassName?: string;
    inputClassName?: string;
}

export function InlineEditor({
    value,
    onSave,
    placeholder = "Click to edit...",
    multiline = false,
    className,
    textClassName,
    inputClassName,
}: InlineEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing) {
            if (multiline) {
                textareaRef.current?.focus();
                textareaRef.current?.setSelectionRange(tempValue.length, tempValue.length);
            } else {
                inputRef.current?.focus();
                inputRef.current?.setSelectionRange(tempValue.length, tempValue.length);
            }
        }
    }, [isEditing, multiline, tempValue.length]);

    const handleSave = () => {
        if (tempValue !== value) {
            onSave(tempValue);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            if (!multiline) {
                e.preventDefault();
                handleSave();
            }
        }
        if (e.key === "Escape") {
            setTempValue(value);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <div className={cn("w-full", className)}>
                {multiline ? (
                    <textarea
                        ref={textareaRef}
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className={cn(
                            "w-full bg-transparent border-none p-0 focus:ring-0 text-inherit resize-none outline-none",
                            inputClassName
                        )}
                        placeholder={placeholder}
                        rows={3}
                    />
                ) : (
                    <input
                        ref={inputRef}
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className={cn(
                            "w-full bg-transparent border-none p-0 focus:ring-0 text-inherit outline-none",
                            inputClassName
                        )}
                        placeholder={placeholder}
                    />
                )}
            </div>
        );
    }

    return (
        <div 
            className={cn(
                "w-full group/inline cursor-text rounded-md hover:bg-(--color-bg-hover)/50 transition-colors px-1 -mx-1", 
                className
            )}
            onClick={() => setIsEditing(true)}
        >
            <div className={cn(
                "truncate",
                !value && "text-(--color-text-disabled) italic",
                textClassName
            )}>
                {value || placeholder}
            </div>
        </div>
    );
}
