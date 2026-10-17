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

    // 1. Save to persistent files
    const all = readContacts();
    all.unshift(newInquiry);
    saveContacts(all);

    // 2. Attempt sync to Supabase if table exists
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
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
      }
    } catch (e) {
      // Non-fatal if Supabase table is not configured
    }

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
  const all = readContacts();
  return NextResponse.json({ success: true, count: all.length, inquiries: all });
}
