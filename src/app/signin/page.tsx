import SignInForm from "./SignInForm";

export const metadata = { title: "Sign In | Dashboard App" };

export default function SignInPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
            <SignInForm />
        </div>
    );
}
