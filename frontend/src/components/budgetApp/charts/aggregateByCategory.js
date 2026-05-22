export function aggregateByCategory(items) {
   const map = new Map();
   (items || []).forEach((row) => {
      const key = row.category || "Other";
      const n = Number(row.amount) || 0;
      map.set(key, (map.get(key) || 0) + n);
   });
   const pairs = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
   return {
      categories: pairs.map(([k]) => k),
      values: pairs.map(([, v]) => v),
   };
}
