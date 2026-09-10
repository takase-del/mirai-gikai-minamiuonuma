import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { isExternalHref } from "@/lib/utils/href";

interface LinkButtonProps {
  href: string;
  icon: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  children: ReactNode;
  target?: string;
  rel?: string;
}

export function LinkButton({
  href,
  icon,
  children,
  target,
  rel,
}: LinkButtonProps) {
  // 内部リンクまで別タブで開くと、サイト内の行き来でタブが増える。
  // 呼び出し側が明示した値があればそちらを優先する。
  const isExternal = isExternalHref(href);
  const resolvedTarget = target ?? (isExternal ? "_blank" : undefined);
  const resolvedRel = rel ?? (isExternal ? "noopener noreferrer" : undefined);

  return (
    <Button
      asChild
      variant="outline"
      className="w-fit rounded-full px-6 py-3 h-auto"
    >
      <a href={href} target={resolvedTarget} rel={resolvedRel}>
        <Image
          src={icon.src}
          alt={icon.alt}
          width={icon.width}
          height={icon.height}
          className="flex-shrink-0"
        />
        <span className="text-[15px] font-bold">{children}</span>
        <Image
          src="/icons/arrow-right.svg"
          alt=""
          width={16}
          height={15}
          className="flex-shrink-0"
        />
      </a>
    </Button>
  );
}
