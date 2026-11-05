import { RiUpload2Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";

export function ResumeUploadButton() {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled
      aria-label="Upload resume or CV as PDF">
      <RiUpload2Line data-icon="inline-start" />
      Upload resume/CV
    </Button>
  );
}
