export function createFeedbackPayload({ userId, organizationId, message, pageUrl, userAgent, appVersion }) {
  return {
    reporter_id: userId,
    organization_id: organizationId || null,
    message: message.trim(),
    page_url: pageUrl || "",
    user_agent: userAgent || "",
    app_version: appVersion || ""
  };
}

export function validateFeedbackMessage(message) {
  const normalizedMessage = message.trim();
  if (normalizedMessage.length < 5) {
    return { ok: false, message: "反馈内容至少需要 5 个字符。" };
  }

  if (normalizedMessage.length > 2000) {
    return { ok: false, message: "反馈内容不能超过 2000 个字符。" };
  }

  return { ok: true, message: "反馈内容有效。" };
}

export async function submitFeedbackReport(supabase, payload) {
  if (!payload.reporter_id) {
    return { ok: false, report: null, message: "请先登录云端账号。" };
  }

  const validation = validateFeedbackMessage(payload.message || "");
  if (!validation.ok) {
    return { ok: false, report: null, message: validation.message };
  }

  const { data, error } = await supabase
    .from("feedback_reports")
    .insert(payload)
    .select("id, created_at")
    .single();

  if (error) {
    return { ok: false, report: null, message: error.message };
  }

  return { ok: true, report: data, message: "反馈已提交，谢谢。" };
}

export async function loadFeedbackReports(supabase) {
  const { data, error } = await supabase
    .rpc("list_feedback_reports", { row_limit: 20 });

  if (error) {
    return { ok: false, reports: [], message: error.message };
  }

  return {
    ok: true,
    reports: (data || []).map((report) => ({
      id: report.id,
      message: report.message,
      pageUrl: report.page_url,
      userAgent: report.user_agent,
      appVersion: report.app_version,
      status: report.status,
      createdAt: report.created_at,
      reporterEmail: report.reporter_email || "未知用户",
      organizationName: report.organization_name || "无组织"
    })),
    message: "已读取最近反馈。"
  };
}
