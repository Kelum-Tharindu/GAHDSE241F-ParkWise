export default function VideoEmbed({
  src = "https://www.youtube.com/embed/dQw4w9WgXcQ",
  title = "Embedded Video",
  className = "",
  aspectRatio = "aspect-video", // Tailwind's default 16:9 ratio
  allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
  allowFullScreen = true
}) {
  return (
    <div className={`${aspectRatio} overflow-hidden rounded-lg ${className}`}>
      <iframe
        src={src}
        title={title}
        frameBorder="0"
        allow={allow}
        allowFullScreen={allowFullScreen}
        className="w-full h-full"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}