import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 60; // Set max duration to 60 seconds (Pro plan limit)

const systemPrompt = `
あなたはプロの英語コーチです。
ユーザーの日本語の日記を分析し、その内容に基づいて、英語学習に役立つフレーズを提案してください。

以下の手順でJSONを出力してください：

1. **シーン分割**: 日記を意味のある「シーン」に分割してください（最大3つ）。
2. **シーン分析**: 各シーンについて、要約(日本語)、元の抜粋(日本語)、感情、関係性、場所を特定してください。
   - emotion: 'joy', 'sadness', 'anger', 'anxiety', 'relief', 'tiredness', 'mixed' のいずれか。
3. **フレーズ提案**: 各シーンの状況や感情に合った、自然な英語フレーズを2〜3個提案してください。
   - 教科書的な表現ではなく、ネイティブが実際に使う自然な表現（スラング含む）を選んでください。
   - tone: 'casual', 'polite', 'serious', 'playful' のいずれか。

出力JSONフォーマット:
{
  "scenes": [
    {
      "sceneId": "scene_1",
      "sceneSummaryJa": "...",
      "originalExcerptJa": "...",
      "emotion": "...",
      "relationship": "...",
      "place": "...",
      "phrases": [
        {
          "id": "p1",
          "textEn": "...",
          "explanationJa": "...",
          "tone": "..."
        }
      ]
    }
  ]
}
`;

export async function POST(req: Request) {
    try {
        const { diary_text, emotions } = await req.json();

        if (!diary_text) {
            return NextResponse.json(
                { error: 'Diary text is required' },
                { status: 400 }
            );
        }

        const userPrompt = `
日本語の日記:
"${diary_text}"

ユーザーが選択した感情タグ:
${emotions?.join(', ') || 'なし'}
`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error('Failed to generate analysis');
        }

        const data = JSON.parse(content);

        // Ensure IDs are unique and consistent
        const processedData = {
            scenes: data.scenes.map((scene: any, index: number) => ({
                ...scene,
                sceneId: `scene_${index + 1}`,
                phrases: scene.phrases.map((phrase: any, pIndex: number) => ({
                    ...phrase,
                    id: `p_${index + 1}_${pIndex + 1}`,
                })),
            })),
        };

        return NextResponse.json(processedData);
    } catch (error) {
        console.error('Error analyzing diary:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
