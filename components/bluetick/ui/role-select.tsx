import type { DiscordRole } from "@/types/bluetick/discord";
import React from "react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface Props {
  roles: DiscordRole[];
  value: string;
  onValueChange: (newValue: string) => void;
  allowEveryone?: boolean;
}

const RoleSelect: React.FC<Props> = ({
  roles,
  value,
  onValueChange,
  allowEveryone = true,
}) => {
  // State and hooks setup
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [popoverWidth, setPopoverWidth] = React.useState<number | string>(
    "auto",
  );
  React.useEffect(() => {
    const triggerElement = triggerRef.current;

    if (triggerElement) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Use contentRect for width before border, padding, or scrollbar
          setPopoverWidth(entry.contentRect.width);
        }
      });

      // Start observing for resize
      resizeObserver.observe(triggerElement);

      // Clean up observer on component unmount
      return () => {
        resizeObserver.unobserve(triggerElement);
      };
    }
  }, []);

  const [query, setQuery] = React.useState("");
  const filteredRoles = (
    query
      ? roles.filter((role) =>
          role.name.toLowerCase().includes(query.toLowerCase()),
        )
      : roles
  ).filter((role) => role.name !== (allowEveryone ? `` : `@everyone`));

  const getRoleNameById = (id: string): string => {
    if (id === "ticket-opener") {
      return "Ticket Opener";
    }
    const role = roles.find((role) => role.id === id);
    return role ? role.name : "Unknown role";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          ref={triggerRef}
          className="flex min-h-10 w-full cursor-pointer flex-wrap justify-start gap-2 truncate rounded-md border bg-background p-2 text-sm"
        >
          {value ? (
            <div className="flex w-full items-center justify-between gap-2">
              {getRoleNameById(value)}
              <Icons.close
                size="12"
                className="cursor-pointer"
                onClick={() => {
                  onValueChange("");
                }}
              />
            </div>
          ) : (
            <p className="text-zinc-500">Select role</p>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        style={{ width: popoverWidth, minWidth: "240px" }}
        className="p-2"
      >
        <Command>
          <CommandInput
            value={query}
            onValueChange={(e) => {
              setQuery(e);
            }}
            placeholder="Search roles..."
          />
          <CommandGroup className="max-h-[300px] w-full overflow-y-auto">
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <CommandItem
                  key={role.id}
                  className={cn(
                    "flex items-center gap-2 aria-selected:bg-accent/50",
                    value === role.id ? `bg-secondary/50` : ``,
                  )}
                  onSelect={() => {
                    onValueChange(role.id);
                  }}
                >
                  {role.name}
                </CommandItem>
              ))
            ) : (
              <CommandItem className="aria-selected:bg-accent/50">
                No roles found
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default RoleSelect;
