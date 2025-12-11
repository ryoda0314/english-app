import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Urban Dictionary API response type
interface UrbanDictionaryEntry {
    word: string;
    definition: string;
    example: string;
    thumbs_up: number;
    thumbs_down: number;
    written_on: string;
}

interface UrbanDictionaryResponse {
    list: UrbanDictionaryEntry[];
}

// Curated list of popular, widely-used slangs
const CURATED_SLANGS = [
    'lowkey', 'highkey', 'no cap', 'cap', 'slay', 'rizz', 'sus', 'bet', 'vibe',
    'simp', 'stan', 'goat', 'flex', 'salty', 'lit', 'fire', 'fam', 'bae',
    'ghosting', 'clout', 'tea', 'spill the tea', 'snatched', 'basic', 'extra',
    'mood', 'big mood', 'periodt', 'wig', 'shook', 'woke', 'cancel', 'receipts',
    'glow up', 'finesse', 'deadass', 'bruh', 'yeet', 'bussin', 'slaps',
    'hits different', 'rent free', 'main character', 'understood the assignment',
    'living rent free', 'its giving', 'ate', 'serve', 'snatched', 'gagged',
    'catch these hands', 'clap back', 'read', 'shade', 'pressed', 'triggered',
    'on god', 'fr', 'ngl', 'iykyk', 'ijbol', 'delulu', 'ate and left no crumbs',
    'say less', 'vibin', 'cheugy', 'mid', 'W', 'L', 'based', 'cringe',
    'ratio', 'oomf', 'mutuals', 'pick me', 'red flag', 'green flag', 'beige flag',
    'ick', 'roman empire', 'girl dinner', 'girl math', 'demure', 'brat summer'
];

// Track used slangs to avoid repetition
let usedCuratedSlangs: Set<string> = new Set();

function getRandomCuratedSlang(): string {
    // Reset if all used
    if (usedCuratedSlangs.size >= CURATED_SLANGS.length) {
        usedCuratedSlangs = new Set();
    }

    const available = CURATED_SLANGS.filter(s => !usedCuratedSlangs.has(s));
    const randomSlang = available[Math.floor(Math.random() * available.length)];
    usedCuratedSlangs.add(randomSlang);
    return randomSlang;
}

export async function GET(request: Request) {
    try {
        // Check for OpenAI API key
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI APIキーが設定されていません' },
                { status: 500 }
            );
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const { searchParams } = new URL(request.url);
        const term = searchParams.get('term');
        const source = searchParams.get('source') || 'curated'; // Default to curated

        let urbanUrl: string;
        let searchTerm: string | null = term;

        if (source === 'curated' && (!term || term === 'random')) {
            // Use curated list
            searchTerm = getRandomCuratedSlang();
            urbanUrl = `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(searchTerm)}`;
        } else if (term && term !== 'random') {
            // Search specific term
            urbanUrl = `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`;
        } else {
            // Pure random from Urban Dictionary
            urbanUrl = 'https://api.urbandictionary.com/v0/random';
        }

        const urbanResponse = await fetch(urbanUrl);
        if (!urbanResponse.ok) {
            throw new Error('Urban Dictionary APIからの取得に失敗しました');
        }

        const urbanData: UrbanDictionaryResponse = await urbanResponse.json();

        if (!urbanData.list || urbanData.list.length === 0) {
            return NextResponse.json(
                { error: 'スラングが見つかりませんでした' },
                { status: 404 }
            );
        }

        // Get the most popular entry (by thumbs_up)
        const sortedEntries = urbanData.list.sort((a, b) => b.thumbs_up - a.thumbs_up);
        const entry = sortedEntries[0];

        // Clean up definition and example (remove brackets from Urban Dictionary format)
        const cleanDefinition = entry.definition.replace(/\[|\]/g, '');
        const cleanExample = entry.example.replace(/\[|\]/g, '');

        // Enrich with OpenAI
        const systemPrompt = `あなたは英語スラングの専門家です。Urban Dictionaryから取得したスラングを分析し、日本語学習者向けに解説を作成してください。

以下のJSON形式で出力してください：
{
  "phrase": "スラング（そのまま）",
  "reading_hint_ja": "カタカナ読み（例: スレイ）",
  "meaning_ja": "日本語での意味（簡潔に）",
  "nuance_ja": "ニュアンス解説（どういう場面で使うか、どういう感情を含むか）",
  "example_en": "例文（英語）",
  "example_ja": "例文の日本語訳",
  "tone": "casual / playful / serious / polite のいずれか",
  "risk_level": "safe（普通に使える）/ careful（場面を選ぶ）/ avoid（使わない方が良い） のいずれか",
  "region": "global / US / UK / internet など",
  "tags": ["タグ1", "タグ2"]
}

リスクレベルの判定基準:
- safe: 誰とでも使える、不快にならない
- careful: 親しい友人/カジュアルな場面限定、誤解を招く可能性あり
- avoid: 侮辱的、差別的、下品、または使うと問題になる可能性が高い`;

        const userPrompt = `スラング: "${entry.word}"
Urban Dictionary定義: "${cleanDefinition}"
例文: "${cleanExample}"
人気度: 👍 ${entry.thumbs_up} / 👎 ${entry.thumbs_down}

このスラングを分析してください。`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 1000,
            response_format: { type: 'json_object' },
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error('OpenAIからの応答がありません');
        }

        const enrichedSlang = JSON.parse(content);

        // Add metadata
        enrichedSlang.popularity_score = entry.thumbs_up;
        enrichedSlang.source = source === 'curated' ? 'curated' : 'urban_dictionary';
        enrichedSlang.fetched_at = new Date().toISOString();

        return NextResponse.json({ slang: enrichedSlang });
    } catch (error) {
        console.error('Slang fetch error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: `スラングの取得に失敗しました: ${message}` },
            { status: 500 }
        );
    }
}

