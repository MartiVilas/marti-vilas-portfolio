import en from "../languages/en/en.json";
import es from "../languages/es/es.json";

export const defaultLocale = "es";

const dictionaries = {
	en,
	es,
} as const;

export type Locale = keyof typeof dictionaries;
export type TranslationKey = keyof (typeof dictionaries)[typeof defaultLocale];

export function t<Key extends TranslationKey>(
	key: Key,
	locale: Locale = defaultLocale,
): (typeof dictionaries)[typeof defaultLocale][Key] {
	return (dictionaries[locale][key] ??
		dictionaries[defaultLocale][key]) as (typeof dictionaries)[typeof defaultLocale][Key];
}
