"use client";

import { useMemo, useEffect, useState } from "react";
import { ErrorNotice } from "@/components/shared/error-notice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { autoSchedule, configLecturer, getLecturers, validateManualAssignment } from "@/lib/services";
import type { Lecturer } from "@/types";

export default function ModeratorPage() {
  const [lecturerId, setLecturerId] = useState<number>(1);
  const [minSlot, setMinSlot] = useState<number>(1);
  const [maxSlot, setMaxSlot] = useState<number>(5);
  const [reviewRound, setReviewRound] = useState<number>(1);
  const [validateSlotId, setValidateSlotId] = useState<number>(1);
  const [validateLecturerId, setValidateLecturerId] = useState<number>(1);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);

  useEffect(() => {
    async function loadLecs() {
      try {
        const data = await getLecturers();
        setLecturers(data);
        if (data.length > 0) {
          setLecturerId(data[0].id);
          setValidateLecturerId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadLecs();
  }, []);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<unknown>(null);

  const configError = useMemo(() => maxSlot < minSlot ? "Số slot tối đa phải lớn hơn hoặc bằng tối thiểu." : null, [minSlot, maxSlot]);

  async function onConfigLecturer() {
    setLoading(true);
    setError(null);
    setStatus("");
    try {
      await configLecturer(lecturerId, { minSlot, maxSlot });
      setStatus(`Đã cập nhật cấu hình slot cho giảng viên #${lecturerId}.`);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function onAutoSchedule() {
    setLoading(true);
    setError(null);
    setStatus("");
    try {
      await autoSchedule({ reviewRound });
      setStatus(`Xếp lịch vòng ${reviewRound} hoàn tất. Xem kết quả tại trang Lịch Bảo vệ.`);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function onValidateAssignment() {
    setLoading(true);
    setError(null);
    setStatus("");
    try {
      await validateManualAssignment({ slotId: validateSlotId, lecturerId: validateLecturerId });
      setStatus(`Phân công hợp lệ: Giảng viên #${validateLecturerId} có thể tham gia Slot #${validateSlotId}.`);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Quản trị viên</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Cấu hình số slot cho giảng viên, khởi chạy thuật toán xếp lịch tự động và xác thực phân công thủ công.
        </p>
      </div>

      <ErrorNotice error={error} />
      {status && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 font-medium">
          {status}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Config Lecturer */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Cấu hình Giảng viên</CardTitle>
            <p className="text-xs text-muted-foreground">Đặt giới hạn số slot tham gia chấm bảo vệ</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="lecturer-id">Giảng viên / Hội đồng</Label>
              <Select value={lecturerId.toString()} onValueChange={(val) => setLecturerId(Number(val))}>
                <SelectTrigger id="lecturer-id">
                  <SelectValue placeholder="Chọn giảng viên..." />
                </SelectTrigger>
                <SelectContent>
                  {lecturers.map(l => (
                    <SelectItem key={l.id} value={l.id.toString()}>
                      {l.fullName} ({l.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="min-slot">Số slot tối thiểu</Label>
              <Input id="min-slot" type="number" min={0} value={minSlot} onChange={(e) => setMinSlot(Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="max-slot">Số slot tối đa</Label>
              <Input id="max-slot" type="number" min={0} value={maxSlot} onChange={(e) => setMaxSlot(Number(e.target.value))} />
              {configError && <p className="text-xs text-destructive">{configError}</p>}
            </div>
            <Button disabled={loading || !!configError} onClick={onConfigLecturer} className="w-full">
              {loading ? "Đang lưu..." : "Lưu cấu hình"}
            </Button>
          </CardContent>
        </Card>

        {/* Auto Schedule */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Xếp lịch tự động</CardTitle>
            <p className="text-xs text-muted-foreground">Chạy thuật toán Greedy phân công tất cả các slot</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="round">Vòng review</Label>
              <Input id="round" type="number" min={1} max={3} value={reviewRound} onChange={(e) => setReviewRound(Number(e.target.value))} />
              <p className="text-xs text-muted-foreground">Vòng 1, 2 hoặc 3 trong học kỳ</p>
            </div>
            <Button disabled={loading} onClick={onAutoSchedule} className="w-full">
              {loading ? "Đang xử lý..." : "Bắt đầu xếp lịch"}
            </Button>
          </CardContent>
        </Card>

        {/* Validate Assignment */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Kiểm tra phân công</CardTitle>
            <p className="text-xs text-muted-foreground">Xác thực giảng viên có thể tham gia slot</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="validate-slot">Mã slot</Label>
              <Input id="validate-slot" type="number" min={1} value={validateSlotId} onChange={(e) => setValidateSlotId(Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="validate-lecturer">Giảng viên / Hội đồng</Label>
              <Select value={validateLecturerId.toString()} onValueChange={(val) => setValidateLecturerId(Number(val))}>
                <SelectTrigger id="validate-lecturer">
                  <SelectValue placeholder="Chọn giảng viên..." />
                </SelectTrigger>
                <SelectContent>
                  {lecturers.map(l => (
                    <SelectItem key={l.id} value={l.id.toString()}>
                      {l.fullName} ({l.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button disabled={loading} onClick={onValidateAssignment} className="w-full" variant="secondary">
              {loading ? "Đang kiểm tra..." : "Kiểm tra"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
