import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const pathToRevalidate = body.path || '/'; // Revalidate root page by default

    // Trigger the revalidation for the provided path
    revalidatePath(pathToRevalidate);

    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ error: 'Error revalidating' }, { status: 500 });
  }
}