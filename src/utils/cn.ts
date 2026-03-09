/**
 * Utility for conditionally joining class names.
 * Lightweight alternative to the `clsx` library.
 *
 * @example
 * cn('base', isActive && 'active', hasError ? 'error' : 'ok')
 * // => 'base active ok'
 */
export const cn = (...classes: (string | false | null | undefined)[]): string => {
    return classes.filter(Boolean).join(' ');
};
