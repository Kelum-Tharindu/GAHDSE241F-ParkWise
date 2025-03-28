export default function UltraWideVideo({
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
  title = "Ultra Wide Video",
  className = "",
  aspectRatio = "aspect-[21/9]",
  allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
  allowFullScreen = true,
  rounded = "rounded-lg"
}) {
  return (
    <div className={`${aspectRatio} overflow-hidden ${rounded} ${className}`}>
      <iframe
        src={videoUrl}
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