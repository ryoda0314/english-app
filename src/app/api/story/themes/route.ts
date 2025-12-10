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

        const { expression, supplement } = await request.json();

        if (!expression) {
            return NextResponse.json(
                { error: '表現を入力してください' },
                { status: 400 }
            );
        }

        const systemPrompt = `あなたは英語学習アプリの専門家です。ユーザーが学びたい英語表現に基づいて、その表現が自然に使われる4つの異なるシーンテーマを生成してください。

以下の形式でJSONオブジェクトとして出力してください：
{
  "themes": [
    {
      "id": "1",
      "title": "シーンのタイトル（日本語）",
      "oneLineJa": "シーンの簡単な説明（日本語）",
      "genre": "friendship",
      "emotion": "anxiety",
      "relationship": "friend"
    }
  ]
}

genre, emotion, relationshipには適切な値を選んでください。
シーンはバラエティ豊かに、異なるジャンルや感情を含めてください。`;

        const userPrompt = `学びたい表現: "${expression}"
${supplement ? `補足情報: "${supplement}"` : ''}

この表現が自然に使われる4つのシーンテーマを生成してください。`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.8,
            response_format: { type: 'json_object' },
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error('No response from OpenAI');
        }

        const parsed = JSON.parse(content);
        const themes = Array.isArray(parsed.themes) ? parsed.themes : (Array.isArray(parsed) ? parsed : []);

        return NextResponse.json({ themes });
    } catch (error) {
        console.error('Theme generation error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: `テーマの生成に失敗しました: ${message}` },
            { status: 500 }
        );
    }
}
