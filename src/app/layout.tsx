import "~/styles/globals.css";

import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata = {
  title: "OfficeDrummer Wheel",
  description: "Made by opti",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <html lang="en">
          <body className={`relative font-sans`}>
            <div className="absolute right-4 top-4 z-50">
              <UserButton />
            </div>
            {children}
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
