import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Sugam Pudasaini - AI & Software Engineer",
	description: "Portfolio of Sugam Pudasaini, an AI & Software Engineer turning complex problems into scalable solutions.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
			</head>
			<body className="antialiased font-sans">
				{children}
			</body>
		</html>
	);
}
