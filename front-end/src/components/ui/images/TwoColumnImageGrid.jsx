export default function TwoColumnImageGrid({
  images = [
    { src: "/images/grid-image/image-02.png", alt: "First image" },
    { src: "/images/grid-image/image-03.png", alt: "Second image" }
  ],
  className = "",
  imgClassName = "w-full border border-gray-200 rounded-xl dark:border-gray-800",
  gridClassName = "grid grid-cols-1 gap-5 sm:grid-cols-2"
}) {
  return (
    <div className={`${gridClassName} ${className}`}>
      {images.map((image, index) => (
        <div key={`image-${index}`}>
          <img
            src={image.src}
            alt={image.alt}
            className={imgClassName}
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
}