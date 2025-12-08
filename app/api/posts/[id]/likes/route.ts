import { NextRequest, NextResponse } from 'next/server';

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

// GET - Get like count and check if user has liked
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await getSupabaseClient();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userIdentifier = searchParams.get('userIdentifier');

    // Get total like count
    const { count, error: countError } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', id);

    if (countError) {
      throw countError;
    }

    // Check if user has liked
    let hasLiked = false;
    if (userIdentifier) {
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_identifier', userIdentifier)
        .single();

      hasLiked = !!data;
    }

    return NextResponse.json({
      count: count || 0,
      hasLiked,
    });
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

// POST - Toggle like (like or unlike)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await getSupabaseClient();
    const { id } = await params;
    const body = await request.json();
    const { userIdentifier } = body;

    if (!userIdentifier) {
      return NextResponse.json({ error: 'User identifier is required' }, { status: 400 });
    }

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_identifier', userIdentifier)
      .single();

    if (existingLike) {
      // Unlike - delete the like
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', id)
        .eq('user_identifier', userIdentifier);

      if (error) throw error;

      return NextResponse.json({ liked: false });
    } else {
      // Like - insert the like
      const { error } = await supabase.from('likes').insert({
        post_id: parseInt(id),
        user_identifier: userIdentifier,
      });

      if (error) throw error;

      return NextResponse.json({ liked: true });
    }
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

