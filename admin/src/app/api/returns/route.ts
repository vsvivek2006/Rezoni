import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabaseServer';
import { getAdminSessionFromRequest } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const supabase = getSupabaseAdminClient();
    let returns: any[] = [];

    if (supabase) {
      let q = supabase.from('returns').select('*').order('created_at', { ascending: false });
      if (status && status !== 'all') {
        q = q.eq('status', status);
      }
      const { data, error } = await q;
      if (!error && data) {
        returns = data.map((r) => ({
          id: r.id,
          orderId: r.order_id,
          customerName: r.customer_name,
          customerEmail: r.customer_email,
          customerPhone: r.customer_phone,
          reason: r.reason,
          items: r.items || r.item_title || 'Rezoni Item',
          amount: r.amount,
          status: r.status,
          statusLabel: r.status_label,
          notes: r.notes,
          date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent',
        }));
      }
    }

    // Fallback to local db if 0
    if (returns.length === 0) {
      try {
        const localPath = fs.existsSync(path.resolve(process.cwd(), 'src', 'data', 'db.json'))
          ? path.resolve(process.cwd(), 'src', 'data', 'db.json')
          : path.resolve(process.cwd(), '..', 'src', 'data', 'db.json');
        if (fs.existsSync(localPath)) {
          const raw = JSON.parse(fs.readFileSync(localPath, 'utf8'));
          returns = raw.returns || [];
          if (status && status !== 'all') {
            returns = returns.filter((r: any) => r.status === status);
          }
        }
      } catch (e) {}
    }

    return NextResponse.json({ success: true, count: returns.length, returns });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch returns' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const body = await req.json();
    const { returnId, status, notes } = body;

    if (!returnId || !status) {
      return NextResponse.json({ success: false, message: 'Return ID and status are required.' }, { status: 400 });
    }

    const labels: Record<string, string> = {
      requested: 'Return Requested - Pending Review',
      approved: 'Return Approved - Pickup Scheduled',
      in_inspection: 'Package Received - Under QC Inspection',
      refunded: 'Refund Processed to Original Payment Method',
      rejected: 'Return Request Declined',
    };

    const statusLabel = labels[status] || status;

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const updateData: any = { status, status_label: statusLabel };
      if (notes) updateData.notes = notes;
      await supabase.from('returns').update(updateData).eq('id', returnId);
    }

    // Also update local db if present
    try {
      const localPath = fs.existsSync(path.resolve(process.cwd(), 'src', 'data', 'db.json'))
        ? path.resolve(process.cwd(), 'src', 'data', 'db.json')
        : path.resolve(process.cwd(), '..', 'src', 'data', 'db.json');
      if (fs.existsSync(localPath)) {
        const raw = JSON.parse(fs.readFileSync(localPath, 'utf8'));
        const ret = (raw.returns || []).find((r: any) => r.id === returnId);
        if (ret) {
          ret.status = status;
          ret.statusLabel = statusLabel;
          if (notes) ret.notes = notes;
          fs.writeFileSync(localPath, JSON.stringify(raw, null, 2), 'utf8');
        }
      }
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `Return claim ${returnId} updated to ${status}.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update return status' },
      { status: 500 }
    );
  }
}
