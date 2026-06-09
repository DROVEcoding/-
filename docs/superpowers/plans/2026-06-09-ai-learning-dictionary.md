# AI Learning Dictionary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a beginner-friendly static glossary page for GitHub, Git, CLI, and AI-assisted coding terms.

**Architecture:** The project is a static three-file web app. `index.html` provides the document structure, `style.css` provides the visual design and responsive layout, and `script.js` stores glossary data plus search/filter behavior.

**Tech Stack:** HTML, CSS, JavaScript, Git, local browser preview.

---

## File Structure

Create or modify these files:

- `index.html`: Page skeleton, search input, category controls, and card container.
- `style.css`: Layout, colors, cards, buttons, empty state, and responsive behavior.
- `script.js`: Glossary data, filtering logic, rendering, and event listeners.
- `README.md`: Beginner-facing project explanation and local usage steps.
- `.gitignore`: Local-only files and temporary folders.

## Task 1: Project Basics

**Files:**
- Create: `.gitignore`
- Create: `README.md`

- [ ] **Step 1: Create `.gitignore`**

Write:

```gitignore
.DS_Store
Thumbs.db
.superpowers/
*.log
```

- [ ] **Step 2: Create `README.md`**

Write:

```markdown
# AI 学习词典

这是一个给编程新手使用的小词典网页，用来学习 GitHub、Git、CLI 和 AI 编程里的常见词。

## 第一版功能

- 查看学习词汇卡片
- 按关键词搜索
- 按分类筛选
- 搜不到时显示空结果提示

## 如何打开

直接用浏览器打开 `index.html`。

## 这个项目用来学习什么

- `index.html`：网页骨架
- `style.css`：网页外观
- `script.js`：网页交互
- Git：记录每次修改
- GitHub：上传和展示项目
```

- [ ] **Step 3: Commit project basics**

Run:

```bash
git add .gitignore README.md
git commit -m "Add project basics"
```

Expected: Git records a new commit containing the README and ignore file.

## Task 2: HTML Skeleton

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create the page structure**

Write:

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AI 学习词典</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="page-shell">
    <section class="hero">
      <div>
        <p class="eyebrow">GitHub + AI Coding</p>
        <h1>AI 学习词典</h1>
        <p class="intro">把 GitHub、CLI、Skill、Vibe Coding 等新词整理成能搜索、能筛选的学习卡片。</p>
      </div>
      <div class="summary-card" aria-label="词典统计">
        <span class="summary-number" id="termCount">0</span>
        <span class="summary-label">个入门词汇</span>
      </div>
    </section>

    <section class="toolbar" aria-label="词典工具">
      <label class="search-label" for="searchInput">搜索词汇</label>
      <input id="searchInput" class="search-input" type="search" placeholder="例如：CLI、Commit、分支">

      <div class="filter-group" aria-label="分类筛选">
        <button class="filter-button active" type="button" data-category="all">全部</button>
        <button class="filter-button" type="button" data-category="github">GitHub / Git</button>
        <button class="filter-button" type="button" data-category="ai">AI 编程</button>
        <button class="filter-button" type="button" data-category="process">项目流程</button>
      </div>
    </section>

    <section class="dictionary-grid" id="dictionaryGrid" aria-live="polite"></section>
    <p class="empty-state" id="emptyState" hidden>没有找到匹配的词。换个关键词试试。</p>
  </main>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open the page**

Open `index.html` in a browser.

Expected: The page text appears without styling polish and without glossary cards yet.

- [ ] **Step 3: Commit HTML skeleton**

Run:

```bash
git add index.html
git commit -m "Add page skeleton"
```

Expected: Git records the HTML structure.

## Task 3: Styling

**Files:**
- Create: `style.css`

- [ ] **Step 1: Add CSS**

Write:

```css
:root {
  --bg: #f4f7fb;
  --card: #ffffff;
  --text: #172033;
  --muted: #5d6878;
  --line: #d8e1ed;
  --accent: #0f766e;
  --accent-dark: #0b5f59;
  --github: #dcfce7;
  --github-text: #166534;
  --ai: #fef3c7;
  --ai-text: #92400e;
  --process: #e0f2fe;
  --process-text: #075985;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif;
  color: var(--text);
  background: var(--bg);
}

.page-shell {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 40px 0 56px;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 20px;
  align-items: stretch;
  margin-bottom: 22px;
}

.hero,
.toolbar,
.summary-card,
.term-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--card);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
}

.hero {
  padding: 30px;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--accent);
  font-weight: 700;
}

h1 {
  margin: 0 0 12px;
  font-size: 38px;
  line-height: 1.15;
}

.intro {
  max-width: 680px;
  margin: 0;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.75;
}

.summary-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 150px;
}

.summary-number {
  font-size: 44px;
  font-weight: 800;
  color: var(--accent);
}

.summary-label {
  color: var(--muted);
}

.toolbar {
  padding: 18px;
  margin-bottom: 20px;
}

.search-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 700;
}

.search-input {
  width: 100%;
  height: 46px;
  border: 1px solid #c6d1df;
  border-radius: 8px;
  padding: 0 14px;
  font-size: 16px;
  color: var(--text);
  background: #fbfcff;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.filter-button {
  border: 1px solid #c6d1df;
  border-radius: 6px;
  background: #ffffff;
  color: #334155;
  padding: 9px 12px;
  font-size: 14px;
  cursor: pointer;
}

.filter-button.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #ffffff;
}

.dictionary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.term-card {
  padding: 18px;
  min-height: 220px;
}

.category-badge {
  display: inline-flex;
  margin-bottom: 14px;
  padding: 5px 8px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 700;
}

.category-github {
  background: var(--github);
  color: var(--github-text);
}

.category-ai {
  background: var(--ai);
  color: var(--ai-text);
}

.category-process {
  background: var(--process);
  color: var(--process-text);
}

.term-card h2 {
  margin: 0 0 10px;
  font-size: 22px;
}

.term-card p {
  margin: 0 0 12px;
  color: var(--muted);
  line-height: 1.65;
}

.term-card strong {
  color: var(--text);
}

.empty-state {
  margin: 22px 0 0;
  padding: 24px;
  border: 1px dashed #b8c4d4;
  border-radius: 8px;
  color: var(--muted);
  text-align: center;
  background: rgba(255, 255, 255, 0.72);
}

@media (max-width: 860px) {
  .hero,
  .dictionary-grid {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 31px;
  }
}
```

- [ ] **Step 2: Refresh the browser**

Expected: The page has a calm study-focused layout, but cards still do not appear until JavaScript is added.

- [ ] **Step 3: Commit styling**

Run:

```bash
git add style.css
git commit -m "Add dictionary styling"
```

Expected: Git records the CSS.

## Task 4: Glossary Data and Rendering

**Files:**
- Create: `script.js`

- [ ] **Step 1: Add JavaScript**

Write:

```javascript
const terms = [
  { term: "Git", category: "github", categoryLabel: "GitHub / Git", definition: "版本管理工具，用来记录项目每一次变化。", solves: "解决代码改乱后无法回退、多人修改难追踪的问题。" },
  { term: "GitHub", category: "github", categoryLabel: "GitHub / Git", definition: "代码托管和协作平台，可以把项目放到网上。", solves: "解决项目备份、展示、协作和开源发布的问题。" },
  { term: "Repository", category: "github", categoryLabel: "GitHub / Git", definition: "仓库，一个项目的文件和历史记录集合。", solves: "解决项目文件需要集中管理的问题。" },
  { term: "Commit", category: "github", categoryLabel: "GitHub / Git", definition: "一次正式保存的项目版本。", solves: "解决需要知道什么时候改了什么的问题。" },
  { term: "Branch", category: "github", categoryLabel: "GitHub / Git", definition: "分支，在不影响主版本的情况下尝试新功能。", solves: "解决开发新功能时怕破坏稳定版本的问题。" },
  { term: "Pull Request", category: "github", categoryLabel: "GitHub / Git", definition: "请求别人检查并合并代码。", solves: "解决团队协作中代码需要审核的问题。" },
  { term: "Merge", category: "github", categoryLabel: "GitHub / Git", definition: "把一个分支的改动合到另一个分支。", solves: "解决不同开发成果需要汇总的问题。" },
  { term: "Conflict", category: "github", categoryLabel: "GitHub / Git", definition: "冲突，两个改动碰到同一处时 Git 需要人来判断。", solves: "解决系统无法自动决定保留哪段内容的问题。" },
  { term: "CLI", category: "ai", categoryLabel: "AI 编程", definition: "命令行界面，用文字命令操作电脑和开发工具。", solves: "解决图形界面不够自动化、不够精确的问题。" },
  { term: "Skill", category: "ai", categoryLabel: "AI 编程", definition: "AI 的专业能力包，让 AI 按某类任务的流程工作。", solves: "解决 AI 做复杂任务时缺少固定方法的问题。" },
  { term: "Agent", category: "ai", categoryLabel: "AI 编程", definition: "能读文件、改代码、运行命令并持续推进任务的 AI。", solves: "解决 AI 只能聊天、不能真正执行项目步骤的问题。" },
  { term: "Prompt", category: "ai", categoryLabel: "AI 编程", definition: "你给 AI 的任务描述或指令。", solves: "解决 AI 需要知道目标、限制和输出形式的问题。" },
  { term: "Context", category: "ai", categoryLabel: "AI 编程", definition: "AI 当前能看到的信息，包括需求、代码和对话。", solves: "解决 AI 需要根据背景做判断的问题。" },
  { term: "Vibe Coding", category: "ai", categoryLabel: "AI 编程", definition: "用自然语言描述感觉和目标，让 AI 快速生成并迭代代码。", solves: "解决从想法到原型太慢的问题。" },
  { term: "Plugin", category: "ai", categoryLabel: "AI 编程", definition: "给工具或 AI 增加额外能力的扩展。", solves: "解决基础工具能力不够用的问题。" },
  { term: "MCP", category: "ai", categoryLabel: "AI 编程", definition: "模型上下文协议，让 AI 更标准地连接外部工具和数据。", solves: "解决 AI 连接工具方式混乱、不统一的问题。" },
  { term: "MVP", category: "process", categoryLabel: "项目流程", definition: "最小可用产品，先做最核心的一版。", solves: "解决一开始想做太多导致迟迟做不完的问题。" },
  { term: "Prototype", category: "process", categoryLabel: "项目流程", definition: "原型，用来快速验证想法的早期版本。", solves: "解决还没确定方向就投入太多开发成本的问题。" },
  { term: "Deploy", category: "process", categoryLabel: "项目流程", definition: "部署，把项目发布到别人可以访问的地方。", solves: "解决项目只在自己电脑上能看的问题。" },
  { term: "README", category: "process", categoryLabel: "项目流程", definition: "项目说明书，介绍项目是什么、怎么使用。", solves: "解决别人打开项目不知道从哪里开始的问题。" }
];

const grid = document.querySelector("#dictionaryGrid");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll(".filter-button");
const emptyState = document.querySelector("#emptyState");
const termCount = document.querySelector("#termCount");

let activeCategory = "all";

function normalizeText(value) {
  return value.trim().toLowerCase();
}

function getVisibleTerms() {
  const query = normalizeText(searchInput.value);

  return terms.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const searchableText = normalizeText(`${item.term} ${item.categoryLabel} ${item.definition} ${item.solves}`);
    const matchesSearch = searchableText.includes(query);
    return matchesCategory && matchesSearch;
  });
}

function renderTerms() {
  const visibleTerms = getVisibleTerms();

  grid.innerHTML = visibleTerms.map((item) => `
    <article class="term-card">
      <span class="category-badge category-${item.category}">${item.categoryLabel}</span>
      <h2>${item.term}</h2>
      <p>${item.definition}</p>
      <p><strong>解决的问题：</strong>${item.solves}</p>
    </article>
  `).join("");

  emptyState.hidden = visibleTerms.length > 0;
  termCount.textContent = terms.length;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderTerms();
  });
});

searchInput.addEventListener("input", renderTerms);

renderTerms();
```

- [ ] **Step 2: Test rendering manually**

Open or refresh `index.html`.

Expected:

- 20 cards appear.
- The summary shows `20`.
- The category badges have different colors.

- [ ] **Step 3: Commit rendering**

Run:

```bash
git add script.js
git commit -m "Add glossary data and rendering"
```

Expected: Git records the working glossary.

## Task 5: Manual Verification and Final Commit

**Files:**
- Modify if needed: `index.html`
- Modify if needed: `style.css`
- Modify if needed: `script.js`
- Modify if needed: `README.md`

- [ ] **Step 1: Run manual checks**

Check in the browser:

- Search `CLI`; the CLI card remains.
- Search `分支`; the Branch card remains.
- Click `GitHub / Git`; only GitHub/Git cards appear.
- Click `AI 编程`; only AI coding cards appear.
- Click `项目流程`; only project workflow cards appear.
- Search `xxxx`; the empty message appears.
- Make the browser narrow; cards stack into one column.

- [ ] **Step 2: Check Git status**

Run:

```bash
git status --short
```

Expected: No output if everything is committed, or a short list of files that still need one final commit.

- [ ] **Step 3: Commit final polish if files changed**

Run only if `git status --short` shows changed files:

```bash
git add index.html style.css script.js README.md .gitignore
git commit -m "Polish dictionary project"
```

Expected: Git records the final project state.

## Task 6: Prepare for GitHub Upload

**Files:**
- No file changes required.

- [ ] **Step 1: Rename branch to `main`**

Run:

```bash
git branch -M main
```

Expected: The local branch is named `main`, matching modern GitHub defaults.

- [ ] **Step 2: Create an empty GitHub repository in the browser**

Use GitHub's web UI:

- Repository name: `ai-learning-dictionary`
- Visibility: public or private
- Do not add README, `.gitignore`, or license on GitHub, because the local project already has files.

- [ ] **Step 3: Connect local repo to GitHub**

Run this after replacing the URL with the real repository URL:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-learning-dictionary.git
git push -u origin main
```

Expected: Git uploads the local commits to GitHub.

## Self-Review

- The plan covers the approved design: static page, three main files, search, category filtering, empty state, responsive layout, README, Git, and GitHub preparation.
- The plan intentionally avoids login, database, online editing, favorites, dark mode, frameworks, and backend work.
- Terms, categories, CSS class names, and DOM IDs are consistent across tasks.
