"use client";

import { useState } from "react";
import { ErrorNotice } from "@/components/shared/error-notice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScheduleCalendar } from "@/components/shared/schedule-calendar";
import { getScheduleByRound } from "@/lib/services";
import type { ScheduleItem } from "@/types";

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  } catch {
    return iso;
  }
}

export default function SchedulePage() {
  const [reviewRound, setReviewRound] = useState<number>(1);
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  async function onLoadSchedule() {
    setLoading(true);
    setError(null);
    try {
      const response = await getScheduleByRound(reviewRound);
      setItems(response);
      setHasLoaded(true);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Lịch Bảo vệ Đồ án</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Xem lịch bảo vệ đã được xếp theo từng vòng, bao gồm phòng thi, giảng viên hội đồng và tên nhóm.
        </p>
      </div>

      <ErrorNotice error={error} />

      <Card className="border-border/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Tải lịch theo vòng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="review-round">Vòng review</Label>
              <Input
                id="review-round"
                type="number"
                min={1}
                max={3}
                value={reviewRound}
                onChange={(e) => setReviewRound(Number(e.target.value))}
                className="w-36"
              />
            </div>
            <Button onClick={onLoadSchedule} disabled={loading}>
              {loading ? "Đang tải..." : "Xem lịch"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Skeleton loader */}
      {loading && (
        <Card className="border-border/60">
          <CardContent className="pt-6">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-12 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-12 flex-1 animate-pulse rounded bg-muted" />
                  <div className="h-12 flex-1 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state - chưa tải */}
      {!loading && !hasLoaded && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-card/60 py-16 text-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-muted-foreground/30 mb-4">
            <rect x="6" y="10" width="36" height="32" rx="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 19h36M16 5v5M32 5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M15 30h8M15 35.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p className="text-sm font-medium text-muted-foreground">Chưa có lịch nào được tải</p>
          <p className="mt-1 text-xs text-muted-foreground">Chọn vòng review và nhấn "Xem lịch" để bắt đầu.</p>
        </div>
      )}

      {/* Schedule table */}
      {!loading && hasLoaded && (
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Kết quả — Vòng {reviewRound}
              <span className="ml-2 text-sm font-normal text-muted-foreground">({items.length} slot)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm font-medium text-muted-foreground">Chưa có lịch cho vòng này.</p>
                <p className="mt-1 text-xs text-muted-foreground">Vòng {reviewRound} chưa được xếp lịch. Quản trị viên cần chạy xếp lịch tự động trước.</p>
              </div>
            ) : (
              <ScheduleCalendar items={items} reviewRound={reviewRound} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
