"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, Users, MapPin, User, BookOpen } from "lucide-react";
import type { ScheduleItem } from "@/types";

interface ScheduleCalendarProps {
  items: ScheduleItem[];
  reviewRound: number;
}

export function ScheduleCalendar({ items, reviewRound }: ScheduleCalendarProps) {
  const initialDate = items.length > 0 ? new Date(items[0].startTime) : new Date();
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const { days, map } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const itemMap = new Map<string, ScheduleItem[]>();
    items.forEach(item => {
      const d = new Date(item.startTime);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!itemMap.has(k)) itemMap.set(k, []);
      itemMap.get(k)!.push(item);
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; 
    
    const calendarDays = [];
    
    const prevLastDay = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      calendarDays.push({
        date: new Date(year, month - 1, prevLastDay - i),
        isCurrentMonth: false
      });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
        calendarDays.push({
          date: new Date(year, month, i),
          isCurrentMonth: true
        });
    }
    
    const paddingCount = 42 - calendarDays.length;
    for (let i = 1; i <= paddingCount; i++) {
        calendarDays.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false
        });
    }

    return { days: calendarDays, map: itemMap };
  }, [currentDate, items]);

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  
  const selectedDayKey = selectedDay 
    ? `${selectedDay.getFullYear()}-${String(selectedDay.getMonth() + 1).padStart(2, '0')}-${String(selectedDay.getDate()).padStart(2, '0')}`
    : "";
  const selectedItems = map.get(selectedDayKey) || [];

  function formatTime(iso: string) {
    try {
      return new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    } catch { return iso; }
  }

  const monthName = currentDate.toLocaleString("vi-VN", { month: "long", year: "numeric" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold capitalize">Tháng {currentDate.getMonth() + 1}, {currentDate.getFullYear()}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={handlePrevMonth}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={handleNextMonth}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-px rounded-lg border border-border bg-border overflow-hidden">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
          <div key={day} className="bg-muted p-2 text-center text-sm font-semibold text-muted-foreground">{day}</div>
        ))}
        {days.map((d, i) => {
          const key = `${d.date.getFullYear()}-${String(d.date.getMonth() + 1).padStart(2, '0')}-${String(d.date.getDate()).padStart(2, '0')}`;
          const dayItems = map.get(key) || [];
          
          return (
            <div 
              key={i} 
              onClick={() => dayItems.length > 0 && setSelectedDay(d.date)}
              className={[
                "min-h-24 bg-card p-2 transition-colors",
                !d.isCurrentMonth && "text-muted-foreground/50 bg-muted/30",
                dayItems.length > 0 && "cursor-pointer hover:bg-secondary/50",
              ].filter(Boolean).join(" ")}
            >
              <div className="flex flex-col h-full">
                <span className={["text-sm font-medium", dayItems.length > 0 && "text-primary"].filter(Boolean).join(" ")}>
                  {d.date.getDate()}
                </span>
                {dayItems.length > 0 && (
                  <div className="mt-1 flex flex-col gap-1">
                    <div className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary shadow-sm border border-primary/20">
                      {dayItems.length} slot bảo vệ
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Dialog open={!!selectedDay} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Danh sách slot bảo vệ ngày {selectedDay?.toLocaleDateString("vi-VN")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {selectedItems.length === 0 ? (
               <p className="text-sm text-muted-foreground">Không có lịch nào trong ngày này.</p>
            ) : (
               <div className="grid gap-4 sm:grid-cols-2">
                  {selectedItems.map((item) => (
                    <div key={item.slotId} className="rounded-lg border bg-card p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <div className="flex items-center gap-2 font-semibold">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{item.room}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium text-foreground">{formatTime(item.startTime)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          <Users className="h-3.5 w-3.5" /> Hội đồng
                        </div>
                        {item.reviewers.length > 0 ? item.reviewers.map(r => (
                          <div key={r.lecturerId} className="flex items-center gap-2 text-sm pl-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            <span>{r.fullName}</span>
                          </div>
                        )) : <p className="text-xs pl-5 text-muted-foreground">Chưa phân công</p>}
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          <BookOpen className="h-3.5 w-3.5" /> Nhóm Báo cáo
                        </div>
                        {item.topics.length > 0 ? item.topics.map(t => (
                          <div key={t.topicId} className="pl-5 space-y-0.5 border-l-2 border-primary/20 ml-1">
                            <p className="text-sm font-medium pl-2">{t.title}</p>
                            <p className="text-xs text-muted-foreground pl-2">{t.teamName}</p>
                          </div>
                        )) : <p className="text-xs pl-5 text-muted-foreground">Chưa có nhóm đăng ký</p>}
                      </div>
                    </div>
                  ))}
               </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
