import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ApiClientError } from "@/lib/api";

type ErrorNoticeProps = {
  error: unknown;
};

export function ErrorNotice({ error }: ErrorNoticeProps) {
  if (!error) return null;

  const apiError = error instanceof ApiClientError ? error : null;

  let title = "Đã xảy ra lỗi";
  let message = apiError?.message || "Vui lòng thử lại sau.";

  if (apiError?.kind === "business") {
    title = "Không thể hoàn thành yêu cầu";
  } else if (apiError?.kind === "server") {
    title = "Lỗi hệ thống";
    message = apiError?.message || "Máy chủ gặp sự cố, vui lòng thử lại sau.";
  } else if (apiError?.kind === "network") {
    title = "Mất kết nối";
    message = "Không thể kết nối đến máy chủ. Hãy kiểm tra mạng và thử lại.";
  }

  return (
    <Alert className="border-destructive/30 bg-destructive/5">
      <AlertTitle className="font-semibold">{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {apiError?.details ? (
        <AlertDescription className="mt-1 text-xs opacity-70">{apiError.details}</AlertDescription>
      ) : null}
    </Alert>
  );
}
