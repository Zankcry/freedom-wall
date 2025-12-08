import { NextRequest, NextResponse } from 'next/server';
import { PostInsert } from '@/types/database';

async function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your Vercel environment variables and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(supabaseUrl, supabaseAnonKey);
    return client;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw new Error(
      'Failed to initialize Supabase client. Please check your environment variables.'
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
    // Parse request body first
    let body: PostInsert;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();

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

