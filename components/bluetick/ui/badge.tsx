import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import React from "react";

export const BadgeDisplay: React.FC<{ badge: string }> = ({ badge }) => {
  const key = badge.split(" ").join("-").toLowerCase();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Image src={`/discord/${key}.png`} alt={key} width={20} height={20} />
        </TooltipTrigger>
        <TooltipContent>
          <p className="rounded-lg bg-secondary px-4 py-2">{badge}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
