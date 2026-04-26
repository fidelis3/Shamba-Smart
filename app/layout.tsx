import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: "ShambaSmart",
    description: "ShambaSmart is a comprehensive farm management system designed to help farmers optimize their operations and increase productivity. With features such as crop monitoring, irrigation management, and pest control, ShambaSmart provides farmers with the tools they need to make informed decisions and improve their yields.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning={true}
            className={`h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
