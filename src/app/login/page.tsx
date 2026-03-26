"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorNotice } from "@/components/shared/error-notice";
import { login, saveSession } from "@/lib/services";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!email || !password) {
        throw new Error("Vui lòng nhập Email/MSSV và Mật khẩu.");
      }

      // ─── AUTHENTICATION ───────────────────────────────────────────────
      // To re-enable auth: uncomment the block below and remove the bypass block.
      //
      const response = await login({ email, password });
      saveSession(response);
      router.push("/");
      // ──────────────────────────────────────────────────────────────────
      
      // ─── BYPASS (disabled auth) ───────────────────────────────────────
      // Remove this block when real auth is ready.
      // const response = await login({ email, password });
      // saveSession(response);
      // router.push("/");
      // ──────────────────────────────────────────────────────────────────

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/60 bg-card/60 backdrop-blur-md shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-8 w-8 text-primary"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Hệ thống Quản lý</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Đăng nhập để xem lịch bảo vệ Đồ án
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <ErrorNotice error={error} />
            <div className="space-y-2">
              <Label htmlFor="email">Tài khoản FPT hoặc MSSV</Label>
              <Input
                id="email"
                type="text"
                placeholder="VD: SE123456 hoặc an.nv@fpt.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="bg-background/50 h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <a href="#" className="text-xs font-semibold text-primary hover:underline transition-all">
                  Quên mật khẩu?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="bg-background/50 h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-[15px] font-medium mt-6 shadow-md transition-all hover:translate-y-[-1px]" disabled={loading}>
              {loading ? "Đang xác thực..." : "Đăng nhập ngay"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground pt-0 pb-6">
          <p>
            Bạn chưa có tài khoản?{" "}
            <a href="#" className="font-semibold text-primary hover:underline transition-all">
              Liên hệ P. Đào tạo
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
