import Image from "next/image";

export default function ProjectImage({
  src,
  alt,
  isVisible,
}: Readonly<{ src: string | null; alt: string; isVisible: boolean }>) {
  if (!src) return null;

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
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
