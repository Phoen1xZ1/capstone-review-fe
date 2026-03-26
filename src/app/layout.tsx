import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/shared/app-shell";

export const metadata: Metadata = {
  title: "Hệ thống Đăng ký Bảo vệ Đồ án | FPT University",
  description: "Đăng ký lịch bảo vệ đồ án tốt nghiệp dành cho sinh viên và giảng viên FPT University"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
