import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Signature visuelle du site : la photographie sous arche outrepassée,
 * référence discrète à l'architecture islamique — jamais d'ornement plaqué.
 * Reçoit une URL directement : la photo peut venir du code comme de l'espace
 * bénévoles.
 */
export function ArchImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 40vw, 90vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <figure
      className={cn("relative overflow-hidden rounded-t-full bg-sand", className)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </figure>
  );
}
