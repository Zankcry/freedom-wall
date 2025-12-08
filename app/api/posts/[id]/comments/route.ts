import { NextRequest, NextResponse } from 'next/server';
import { CommentInsert } from '@/types/database';

async function getSupabaseClient() {
  try {
    const { supabase } = await import('@/lib/supabase');
    return supabase;
  } catch (error) {
    throw new Error(
      'Supabase is not configured. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
  }
}

// GET - Get comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await getSupabaseClient();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('includeAll') === 'true'; // For admin

    let query = supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    if (!includeAll) {
      query = query.eq('is_approved', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch comments' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error. Please check your Supabase configuration.',
      },
      { status: 500 }
    );
  }
}

// POST - Add a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await getSupabaseClient();
    const { id } = await params;
    const body: CommentInsert = await request.json();

    if (!body.message || !body.codename) {
      return NextResponse.json(
        { error: 'Message and codename are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          post_id: parseInt(id),
          codename: body.codename,
          message: body.message,
          is_approved: true, // Auto-approve comments
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create comment' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error. Please check your Supabase configuration.',
      },
      { status: 500 }
    );
  }
}

