import CreateAccountForm from "./CreateAccountForm";

export const metadata = { title: "Create Account | Dashboard App" };

export default function CreateAccountPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
            <CreateAccountForm />
        </div>
    );
}
