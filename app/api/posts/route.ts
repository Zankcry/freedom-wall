import { NextRequest, NextResponse } from 'next/server';
import { PostInsert } from '@/types/database';

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

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const approvedOnly = searchParams.get('approved') === 'true';
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    let query = supabase.from('posts').select('*').order('created_at', { ascending: false });

    // Only exclude deleted posts if not explicitly including them (for admin panel)
    if (!includeDeleted) {
      query = query.eq('is_deleted', false);
    }

    if (approvedOnly) {
      query = query.eq('is_approved', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Database error occurred' },
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

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient();
    const body: PostInsert = await request.json();

    if (!body.message || !body.codename) {
      return NextResponse.json(
        { error: 'Message and codename are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([{ ...body, is_approved: false }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create post' },
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

