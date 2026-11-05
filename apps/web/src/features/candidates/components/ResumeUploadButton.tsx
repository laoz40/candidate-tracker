import { useRef } from "react";
import { RiLoader4Line, RiUpload2Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";

export function ResumeUploadButton({
  extracting,
  disabled,
  onUpload,
}: {
  extracting: boolean;
  disabled: boolean;
  onUpload: (file: File) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        disabled={disabled || extracting}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";

          if (file) void onUpload(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || extracting}
        onClick={() => inputRef.current?.click()}>
        {extracting ? (
          <RiLoader4Line
            data-icon="inline-start"
            className="animate-spin"
          />
        ) : (
          <RiUpload2Line data-icon="inline-start" />
        )}
        {extracting ? "Extracting" : "Upload PDF"}
      </Button>
    </>
  );
}
