import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const cards = [
  {
    href: "/team",
    title: "Nhóm Sinh viên",
    description: "Trưởng nhóm đăng ký các slot thời gian bảo vệ đồ án phù hợp với lịch của nhóm.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM3 17a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    href: "/lecturer",
    title: "Giảng viên",
    description: "Giảng viên đăng ký các slot mong muốn tham gia hội đồng chấm bảo vệ đồ án.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 2L2 6l8 4 8-4-8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 10l8 4 8-4M2 14l8 4 8-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    href: "/schedule",
    title: "Lịch Bảo vệ",
    description: "Xem lịch bảo vệ đã được xếp, bao gồm phòng thi, thời gian, và danh sách hội đồng.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 8h14M7 2v2M13 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 12h2M7 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    href: "/moderator",
    title: "Quản trị viên",
    description: "Cấu hình số slot cho giảng viên và khởi chạy thuật toán xếp lịch tự động.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 2v2M10 16v2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M2 10h2M16 10h2M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  }
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <div className="max-w-2xl space-y-3 pt-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
          Hệ thống Đăng ký Bảo vệ Đồ án
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Nền tảng quản lý lịch bảo vệ đồ án tốt nghiệp. Sinh viên chọn slot thời gian, giảng viên đăng ký tham gia hội đồng, hệ thống tự động xếp lịch tối ưu.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link href={card.href} key={card.href}>
            <Card className="group h-full border-border/60 bg-card/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
              <CardHeader className="pb-3">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  {card.icon}
                </div>
                <CardTitle className="text-base font-semibold">{card.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary transition-all group-hover:underline">
                  Truy cập →
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
