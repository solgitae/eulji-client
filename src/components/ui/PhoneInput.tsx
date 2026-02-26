import React, { forwardRef } from "react";
import Input, { InputProps } from "./Input";
import { formatKoreanPhone } from "@/utils/util";

export interface PhoneInputProps extends Omit<InputProps, "onChange" | "value"> {
    value: string;
    onChange: (value: string) => void;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ value, onChange, ...props }, ref) => {
        const formattedValue = formatKoreanPhone(value);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            // Strip out non-numeric characters before passing to the parent
            const rawValue = e.target.value.replace(/[^0-9]/g, "");
            onChange(rawValue);
        };

        return (
            <Input
                ref={ref}
                type="tel"
                value={formattedValue}
                onChange={handleChange}
                {...props}
            />
        );
    }
);

PhoneInput.displayName = "PhoneInput";
export default PhoneInput;
