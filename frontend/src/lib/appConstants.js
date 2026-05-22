/** @typedef {'income'|'expense'} CategoryKind */

export const DEFAULT_INCOME_CATEGORIES = [
   "Salary",
   "Investment",
   "Sales",
   "Freelance",
   "Other",
];

export const DEFAULT_EXPENSE_CATEGORIES = [
   "Food",
   "Shopping",
   "Gifts",
   "Entertainment",
   "Transport",
   "Home",
   "Vices",
   "Other",
];

/** Bootstrap Icons class names (without bi prefix duplication) */
export const ICON_CHOICES = [
   { value: "bi-tag", label: "Tag" },
   { value: "bi-bag", label: "Bag" },
   { value: "bi-cart", label: "Cart" },
   { value: "bi-cup-hot", label: "Food" },
   { value: "bi-house", label: "House" },
   { value: "bi-car-front", label: "Transport" },
   { value: "bi-gift", label: "Gift" },
   { value: "bi-controller", label: "Fun" },
   { value: "bi-bank", label: "Bank" },
   { value: "bi-currency-euro", label: "Euro" },
   { value: "bi-wallet2", label: "Wallet" },
   { value: "bi-graph-up", label: "Graph" },
   { value: "bi-briefcase", label: "Work" },
   { value: "bi-heart", label: "Heart" },
   { value: "bi-lightning", label: "Lightning" },
   { value: "bi-star", label: "Star" },
];

export const DEFAULT_CATEGORY_STYLE = {
   color: "#6c757d",
   icon: "bi-tag",
};
