import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { getSupabaseAdminClient } from '@/lib/supabaseServer';
import fs from 'fs';
import path from 'path';

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
  notes?: string;
}

function getContactsStoragePaths(): string[] {
  return [
    path.resolve(process.cwd(), 'src', 'data', 'contacts.json'),
    path.resolve(process.cwd(), '..', 'src', 'data', 'contacts.json'),
    path.resolve(process.cwd(), 'data', 'contacts.json'),
  ];
}

function readContacts(): ContactInquiry[] {
  const paths = getContactsStoragePaths();
  for (const p of paths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf8');
        return JSON.parse(raw);
      } catch {}
    }
  }
  return [];
}

function saveContacts(items: ContactInquiry[]) {
  const paths = getContactsStoragePaths();
  for (const p of paths) {
    try {
      const dir = path.dirname(p);
      if (fs.existsSync(dir)) {
        fs.writeFileSync(p, JSON.stringify(items, null, 2), 'utf8');
      }
    } catch {}
  }
}

async function fetchInquiriesFromDatabase(): Promise<ContactInquiry[]> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [];

  try {
    // 1. Try contacts table if available
    const { data: contactsData, error: cErr } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!cErr && contactsData && contactsData.length > 0) {
      return contactsData.map((c: any) => ({
        id: c.id,
        name: c.name || 'Customer',
        email: c.email || '',
        phone: c.phone || '',
        message: c.message || '',
        createdAt: c.created_at || new Date().toISOString(),
        status: (c.status || 'unread') as 'unread' | 'read' | 'replied',
        notes: c.notes || '',
      }));
    }

    // 2. Query cloud inquiry events from webhook_logs
    const { data: logData, error: lErr } = await supabase
      .from('webhook_logs')
      .select('*')
      .eq('event_type', 'contact_inquiry')
      .order('created_at', { ascending: false });

    if (!lErr && logData && logData.length > 0) {
      return logData.map((l: any) => ({
        id: l.payload?.id || l.event_id || l.id,
        name: l.payload?.name || 'Customer',
        email: l.payload?.email || l.entity_id || '',
        phone: l.payload?.phone || '',
        message: l.payload?.message || '',
        createdAt: l.payload?.createdAt || l.created_at,
        status: (l.status || l.payload?.status || 'unread') as 'unread' | 'read' | 'replied',
        notes: l.payload?.notes || '',
      }));
    }
  } catch (err) {
    console.error('Error fetching inquiries from Supabase:', err);
  }

  return [];
}

export async function GET(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const query = searchParams.get('q')?.toLowerCase();

    // 1. Fetch from live Supabase cloud database
    let all = await fetchInquiriesFromDatabase();

    // 2. Fallback to local contacts.json if database has no records
    if (all.length === 0) {
      all = readContacts();
    }

    const unreadCount = all.filter((c) => c.status === 'unread').length;

    if (status && status !== 'all') {
      all = all.filter((c) => c.status === status);
    }

    if (query) {
      all = all.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          (c.phone && c.phone.includes(query)) ||
          c.message.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      count: all.length,
      unreadCount,
      inquiries: all,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch contact inquiries' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Inquiry ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    let updatedInSupabase = false;

    if (supabase) {
      try {
        // A. Update in contacts table
        const { error: cErr } = await supabase
          .from('contacts')
          .update({
            ...(status ? { status } : {}),
            ...(notes !== undefined ? { notes } : {}),
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (!cErr) updatedInSupabase = true;
      } catch {}

      try {
        // B. Update in webhook_logs store
        const { data: existingLog } = await supabase
          .from('webhook_logs')
          .select('payload')
          .eq('event_id', id)
          .single();

        const updatedPayload = {
          ...(existingLog?.payload || {}),
          ...(status ? { status } : {}),
          ...(notes !== undefined ? { notes } : {}),
        };

        const { error: lErr } = await supabase
          .from('webhook_logs')
          .update({
            ...(status ? { status } : {}),
            payload: updatedPayload,
          })
          .eq('event_id', id);

        if (!lErr) updatedInSupabase = true;
      } catch {}
    }

    // Also update local file if present
    const all = readContacts();
    const found = all.find((c) => c.id === id);
    if (found) {
      if (status) found.status = status;
      if (notes !== undefined) found.notes = notes;
      saveContacts(all);
    }

    return NextResponse.json({
      success: true,
      message: `Inquiry ${id} updated to ${status || 'saved'}.`,
      inquiry: found || { id, status, notes },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update contact inquiry' },
      { status: 500 }
    );
  }
}
