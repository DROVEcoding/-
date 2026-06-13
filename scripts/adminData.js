export function shouldLoadAdminData(profile) {
  return profile?.role === "admin";
}

export function formatAdminOverview(row = {}) {
  return {
    userCount: Number(row.user_count || 0),
    organizationCount: Number(row.organization_count || 0),
    feedbackCount: Number(row.feedback_count || 0),
    openFeedbackCount: Number(row.open_feedback_count || 0)
  };
}

export function formatAdminUsers(rows = []) {
  return rows.map((user) => ({
    id: user.id,
    email: user.email || "未知用户",
    role: user.role || "user",
    createdAt: user.created_at,
    organizationCount: Number(user.organization_count || 0)
  }));
}

export function formatAdminOrganizations(rows = []) {
  return rows.map((organization) => ({
    id: organization.id,
    name: organization.name || "未命名组织",
    createdAt: organization.created_at,
    owners: organization.owners || [],
    memberCount: Number(organization.member_count || 0)
  }));
}

export function formatAdminFeedbackReports(rows = []) {
  return rows.map((report) => ({
    id: report.id,
    message: report.message,
    status: report.status || "open",
    createdAt: report.created_at,
    reporterEmail: report.reporter_email || "未知用户",
    organizationName: report.organization_name || "个人空间"
  }));
}

export async function loadAdminOverview(supabase) {
  const { data, error } = await supabase.rpc("get_admin_overview").single();
  if (error) {
    return { ok: false, overview: null, message: error.message };
  }

  return { ok: true, overview: formatAdminOverview(data), message: "已读取后台总览。" };
}

export async function loadAdminUsers(supabase) {
  const { data, error } = await supabase.rpc("list_admin_users");
  if (error) {
    return { ok: false, users: [], message: error.message };
  }

  return { ok: true, users: formatAdminUsers(data || []), message: "已读取用户列表。" };
}

export async function loadAdminOrganizations(supabase) {
  const { data, error } = await supabase.rpc("list_admin_organizations");
  if (error) {
    return { ok: false, organizations: [], message: error.message };
  }

  return { ok: true, organizations: formatAdminOrganizations(data || []), message: "已读取组织列表。" };
}

export async function loadAdminFeedbackReports(supabase) {
  const { data, error } = await supabase.rpc("list_admin_feedback_reports");
  if (error) {
    return { ok: false, reports: [], message: error.message };
  }

  return { ok: true, reports: formatAdminFeedbackReports(data || []), message: "已读取反馈列表。" };
}
