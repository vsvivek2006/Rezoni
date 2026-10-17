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

    const supabase = getSupabaseAdminClient();
    let reviews: any[] = [];

    if (supabase) {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        reviews = data.map((r) => ({
          id: r.id,
          userName: r.user_name || r.customer_name || 'Customer',
          userEmail: r.user_email || r.customer_email || 'customer@rezoni.com',
          productTitle: r.product_title || 'Anti-Yellow Magsafe Clear Case',
          rating: r.rating,
          body: r.body,
          date: r.date || (r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent'),
        }));
      }
    }

    if (reviews.length === 0) {
      try {
        const localPath = fs.existsSync(path.resolve(process.cwd(), 'src', 'data', 'db.json'))
          ? path.resolve(process.cwd(), 'src', 'data', 'db.json')
          : path.resolve(process.cwd(), '..', 'src', 'data', 'db.json');
        if (fs.existsSync(localPath)) {
          const raw = JSON.parse(fs.readFileSync(localPath, 'utf8'));
          reviews = raw.reviews || [];
        }
      } catch (e) {}
    }

    return NextResponse.json({ success: true, count: reviews.length, reviews });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get('id');

    if (!reviewId) {
      return NextResponse.json({ success: false, message: 'Review ID is required.' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      await supabase.from('reviews').delete().eq('id', reviewId);
    }

    try {
      const localPath = fs.existsSync(path.resolve(process.cwd(), 'src', 'data', 'db.json'))
        ? path.resolve(process.cwd(), 'src', 'data', 'db.json')
        : path.resolve(process.cwd(), '..', 'src', 'data', 'db.json');
      if (fs.existsSync(localPath)) {
        const raw = JSON.parse(fs.readFileSync(localPath, 'utf8'));
        raw.reviews = (raw.reviews || []).filter((r: any) => r.id !== reviewId);
        fs.writeFileSync(localPath, JSON.stringify(raw, null, 2), 'utf8');
      }
    } catch (e) {}

    return NextResponse.json({ success: true, message: `Review ${reviewId} deleted.` });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete review' },
      { status: 500 }
    );
  }
}
