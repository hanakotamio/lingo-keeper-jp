export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateJLPTLevel = (level: string): boolean => {
  const validLevels = ['N5', 'N4', 'N3', 'N2', 'N1'];
  return validLevels.includes(level);
};

export const validateCEFRLevel = (level: string): boolean => {
  const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  return validLevels.includes(level);
};
