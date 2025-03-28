const AspectRatioVideo = ({
  videoUrl,
  aspectRatio = "video", // Default aspect ratio
  title = "Embedded Video",
  className = ""
}) => {
  return (
    <div className={`aspect-${aspectRatio} overflow-hidden rounded-lg ${className}`}>
      <iframe
        src={videoUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        loading="lazy" // Added for better performance
      />
    </div>
  );
};

export default AspectRatioVideo;