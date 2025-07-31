"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderButtonProps {
    href?: string;
    children: React.ReactNode;
    className?: string;
    isActive?: boolean;
    onClick?: () => void;
}

export default function HeaderButton({
    href,
    children,
    className = "",
    isActive: propIsActive,
    onClick,
}: HeaderButtonProps) {
    const pathname = usePathname();
    const isActive =
        propIsActive !== undefined
            ? propIsActive
            : href
            ? pathname === href
            : false;

    const buttonContent = (
        <button
            className={`px-6 py-2 transition relative ${className} ${
                isActive ? "text-white" : "text-gray-300 hover:text-white"
            }`}
            onClick={onClick}
        >
            {children}
            {isActive && (
                <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-white"></div>
            )}
        </button>
    );

    if (href) {
        return <Link href={href}>{buttonContent}</Link>;
    }

    return buttonContent;
}
