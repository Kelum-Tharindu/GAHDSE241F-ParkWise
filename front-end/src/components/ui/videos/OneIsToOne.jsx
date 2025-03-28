export default function SquareVideoEmbed({
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
  title = "Embedded Video",
  className = "",
  allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
  allowFullScreen = true
}) {
  return (
    <div className={`aspect-square overflow-hidden rounded-lg ${className}`}>
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