"use client";

interface TabButtonProps {
    activeTab: boolean;
    onClick: () => void;
    title: string;
}

export default function TabButton({
    activeTab,
    onClick,
    title,
}: TabButtonProps) {
    return (
        <div>
            <button
                onClick={() => onClick()}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
            >
                {title}
            </button>
        </div>
    );
}
