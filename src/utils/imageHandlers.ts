export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
) => {
  const target = e.currentTarget;
  const fallbackImages = ["10", "11", "12", "13"];
  const randomIndex = Math.floor(Math.random() * fallbackImages.length);
  const selectedImage = fallbackImages[randomIndex];
  target.src = `/Frame-${selectedImage}.png`;
  target.onerror = null;
};
