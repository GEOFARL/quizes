/* eslint-disable @typescript-eslint/no-explicit-any */
export const pluralize = (
  count: number,
  path: string,
  dictionary: Record<string, any>,
  rules: Record<string, (count: number) => number>
): string => {
  const config = path.split(".").reduce((acc, key) => acc?.[key], dictionary);

  if (!config || !config.forms || !config.ruleKey) {
    throw new Error(`Invalid pluralization configuration for path: "${path}"`);
  }

  const { forms, ruleKey } = config;

  if (!Array.isArray(forms) || forms.length === 0) {
    throw new Error(`Plural forms are missing or invalid for path: "${path}"`);
  }

  const rule = rules[ruleKey];

  if (typeof rule !== "function") {
    throw new Error(`No valid pluralization rule found for key: "${ruleKey}"`);
  }

  const formIndex = rule(count);
  const form = forms[formIndex];

  if (!form) {
    throw new Error(
      `Invalid form index for path: "${path}". Ensure the rule and forms match.`
    );
  }

  return `${count} ${form}`;
};

export const pluralizationRules: Record<string, (count: number) => number> = {
  en: (count: number) => (count === 1 ? 0 : 1),
  uk: (count: number) => {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return 0;
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return 1;
    return 2;
  },
};
