export const metadata = { title: "Reset Password | Dashboard App" };

import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
            <ResetPasswordForm />
        </div>
    );
}
