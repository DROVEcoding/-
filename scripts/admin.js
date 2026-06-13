import { getCloudUser } from "./cloudSync.js";
import { loadProfile, getRoleLabel } from "./permissions.js";
import { createSupabaseClient, isSupabaseConfigured } from "./supabaseClient.js";
import {
  loadAdminFeedbackReports,
  loadAdminOrganizations,
  loadAdminOverview,
  loadAdminUsers,
  shouldLoadAdminData
} from "./adminData.js";

const supabase = await createSupabaseClient();

const adminIdentityLabel = document.querySelector("#adminIdentityLabel");
const adminGate = document.querySelector("#adminGate");
const adminContent = document.querySelector("#adminContent");
const adminOverview = document.querySelector("#adminOverview");
const adminUsers = document.querySelector("#adminUsers");
const adminOrganizations = document.querySelector("#adminOrganizations");
const adminFeedback = document.querySelector("#adminFeedback");

function setGateMessage(message, type = "info") {
  adminGate.textContent = message;
  adminGate.dataset.type = type;
  adminGate.hidden = !message;
}

function createTextBlock(primary, secondary) {
  const block = document.createElement("div");
  block.className = "admin-row-text";

  const title = document.createElement("strong");
  title.textContent = primary;
  block.append(title);

  if (secondary) {
    const meta = document.createElement("span");
    meta.textContent = secondary;
    block.append(meta);
  }

  return block;
}

function createBadge(text) {
  const badge = document.createElement("span");
  badge.className = "admin-badge";
  badge.textContent = text;
  return badge;
}

function renderOverview(overview) {
  const cards = [
    ["用户", overview.userCount],
    ["组织", overview.organizationCount],
    ["反馈", overview.feedbackCount],
    ["未处理反馈", overview.openFeedbackCount]
  ];

  adminOverview.replaceChildren(...cards.map(([label, value]) => {
    const card = document.createElement("div");
    card.className = "admin-overview-card";

    const number = document.createElement("strong");
    number.textContent = value;

    const caption = document.createElement("span");
    caption.textContent = label;

    card.append(number, caption);
    return card;
  }));
}

function renderUsers(users) {
  if (users.length === 0) {
    adminUsers.textContent = "还没有用户。";
    return;
  }

  adminUsers.replaceChildren(...users.map((user) => {
    const row = document.createElement("div");
    row.className = "admin-row";
    row.append(
      createTextBlock(user.email, `创建时间：${new Date(user.createdAt).toLocaleString()}`),
      createBadge(getRoleLabel(user.role)),
      createBadge(`组织 ${user.organizationCount}`)
    );
    return row;
  }));
}

function renderOrganizations(organizations) {
  if (organizations.length === 0) {
    adminOrganizations.textContent = "还没有组织。";
    return;
  }

  adminOrganizations.replaceChildren(...organizations.map((organization) => {
    const owners = organization.owners.length > 0 ? organization.owners.join("、") : "暂无拥有者";
    const row = document.createElement("div");
    row.className = "admin-row";
    row.append(
      createTextBlock(organization.name, `拥有者：${owners}`),
      createBadge(`成员 ${organization.memberCount}`),
      createBadge(new Date(organization.createdAt).toLocaleDateString())
    );
    return row;
  }));
}

function renderFeedback(reports) {
  if (reports.length === 0) {
    adminFeedback.textContent = "还没有反馈。";
    return;
  }

  adminFeedback.replaceChildren(...reports.map((report) => {
    const row = document.createElement("div");
    row.className = "admin-row admin-feedback-row";
    row.append(
      createTextBlock(report.message, `${report.reporterEmail} / ${report.organizationName} / ${new Date(report.createdAt).toLocaleString()}`),
      createBadge(report.status)
    );
    return row;
  }));
}

async function loadAdminConsole() {
  setGateMessage("正在读取后台数据...", "info");
  const [overviewResult, usersResult, organizationsResult, feedbackResult] = await Promise.all([
    loadAdminOverview(supabase),
    loadAdminUsers(supabase),
    loadAdminOrganizations(supabase),
    loadAdminFeedbackReports(supabase)
  ]);

  const failedResult = [overviewResult, usersResult, organizationsResult, feedbackResult]
    .find((result) => !result.ok);
  if (failedResult) {
    setGateMessage(failedResult.message, "error");
    return;
  }

  renderOverview(overviewResult.overview);
  renderUsers(usersResult.users);
  renderOrganizations(organizationsResult.organizations);
  renderFeedback(feedbackResult.reports);
  adminContent.hidden = false;
  setGateMessage("");
}

async function initializeAdminPage() {
  if (!isSupabaseConfigured()) {
    adminIdentityLabel.textContent = "Supabase 未配置";
    setGateMessage("Supabase 未配置，无法读取后台数据。", "error");
    return;
  }

  const userResult = await getCloudUser(supabase);
  if (!userResult.ok) {
    adminIdentityLabel.textContent = "未登录";
    setGateMessage("请先返回词典页登录云端账号。", "error");
    return;
  }

  const profileResult = await loadProfile(supabase, userResult.user);
  if (!profileResult.ok || !profileResult.profile) {
    adminIdentityLabel.textContent = userResult.user.email;
    setGateMessage(profileResult.message, "error");
    return;
  }

  adminIdentityLabel.textContent = `${userResult.user.email} / ${getRoleLabel(profileResult.profile.role)}`;
  if (!shouldLoadAdminData(profileResult.profile)) {
    setGateMessage("当前账号不是超级管理员，不能访问后台。", "error");
    return;
  }

  await loadAdminConsole();
}

initializeAdminPage();
