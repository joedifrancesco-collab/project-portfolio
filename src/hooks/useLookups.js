import { useState, useEffect } from 'react';

export function useLookups() {
  const [categories, setCategories] = useState([]);
  const [businessUnits, setBusinessUnits] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(data.map((d) => d.name)))
      .catch(() => {});

    fetch('/api/business-units')
      .then((r) => r.json())
      .then((data) => setBusinessUnits(data.map((d) => d.name)))
      .catch(() => {});
  }, []);

  return { categories, businessUnits };
}
