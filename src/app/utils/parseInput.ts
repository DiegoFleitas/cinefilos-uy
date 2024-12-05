import XRegExp from 'xregexp';

export const parseInput = (
  inputString: string,
  includeYear = false
): string => {
  // Clean unnecessary prefixes and emojis
  const cleanInput = (str: string): string => {
    const cleanupPattern = XRegExp('@juanito (nomino| nomino)?', 'gi');
    return XRegExp.replace(str, cleanupPattern, '').toLowerCase().trim();
  };

  // Remove all special characters
  const removeSpecialChars = (str: string): string => {
    const specialCharsPattern = XRegExp('[^\\p{L}\\p{N}\\s]', 'g');
    return XRegExp.replace(str, specialCharsPattern, '').trim();
  };

  // Replace specific characters with their corresponding vowels
  const replaceSpecificChars = (str: string): string => {
    const replacements: { [key: string]: string } = {
      ñ: 'n',
      á: 'a',
      é: 'e',
      í: 'i',
      ó: 'o',
      ú: 'u',
      Ñ: 'N',
      Á: 'A',
      É: 'E',
      Í: 'I',
      Ó: 'O',
      Ú: 'U',
    };
    return str.replace(/[ñáéíóúÑÁÉÍÓÚ]/g, (char) => replacements[char]);
  };

  // Remove year and everything after it
  const removeYearAndAfterIfPresent = (str: string): string => {
    const yearPattern = XRegExp('\\d{4}.*', 'i');
    return XRegExp.replace(str, yearPattern, '').trim();
  };

  // Extract the movie title
  const extractTitle = (str: string): string => {
    const moviePattern = XRegExp('nomino\\s+(.+)', 'i'); // Everything after "nomino"
    const match = XRegExp.exec(str, moviePattern);
    let title = match ? match[1].trim() : str.trim();

    if (!includeYear) {
      // Remove year patterns (standalone year or year in parentheses)
      const yearPattern = XRegExp('(\\s\\(\\d{4}\\)$|\\s\\d{4}$)', 'i');
      title = XRegExp.replace(title, yearPattern, '').trim();
    }

    return title;
  };

  // Process input
  const cleanedString = cleanInput(inputString);
  const stringWithoutSpecialChars = removeSpecialChars(cleanedString);
  const stringWithReplacedChars = replaceSpecificChars(
    stringWithoutSpecialChars
  );
  const stringWithoutYear = removeYearAndAfterIfPresent(
    stringWithReplacedChars
  );
  return extractTitle(stringWithoutYear);
};
