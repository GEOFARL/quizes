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
