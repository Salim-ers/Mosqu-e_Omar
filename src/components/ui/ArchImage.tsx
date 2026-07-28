import Image from "next/image";

import { cn } from "@/lib/utils";
import { src, type Photo } from "@/lib/media";

/**
 * Signature visuelle du site : la photographie sous arche outrepassée,
 * référence discrète à l'architecture islamique — jamais d'ornement plaqué.
 */
export function ArchImage({
  photo,
  className,
  sizes = "(min-width: 1024px) 40vw, 90vw",
  priority = false,
}: {
  photo: Photo;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-t-full bg-sand",
        className,
      )}
    >
      <Image
        src={src(photo)}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </figure>
  );
}
