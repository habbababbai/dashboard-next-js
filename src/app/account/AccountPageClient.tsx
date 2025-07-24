"use client";
import { useState } from "react";
import EditNameForm from "./EditNameForm";
import EditEmailForm from "./EditEmailForm";

type User = {
    name: string;
    email: string;
    createdAt: string; // ISO string
    joinedDate: string; // Pre-formatted date string
};

export default function AccountPageClient({ user }: { user: User }) {
    const [editingName, setEditingName] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">Account Details</h1>
            <div className="mb-1 flex items-center gap-2">
                Name:{" "}
                {editingName ? (
                    <EditNameForm
                        currentName={name}
                        onSuccess={(newName) => {
                            setName(newName);
                            setEditingName(false);
                        }}
                    />
                ) : (
                    <>
                        <span>{name}</span>
                        <button
                            className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                            onClick={() => setEditingName(true)}
                        >
                            Edit
                        </button>
                    </>
                )}
            </div>
            <div className="mb-1 flex items-center gap-2">
                Email:{" "}
                {editingEmail ? (
                    <EditEmailForm
                        currentEmail={email}
                        onSuccess={(newEmail) => {
                            setEmail(newEmail);
                            setEditingEmail(false);
                        }}
                    />
                ) : (
                    <>
                        <span>{email}</span>
                        <button
                            className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                            onClick={() => setEditingEmail(true)}
                        >
                            Edit
                        </button>
                    </>
                )}
            </div>
            <div className="text-sm text-gray-500 mb-4">
                Joined: {user.joinedDate}
            </div>
            <div className="flex gap-2 mb-4">
                <a
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition inline-block"
                    href="/account/reset-password"
                >
                    Reset Password
                </a>
                <a
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition inline-block"
                    href="/account/delete"
                >
                    Delete Account
                </a>
            </div>
        </div>
    );
}
