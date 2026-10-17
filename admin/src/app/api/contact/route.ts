import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
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

export async function GET(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const query = searchParams.get('q')?.toLowerCase();

    let all = readContacts();

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

    const unreadCount = readContacts().filter((c) => c.status === 'unread').length;

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

    const all = readContacts();
    const found = all.find((c) => c.id === id);

    if (!found) {
      return NextResponse.json({ success: false, message: 'Inquiry not found' }, { status: 404 });
    }

    if (status) found.status = status;
    if (notes !== undefined) found.notes = notes;

    saveContacts(all);

    return NextResponse.json({
      success: true,
      message: `Inquiry ${id} updated to ${status || 'saved'}.`,
      inquiry: found,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update contact inquiry' },
      { status: 500 }
    );
  }
}
