import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function CandidatesHeader({ count }: { count: number }) {
  return (
    <header className="flex h-20 shrink-0 items-center gap-3 px-6">
      <SidebarTrigger
        variant="outline"
        size="icon-lg"
      />
      <h1 className="text-2xl font-semibold tracking-tight">Candidates</h1>
      <Badge variant="secondary">{count}</Badge>
    </header>
  );
}
