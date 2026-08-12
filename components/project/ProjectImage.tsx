import Image from "next/image";

export default function ProjectImage({
  src,
  alt,
  isVisible,
  className = "absolute inset-0",
}: Readonly<{
  src: string | null;
  alt: string;
  isVisible: boolean;
  className?: string;
}>) {
  if (!src) return null;

  return (
    <div
      className={`transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      } ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-top"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
      />
    </div>
  );
}