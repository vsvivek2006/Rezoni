import { NextRequest, NextResponse } from 'next/server';
import { saveUserReview, getAllSavedReviews } from '@/lib/db';

export async function GET() {
  try {
    const reviews = getAllSavedReviews();
    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userName = body.userName || body.author || body.name;
    const reviewText = body.body || body.content || body.reviewText || body.text;
    const userEmail = body.userEmail || body.email || 'customer@example.com';
    const productTitle = body.productTitle || body.title || 'Anti-Yellow Magsafe Clear Case';
    const model = body.model;
    const rating = Number(body.rating || 5);
    const image = body.image || null;

    if (!userName || !reviewText) {
      return NextResponse.json(
        { success: false, message: 'Name and review text are required.' },
        { status: 400 }
      );
    }

    const review = saveUserReview({
      userEmail: userEmail || 'customer@example.com',
      userName,
      productTitle: productTitle || 'Anti-Yellow Magsafe Clear Case',
      model,
      rating: Number(rating || 5),
      body: reviewText,
      image: image || null,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your review has been saved successfully.',
      review,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
