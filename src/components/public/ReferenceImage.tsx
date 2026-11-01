import Image from "next/image";
import type { HTMLAttributes } from "react";

/** Keeps the reference image's exact frame while serving a real, local Next image. */
export function ReferenceImage({
  src,
  alt,
  contain = false,
  objectPosition,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  src: string;
  alt: string;
  contain?: boolean;
  objectPosition?: string;
}) {
  const positioned = /\b(relative|absolute|fixed|sticky)\b/.test(className);
  return (
    <div {...props} className={`${className} ${positioned ? "" : "relative"}`}>
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 600px"
        style={{
          objectFit: contain ? "contain" : "cover",
          objectPosition: objectPosition ?? "center",
          borderRadius: "inherit",
        }}
      />
    </div>
  );
}
