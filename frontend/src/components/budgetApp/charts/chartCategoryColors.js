const FALLBACK = [
   "#4154f1",
   "#b83941",
   "#2eca6a",
   "#ff771d",
   "#899bbd",
   "#6c757d",
   "#0dcaf0",
   "#6f42c1",
];

/**
 * @param {'income'|'expense'} kind
 * @param {string[]} categories
 * @param {(kind: string, name: string) => { color: string }} getAppearance
 */
export function colorsForCategories(kind, categories, getAppearance) {
   return categories.map((cat, i) => {
      const ap = getAppearance(kind, cat);
      return ap?.color || FALLBACK[i % FALLBACK.length];
   });
}
