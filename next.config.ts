import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { webpack }) => {
    // SupabaseのEdge Runtime警告（Node.js API使用）を回避するためのエイリアス設定
    config.resolve.alias = {
      ...config.resolve.alias,
      '@supabase/supabase-js': '@supabase/supabase-js/dist/module/index.js',
    }

    // Edge Runtimeでのprocess.version使用警告を抑制（空文字に置換）
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.version': JSON.stringify(''),
        'process.versions': JSON.stringify({}),
      })
    )

    return config
  },
};

export default nextConfig;
