export const STORAGE_KEY = "ai-learning-dictionary-v2";
const BACKUP_APP = "ai-work-dictionary";
const BACKUP_VERSION = 1;

function cloneTerms(terms) {
  return terms.map((term) => ({ ...term }));
}

function isValidTerm(term) {
  return Boolean(
    term &&
    typeof term.id === "string" &&
    typeof term.term === "string" &&
    typeof term.category === "string" &&
    typeof term.categoryLabel === "string" &&
    typeof term.definition === "string" &&
    typeof term.solves === "string" &&
    typeof term.status === "string"
  );
}

export function loadTerms(storage, fallbackTerms) {
  try {
    const saved = storage.getItem(STORAGE_KEY);
    if (!saved) {
      return cloneTerms(fallbackTerms);
    }

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.every(isValidTerm)) {
      return cloneTerms(fallbackTerms);
    }

    return cloneTerms(parsed);
  } catch {
    return cloneTerms(fallbackTerms);
  }
}

export function saveTerms(storage, terms) {
  storage.setItem(STORAGE_KEY, JSON.stringify(terms));
}

export function resetTerms(storage, defaultTerms) {
  const freshTerms = cloneTerms(defaultTerms);
  saveTerms(storage, freshTerms);
  return freshTerms;
}

export function exportTermsBackup(terms) {
  return JSON.stringify({
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    terms: cloneTerms(terms)
  }, null, 2);
}

export function importTermsBackup(backupText) {
  try {
    const parsed = JSON.parse(backupText);
    if (
      parsed?.app !== BACKUP_APP ||
      parsed?.version !== BACKUP_VERSION ||
      !Array.isArray(parsed?.terms) ||
      !parsed.terms.every(isValidTerm)
    ) {
      return { ok: false, terms: null, message: "备份文件格式不正确。" };
    }

    return { ok: true, terms: cloneTerms(parsed.terms), message: "导入成功。" };
  } catch {
    return { ok: false, terms: null, message: "无法读取这个备份文件。" };
  }
}
