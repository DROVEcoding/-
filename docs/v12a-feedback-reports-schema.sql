create table if not exists public.feedback_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  message text not null check (char_length(trim(message)) between 5 and 2000),
  page_url text not null default '',
  user_agent text not null default '',
  app_version text not null default '',
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create index if not exists feedback_reports_created_idx
on public.feedback_reports (created_at desc);

create index if not exists feedback_reports_reporter_idx
on public.feedback_reports (reporter_id, created_at desc);

alter table public.feedback_reports enable row level security;

drop policy if exists "Users can submit their own feedback" on public.feedback_reports;
create policy "Users can submit their own feedback"
on public.feedback_reports
for insert
to authenticated
with check (
  auth.uid() = reporter_id
  and (
    organization_id is null
    or public.is_org_member(organization_id)
  )
);

drop policy if exists "Users can read their own feedback and admins can read all" on public.feedback_reports;
create policy "Users can read their own feedback and admins can read all"
on public.feedback_reports
for select
to authenticated
using (auth.uid() = reporter_id or public.is_admin());

grant select, insert on table public.feedback_reports to authenticated;

create or replace function public.list_feedback_reports(row_limit integer default 20)
returns table (
  id uuid,
  message text,
  page_url text,
  user_agent text,
  app_version text,
  status text,
  created_at timestamptz,
  reporter_email text,
  organization_name text
)
language sql
security definer
set search_path = public
as $$
  select
    reports.id,
    reports.message,
    reports.page_url,
    reports.user_agent,
    reports.app_version,
    reports.status,
    reports.created_at,
    profiles.email as reporter_email,
    coalesce(organizations.name, '无组织') as organization_name
  from public.feedback_reports as reports
  join public.profiles as profiles on profiles.id = reports.reporter_id
  left join public.organizations as organizations on organizations.id = reports.organization_id
  where public.is_admin()
  order by reports.created_at desc
  limit least(greatest(row_limit, 1), 50);
$$;

grant execute on function public.list_feedback_reports(integer) to authenticated;
