import { useNavigate } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { stages, type Stage } from "@/features/candidates/lib/candidates";
import type { CandidateFilters, CandidateSort } from "@/features/candidates/lib/candidates-reducer";

const sortOptions: { value: CandidateSort; label: string }[] = [
  { value: "newest", label: "Date added: newest first" },
  { value: "oldest", label: "Date added: oldest first" },
  { value: "stage", label: "Stage: pipeline order" },
];

export function CandidateListControls({
  filters,
  roles,
}: {
  filters: CandidateFilters;
  roles: readonly string[];
}) {
  const navigate = useNavigate({ from: "/" });

  function changeFilters(next: CandidateFilters) {
    void navigate({
      search: {
        stage: next.stage ?? undefined,
        role: next.role ?? undefined,
        sort: next.sort,
      },
    });
  }

  return (
    <fieldset
      className="flex flex-wrap items-center gap-3 px-6 py-4"
      aria-label="Filter and sort candidates">
      <Select<Stage>
        value={filters.stage}
        onValueChange={(stage) => changeFilters({ ...filters, stage })}
        items={[
          { value: null, label: "All stages" },
          ...stages.map((stage) => ({ value: stage, label: stage })),
        ]}>
        <SelectTrigger aria-label="Filter by stage">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={null}>All stages</SelectItem>
            {stages.map((stage) => (
              <SelectItem
                key={stage}
                value={stage}>
                {stage}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select<string>
        value={filters.role}
        onValueChange={(role) => changeFilters({ ...filters, role })}
        items={[
          { value: null, label: "All roles" },
          ...roles.map((role) => ({ value: role, label: role })),
        ]}>
        <SelectTrigger aria-label="Filter by role">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={null}>All roles</SelectItem>
            {roles.map((role) => (
              <SelectItem
                key={role}
                value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select<CandidateSort>
        value={filters.sort}
        onValueChange={(sort) => {
          if (sort !== null) changeFilters({ ...filters, sort });
        }}
        items={sortOptions}>
        <SelectTrigger aria-label="Sort candidates">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {sortOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </fieldset>
  );
}
