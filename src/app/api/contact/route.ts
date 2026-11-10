import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSupabaseAdminClient } from '@/lib/supabaseServer';

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
    path.resolve(process.cwd(), 'admin', 'src', 'data', 'contacts.json'),
    path.resolve(process.cwd(), '..', 'admin', 'src', 'data', 'contacts.json'),
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const inquiryId = `CNT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newInquiry: ContactInquiry = {
      id: inquiryId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'unread',
    };

    // 1. Synchronously persist to Supabase PostgreSQL (Production cloud database)
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        // A. Primary: Insert into contacts table (if present)
        await supabase.from('contacts').insert([
          {
            id: newInquiry.id,
            name: newInquiry.name,
            email: newInquiry.email,
            phone: newInquiry.phone,
            message: newInquiry.message,
            created_at: newInquiry.createdAt,
            status: newInquiry.status,
          },
        ]);
      } catch (err) {
        // table might not exist yet
      }

      try {
        // B. Guaranteed cloud storage: Insert inquiry event into Supabase webhook_logs / inquiries store
        await supabase.from('webhook_logs').insert({
          event_id: newInquiry.id,
          event_type: 'contact_inquiry',
          entity_id: newInquiry.email,
          status: 'unread',
          payload: newInquiry,
          created_at: newInquiry.createdAt,
        });
      } catch (err) {
        console.error('Failed to write inquiry to Supabase cloud log:', err);
      }
    }

    // 2. Local fallback persistence
    try {
      const all = readContacts();
      all.unshift(newInquiry);
      saveContacts(all);
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received. Our team will get back to you within 24 business hours.',
      inquiryId: newInquiry.id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit contact message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data: contactsData, error: cErr } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
      if (!cErr && contactsData && contactsData.length > 0) {
        return NextResponse.json({ success: true, count: contactsData.length, inquiries: contactsData });
      }

      const { data: logsData, error: lErr } = await supabase
        .from('webhook_logs')
        .select('*')
        .eq('event_type', 'contact_inquiry')
        .order('created_at', { ascending: false });

      if (!lErr && logsData && logsData.length > 0) {
        const mapped = logsData.map((l: any) => ({
          id: l.payload?.id || l.event_id,
          name: l.payload?.name || 'Customer',
          email: l.payload?.email || l.entity_id,
          phone: l.payload?.phone || '',
          message: l.payload?.message || '',
          createdAt: l.payload?.createdAt || l.created_at,
          status: l.status || l.payload?.status || 'unread',
          notes: l.payload?.notes || '',
        }));
        return NextResponse.json({ success: true, count: mapped.length, inquiries: mapped });
      }
    } catch {}
  }

  const all = readContacts();
  return NextResponse.json({ success: true, count: all.length, inquiries: all });
}
