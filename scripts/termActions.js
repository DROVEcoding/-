import { categoryLabels } from "./data.js";

export function updateTermContent(terms, id, updates) {
  return terms.map((term) => {
    if (term.id !== id) {
      return term;
    }

    // 编辑只更新可见内容，保留 id、学习状态和默认来源。
    return {
      ...term,
      term: updates.term.trim(),
      category: updates.category,
      categoryLabel: categoryLabels[updates.category],
      definition: updates.definition.trim(),
      solves: updates.solves.trim()
    };
  });
}
