import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
    try {
        // APIキーのチェック
        if (!process.env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY environment variable is not set');
            return NextResponse.json(
                { error: 'OpenAI APIキーが設定されていません。.env.localを確認してください。' },
                { status: 500 }
            );
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const { expression, theme, supplement } = await request.json();

        if (!expression || !theme) {
            return NextResponse.json(
                { error: '表現とテーマを指定してください' },
                { status: 400 }
            );
        }

        const systemPrompt = `あなたはプロの小説家であり、英語教育の専門家です。ユーザーが学びたい英語表現を自然に使いつつ、心に響く短編シーンを生成してください。

以下の形式でJSONオブジェクトとして出力してください：
{
  "storyTextMixed": "【重要】日本語の地の文と英語のセリフを混ぜた形式。セリフは『必ず』英語で、それ以外は最高品質の日本語小説の文体で書く。学びたい表現が含まれるセリフは **セリフ** の形式で強調する。\\n例: 夕暮れのカフェ。窓を打つ雨音が、二人の沈黙を埋めていた。\\n彼女は冷めたコーヒーを見つめ、迷うように視線を彷徨わせる。\\n\\"**I'm just... confused.**\\"\\nその声は震えていた。",
  "storyTextEn": "全文英語の短編ストーリー（250-350語程度）。ペーパーバック小説のような自然で洗練された英語。学びたい表現は **表現** の形式で強調。",
  "lineExcerpt": "学びたい表現が使われているセリフ（英語）",
  "sceneSummaryJa": "シーンの日本語要約（1文）",
  "nuanceNoteJa": "この表現のニュアンス解説（日本語）。直訳ではなく、その状況でなぜその言葉が選ばれたのか、感情的な文脈やネイティブの感覚を解説。",
  "tags": {
    "genre": "ジャンル",
    "emotion": "主な感情",
    "relationship": "人間関係",
    "tone": "casual|polite|playful|serious のいずれか"
  }
}

【最重要：会話と文体のルール】
1. **「教科書的な会話」を徹底的に排除してください**。実際の人間が話すような、ためらい、言い淀み、感情の揺れを含むリアルな会話にしてください。
2. **「説明ゼリフ」禁止**。状況や感情をセリフで説明せず、行動や情景描写（日本語地の文）で表現してください。
3. 日本語の地の文は、**直木賞作家レベルの文学的表現**を目指してください。情景描写を通じて感情を伝えてください。
4. セリフは英語のみですが、そのキャラクターの性格や関係性が伝わる「生きた言葉」を選んでください。

【構成ルール】
1. 感情的に響くドラマチックなシーン
2. 登場人物に名前をつける
3. 学びたい表現を、会話の流れの中で最も効果的かつ自然なタイミングで使う`;

        const userPrompt = `学びたい表現: "${expression}"
シーンテーマ: "${theme.title}" - ${theme.oneLineJa}
ジャンル: ${theme.genre}
感情: ${theme.emotion}
人間関係: ${theme.relationship}
${supplement ? `補足情報: "${supplement}"` : ''}

このテーマで、読者の心を揺さぶるような短編ストーリーを生成してください。
storyTextMixed（極上の日本語地の文+自然な英語セリフ）とstoryTextEn（洗練された全英語）の両方を出力してください。`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.9,
            max_tokens: 2500,
            response_format: { type: 'json_object' },
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error('No response from OpenAI');
        }

        const story = JSON.parse(content);

        return NextResponse.json({ story });
    } catch (error) {
        console.error('Story generation error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: `ストーリーの生成に失敗しました: ${message}` },
            { status: 500 }
        );
    }
}
