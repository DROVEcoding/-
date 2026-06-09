# AI 工作字典 V3 编辑词条实施计划

> **给 AI 工作者的要求：** 在 `v3-edit-terms` 分支上执行。文档和解释使用中文；代码命名保持英文通用习惯；关键逻辑加简短中文注释；每个阶段运行验证并小步提交。

**目标：** 支持编辑已有词条，保存到 `localStorage`，并通过 Pull Request 合并回 `main`。

**架构：** 复用 V2 的新增词条表单作为编辑表单。`app.js` 增加 `editingTermId` 状态，`render.js` 给卡片增加编辑按钮，`README.md` 补充 V3 说明。

**技术栈：** HTML、CSS、原生 JavaScript 模块、localStorage、Node test、Git、GitHub CLI。

---

## 文件变更总览

会修改：

- `index.html`
- `style.css`
- `scripts/app.js`
- `scripts/render.js`
- `tests/logic.test.mjs`
- `README.md`

不预计修改：

- `scripts/storage.js`
- `scripts/filters.js`
- `scripts/data.js`

## 任务 1：先写编辑逻辑测试

**文件：**

- 修改：`tests/logic.test.mjs`

**步骤：**

- [ ] 增加一个测试：编辑词条时应保留原 `id`、`status`、`isDefault`。
- [ ] 增加一个测试：取消编辑不改变原词条数据。
- [ ] 运行 `node --test tests\logic.test.mjs`。
- [ ] 预期：测试先失败，因为编辑辅助函数还不存在。

**验证重点：**

- 先看到失败，确认测试确实覆盖新行为。

## 任务 2：增加编辑数据辅助函数

**文件：**

- 修改：`scripts/app.js` 或新增可测试的导出函数位置
- 修改：`tests/logic.test.mjs`

**步骤：**

- [ ] 增加 `updateTermContent` 这类纯函数，用来根据 `id` 更新词条内容。
- [ ] 该函数保留原词条的 `id`、`status`、`isDefault`。
- [ ] 分类变化时同步更新 `categoryLabel`。
- [ ] 运行 `node --test tests\logic.test.mjs`。
- [ ] 提交：`Add edit term data logic`

**验证重点：**

- 测试通过。
- 纯逻辑独立可测试，不依赖浏览器 DOM。

## 任务 3：表单支持新增模式和编辑模式

**文件：**

- 修改：`index.html`
- 修改：`scripts/app.js`
- 修改：`style.css`

**步骤：**

- [ ] 在表单区域增加可变化标题元素，例如 `formTitle`。
- [ ] 新增 `取消编辑` 按钮，默认隐藏。
- [ ] `app.js` 增加 `editingTermId` 状态。
- [ ] 增加 `enterEditMode(termId)`：把词条内容填入表单。
- [ ] 增加 `exitEditMode()`：清空表单并回到新增模式。
- [ ] 表单提交时根据 `editingTermId` 决定新增或保存编辑。
- [ ] 在 `style.css` 中增加编辑模式提示和取消按钮样式。
- [ ] 提交：`Add edit mode form behavior`

**验证重点：**

- 默认是新增模式。
- 点击取消后表单恢复新增模式。

## 任务 4：卡片增加编辑按钮

**文件：**

- 修改：`scripts/render.js`
- 修改：`scripts/app.js`
- 修改：`style.css`

**步骤：**

- [ ] 在每张卡片的操作区增加 `编辑` 按钮。
- [ ] `renderTerms` 接收 `onEdit` 回调。
- [ ] 点击编辑按钮调用 `enterEditMode(termId)`。
- [ ] 调整按钮样式，让 `编辑` 和 `删除` 都清楚但不拥挤。
- [ ] 提交：`Add edit action to term cards`

**验证重点：**

- 每张卡片都有编辑按钮。
- 点击后表单填入对应词条内容。

## 任务 5：保存编辑到 localStorage

**文件：**

- 修改：`scripts/app.js`

**步骤：**

- [ ] 保存编辑后更新内存里的词条列表。
- [ ] 调用现有保存逻辑写入 `localStorage`。
- [ ] 保存成功后退出编辑模式。
- [ ] 重新渲染卡片。
- [ ] 手动刷新浏览器，确认编辑结果保留。
- [ ] 提交：`Persist edited terms`

**验证重点：**

- 编辑默认词条后刷新仍然保留修改。
- 编辑自定义词条后刷新仍然保留修改。
- 原学习状态不丢失。

## 任务 6：更新 README 中文说明

**文件：**

- 修改：`README.md`

**步骤：**

- [ ] 把功能说明更新为 V3。
- [ ] 在模块中文用途表里补充 `scripts/app.js` 现在负责编辑模式。
- [ ] 说明 V3 的编辑行为：编辑会保留学习状态，重置会清空自定义修改。
- [ ] 提交：`Update README for V3 editing`

**验证重点：**

- README 继续包含中文模块用途表。
- 新手能看懂编辑功能在哪些文件里实现。

## 任务 7：最终验证和推送分支

**文件：**

- 不一定修改。

**步骤：**

- [ ] 运行 `node --test tests\logic.test.mjs`。
- [ ] 本地用 HTTP server 打开页面。
- [ ] 手动验证：
  - 默认词条可编辑
  - 自定义词条可编辑
  - 保存后刷新仍然保留
  - 取消编辑不改变原内容
  - 搜索和筛选仍然正常
  - 删除仍然正常
  - 重置仍然正常
- [ ] 检查 `git status --short`。
- [ ] push `v3-edit-terms` 分支。

## 任务 8：创建 Pull Request 并关联 Issue #1

**文件：**

- 不修改本地代码。

**步骤：**

- [ ] 使用 `gh pr create` 创建 PR。
- [ ] PR 标题：`V3：支持编辑已有词条`
- [ ] PR 描述包含：
  - 功能摘要
  - 测试结果
  - `Closes #1`
- [ ] 打开 PR 页面确认。

**验证重点：**

- PR 从 `v3-edit-terms` 指向 `main`。
- PR 描述关联 Issue #1。
- 合并 PR 后 Issue #1 会自动关闭。

## 自检清单

- 编辑、取消、保存、localStorage、README、测试、PR 都有任务覆盖。
- V3 不引入框架、不引入后端。
- V3 在分支上开发，不直接污染 `main`。
- README 中文说明要求已包含。
