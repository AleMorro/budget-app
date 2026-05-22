import React from "react";

/** @param {{ color: string, icon: string, size?: string }} style */
function CategoryAppearanceIcon({ style, size = "1rem" }) {
   if (!style) return null;
   return (
      <i
         className={style.icon}
         style={{ color: style.color, fontSize: size }}
         aria-hidden
      />
   );
}

export default CategoryAppearanceIcon;
