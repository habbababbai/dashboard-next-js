import "./globals.css";
import Header from "@/app/components/Header";
import SessionProviderWrapper from "@/app/components/SessionProviderWrapper";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <SessionProviderWrapper>
                    <Header />
                    <main>{children}</main>
                </SessionProviderWrapper>
            </body>
        </html>
    );
}
