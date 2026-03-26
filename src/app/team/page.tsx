"use client";

import { useEffect, useState } from "react";
import { ErrorNotice } from "@/components/shared/error-notice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bookTeam, getAvailableSlots } from "@/lib/services";
import type { AvailableSlot } from "@/types";

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

export default function TeamPage() {
  const [teamId, setTeamId] = useState<number>(1);
  const [leaderId, setLeaderId] = useState<number>(1);
  const [selectedSlots, setSelectedSlots] = useState<Set<number>>(new Set());
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);

  const [status, setStatus] = useState("");
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(true);

  // Auto-load slots on mount
  useEffect(() => {
    async function loadSlots() {
      try {
        const response = await getAvailableSlots();
        setAvailableSlots(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoadingSlots(false);
      }
    }
    loadSlots();
  }, []);

  function toggleSlot(slotId: number) {
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      if (next.has(slotId)) next.delete(slotId);
      else next.add(slotId);
      return next;
    });
  }

  async function onBookTeam() {
    if (selectedSlots.size === 0) {
      setError(new Error("Vui lòng chọn ít nhất một slot trước khi đăng ký."));
      return;
    }
    setLoading(true);
    setError(null);
    setStatus("");
    try {
      await bookTeam({ teamId, leaderId, slotIds: Array.from(selectedSlots) });
      setStatus("Đăng ký slot thành công. Hệ thống đã ghi nhận nguyện vọng của nhóm.");
      setSelectedSlots(new Set());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Đăng ký Slot cho Nhóm</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Trưởng nhóm chọn các khung giờ phù hợp để hệ thống xếp lịch bảo vệ. Bạn có thể chọn nhiều slot — hệ thống sẽ sắp xếp một buổi duy nhất phù hợp nhất.
        </p>
      </div>

      <ErrorNotice error={error} />
      {status && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 font-medium">
          {status}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form đăng ký */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Thông tin nhóm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="team-id">Mã nhóm</Label>
              <Input
                id="team-id"
                type="number"
                min={1}
                value={teamId}
                onChange={(e) => setTeamId(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="leader-id">Mã trưởng nhóm</Label>
              <Input
                id="leader-id"
                type="number"
                min={1}
                value={leaderId}
                onChange={(e) => setLeaderId(Number(e.target.value))}
              />
            </div>
            <div className="pt-1">
              <p className="mb-1.5 text-sm font-medium text-foreground">
                Slot đã chọn:{" "}
                <span className="font-semibold text-primary">
                  {selectedSlots.size > 0 ? `${selectedSlots.size} slot` : "Chưa chọn"}
                </span>
              </p>
              <Button
                onClick={onBookTeam}
                disabled={loading || selectedSlots.size === 0}
                className="w-full"
              >
                {loading ? "Đang gửi..." : "Xác nhận đăng ký"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danh sách slot */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Chọn slot thời gian</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSlots ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-muted-foreground/40 mb-3">
                  <rect x="5" y="8" width="30" height="27" rx="4" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M5 16h30M14 4v4M26 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p className="text-sm font-medium text-muted-foreground">Không có slot trống</p>
                <p className="mt-1 text-xs text-muted-foreground">Tất cả các slot đã được đặt đầy.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableSlots.map((slot) => {
                  const checked = selectedSlots.has(slot.slotId);
                  return (
                    <button
                      key={slot.slotId}
                      type="button"
                      onClick={() => toggleSlot(slot.slotId)}
                      className={[
                        "w-full rounded-lg border px-4 py-3 text-left text-sm transition-all duration-150",
                        "hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        checked
                          ? "border-primary/60 bg-primary/5 shadow-sm"
                          : "border-border/60 bg-card hover:bg-secondary/50"
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{slot.room}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                          </p>
                        </div>
                        <span className={[
                          "mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors",
                          checked ? "border-primary bg-primary" : "border-border"
                        ].join(" ")}>
                          {checked && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
