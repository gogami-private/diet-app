import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diet Log MVP",
  description: "Daily meal/weight/workout logger",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
        <div style={{ maxWidth: 920, margin: "0 auto", padding: 16 }}>
          <header style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
            <a href="/today">/today</a>
            <a href="/logs">/logs</a>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
