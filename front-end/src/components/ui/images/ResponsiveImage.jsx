export default function ResponsiveImage({ 
  src = "/images/grid-image/image-01.png",
  alt = "Cover",
  className = "",
  imgClassName = "w-full border border-gray-200 rounded-xl dark:border-gray-800"
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className={imgClassName}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}