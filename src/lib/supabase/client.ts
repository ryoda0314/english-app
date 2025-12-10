import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * ブラウザ（クライアントサイド）用のSupabaseクライアント
 * Reactコンポーネント内で使用
 */
export function createBrowserClient() {
    return createSupabaseBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
