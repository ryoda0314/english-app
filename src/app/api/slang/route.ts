import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: Request) {
    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { searchParams } = new URL(request.url);
        const mode = searchParams.get('mode') || 'random';
        const id = searchParams.get('id');

        let query: any = supabase.from('slang_entries').select('*');

        if (id) {
            // Get specific slang by ID
            query = query.eq('id', id).single();
        } else if (mode === 'trending') {
            // Get trending slang (sorted by popularity)
            query = query.order('popularity_score', { ascending: false }).limit(10);
        } else if (mode === 'recent') {
            // Get recently added slang
            query = query.order('created_at', { ascending: false }).limit(10);
        } else {
            // Random mode - get a random entry
            // First, get count
            const { count } = await supabase
                .from('slang_entries')
                .select('*', { count: 'exact', head: true });

            if (!count || count === 0) {
                return NextResponse.json(
                    { error: 'データベースにスラングがありません。fetchエンドポイントで取得してください。', needsFetch: true },
                    { status: 404 }
                );
            }

            // Get random entry
            const randomOffset = Math.floor(Math.random() * count);
            query = query.range(randomOffset, randomOffset).single();
        }

        const { data, error } = await query;

        if (error) {
            // If no data found, suggest fetching
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'スラングが見つかりません', needsFetch: true },
                    { status: 404 }
                );
            }
            throw error;
        }

        return NextResponse.json({ slang: data });
    } catch (error) {
        console.error('Slang GET error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: `スラングの取得に失敗しました: ${message}` },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const slangData = await request.json();

        // Upsert slang entry (update if phrase exists, insert if new)
        const { data, error } = await supabase
            .from('slang_entries')
            .upsert(
                {
                    phrase: slangData.phrase,
                    reading_hint_ja: slangData.reading_hint_ja,
                    meaning_ja: slangData.meaning_ja,
                    nuance_ja: slangData.nuance_ja,
                    example_en: slangData.example_en,
                    example_ja: slangData.example_ja,
                    tone: slangData.tone,
                    risk_level: slangData.risk_level,
                    region: slangData.region || 'global',
                    tags: slangData.tags || [],
                    popularity_score: slangData.popularity_score || 0,
                    last_seen_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: 'phrase',
                    ignoreDuplicates: false,
                }
            )
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ slang: data, saved: true });
    } catch (error) {
        console.error('Slang POST error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: `スラングの保存に失敗しました: ${message}` },
            { status: 500 }
        );
    }
}
