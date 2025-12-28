export const capitalizeText = (text: string) => {
  return text
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
};
