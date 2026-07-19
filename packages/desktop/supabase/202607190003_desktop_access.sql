-- Allow authenticated desktop users to request access without granting them
-- direct write permission on access_grants or audit_events.

create or replace function public.request_access()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_email text;
  current_grant public.access_grants%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  current_email := lower(trim(auth.jwt() ->> 'email'));
  if current_email is null or current_email = '' then
    raise exception 'A verified Google email is required';
  end if;

  select * into current_grant
  from public.access_grants
  where user_id = auth.uid() or email = current_email
  order by (user_id = auth.uid()) desc
  limit 1;

  if current_grant.id is null then
    insert into public.access_grants (user_id, email, role, status)
    values (auth.uid(), current_email, 'member', 'pending');
  elsif current_grant.user_id is null then
    update public.access_grants
    set user_id = auth.uid(), updated_at = now()
    where id = current_grant.id;
  end if;

  insert into public.audit_events (
    user_id,
    actor_id,
    event_type,
    resource_type,
    resource_id,
    metadata
  ) values (
    auth.uid(),
    auth.uid(),
    'access.requested',
    'access_grant',
    coalesce(current_grant.id::text, auth.uid()::text),
    jsonb_build_object('email', current_email, 'source', 'desktop')
  );
end;
$$;

revoke all on function public.request_access() from public;
revoke all on function public.request_access() from anon;
grant execute on function public.request_access() to authenticated;
