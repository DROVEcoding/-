create or replace function public.get_admin_overview()
returns table (
  user_count bigint,
  organization_count bigint,
  feedback_count bigint,
  open_feedback_count bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception '只有超级管理员可以读取后台总览。';
  end if;

  return query
    select
      (select count(*) from public.profiles),
      (select count(*) from public.organizations),
      (select count(*) from public.feedback_reports),
      (select count(*) from public.feedback_reports where status = 'open');
end;
$$;

create or replace function public.list_admin_users()
returns table (
  id uuid,
  email text,
  role public.app_role,
  created_at timestamptz,
  organization_count bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception '只有超级管理员可以读取用户列表。';
  end if;

  return query
    select
      p.id,
      p.email,
      p.role,
      p.created_at,
      count(om.organization_id) as organization_count
    from public.profiles as p
    left join public.organization_memberships as om on om.user_id = p.id
    group by p.id, p.email, p.role, p.created_at
    order by p.created_at desc;
end;
$$;

create or replace function public.list_admin_organizations()
returns table (
  id uuid,
  name text,
  created_at timestamptz,
  owners text[],
  member_count bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception '只有超级管理员可以读取组织列表。';
  end if;

  return query
    select
      o.id,
      o.name,
      o.created_at,
      array_remove(array_agg(p.email order by p.email) filter (where om.role = 'owner'), null) as owners,
      count(om.user_id) as member_count
    from public.organizations as o
    left join public.organization_memberships as om on om.organization_id = o.id
    left join public.profiles as p on p.id = om.user_id
    group by o.id, o.name, o.created_at
    order by o.created_at desc;
end;
$$;

create or replace function public.list_admin_feedback_reports()
returns table (
  id uuid,
  message text,
  status text,
  created_at timestamptz,
  reporter_email text,
  organization_name text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception '只有超级管理员可以读取反馈列表。';
  end if;

  return query
    select
      f.id,
      f.message,
      f.status,
      f.created_at,
      p.email as reporter_email,
      o.name as organization_name
    from public.feedback_reports as f
    left join public.profiles as p on p.id = f.reporter_id
    left join public.organizations as o on o.id = f.organization_id
    order by f.created_at desc
    limit 100;
end;
$$;

grant execute on function public.get_admin_overview() to authenticated;
grant execute on function public.list_admin_users() to authenticated;
grant execute on function public.list_admin_organizations() to authenticated;
grant execute on function public.list_admin_feedback_reports() to authenticated;
