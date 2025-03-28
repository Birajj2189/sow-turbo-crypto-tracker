import "./globals.css";
// import "@repo/ui/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "./providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Crypto Tracker",
	description: "Track real-time cryptocurrency prices",
};
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	);
}