export function toSpacing(value: number | string | undefined): string | undefined {
    if (value === undefined) return undefined;
    if (typeof value === 'number') {
        return `${value * 4}px`;
    }
    return value; 
}

export function resolveColor(token: string | undefined): string | undefined {
    if (!token) return undefined;
    if (token.startsWith('layer-')) {
        return `var(--${token})`;
    }

    return `var(--color-${token})`;
}
