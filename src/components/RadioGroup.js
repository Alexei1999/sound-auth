import React, { useState } from "react";
import { RadioButton } from "primereact/radiobutton";

export function RadioGroup({ items }) {
  const [selectedCategory, setSelectedCategory] = useState(items[0]);

  return (
    <div className="card">
      {items.map((item) => {
        return (
          <div key={item.key} className="p-field-radiobutton">
            <RadioButton
              inputId={item.key}
              name="item"
              value={item}
              onChange={(e) => setSelectedCategory(e.value)}
              checked={selectedCategory.key === item.key}
            />
            <label htmlFor={item.key}>{item.name}</label>
          </div>
        );
      })}
    </div>
  );
}
