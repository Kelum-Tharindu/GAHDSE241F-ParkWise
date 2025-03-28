export default function ThreeColumnImageGrid({ 
  images = [
    { src: "/images/grid-image/image-04.png", alt: "Grid image 1" },
    { src: "/images/grid-image/image-05.png", alt: "Grid image 2" },
    { src: "/images/grid-image/image-06.png", alt: "Grid image 3" }
  ],
  className = "",
  imgClassName = "border border-gray-200 rounded-xl dark:border-gray-800",
  gridClassName = "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
}) {
  return (
    <div className={`${gridClassName} ${className}`}>
      {images.map((image, index) => (
        <div key={index}>
          <img
            src={image.src}
            alt={image.alt}
            className={`w-full ${imgClassName}`}
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
}