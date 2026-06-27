export function getPhotoThumbnails(photoUrls) {
  if (!Array.isArray(photoUrls) || photoUrls === 0) return "";

  return photoUrls
    .filter((url) => url)
    .slice(0.3)
    .map(
      (url) =>
        `<img src="${url}" alt="Photo" style="width:60px;height:60px;object-fit:cover;margin-right:4px;border-radius:4px;" />`,
    )
    .join("");
}
