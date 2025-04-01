'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { parseVideo, extractText, rewriteText } from '@/lib/coze';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  const [text, setText] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');

  const handleVideoDownload = async () => {
    if (!url) {
      toast.error('请输入视频链接');
      return;
    }

    setLoading(true);
    try {
      const data = await parseVideo(url);
      setVideoData(data);
      toast.success('视频解析成功');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTextExtract = async () => {
    if (!url) {
      toast.error('请输入视频链接');
      return;
    }

    setLoading(true);
    try {
      const extractedText = await extractText(url);
      setText(extractedText);
      toast.success('文案提取成功');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRewrite = async () => {
    if (!text) {
      toast.error('请先提取文案');
      return;
    }

    setLoading(true);
    try {
      const newText = await rewriteText(text);
      setRewrittenText(newText);
      toast.success('文案仿写成功');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">视频解析与文案助手</h1>
        
        <div className="max-w-2xl mx-auto space-y-8">
          {/* 输入框 */}
          <div className="space-y-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="请输入视频链接（抖音/快手/小红书）"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleVideoDownload}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? '处理中...' : '下载视频'}
              </button>
              <button
                onClick={handleTextExtract}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? '处理中...' : '提取文案'}
              </button>
            </div>
          </div>

          {/* 视频预览 */}
          {videoData && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">视频预览</h2>
              {videoData.video && (
                <video
                  src={videoData.video}
                  controls
                  className="w-full rounded-lg"
                  poster={videoData.cover}
                />
              )}
              <button
                onClick={() => window.open(videoData.video, '_blank')}
                className="w-full px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                下载视频
              </button>
            </div>
          )}

          {/* 文案展示 */}
          {text && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">原始文案</h2>
              <div className="p-4 rounded-lg bg-gray-800">
                <p className="whitespace-pre-wrap">{text}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigator.clipboard.writeText(text)}
                  className="flex-1 px-6 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-colors"
                >
                  复制
                </button>
                <button
                  onClick={handleRewrite}
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 transition-colors disabled:opacity-50"
                >
                  {loading ? '生成中...' : '一键仿写'}
                </button>
              </div>
            </div>
          )}

          {/* 仿写文案 */}
          {rewrittenText && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">仿写文案</h2>
              <div className="p-4 rounded-lg bg-gray-800">
                <p className="whitespace-pre-wrap">{rewrittenText}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigator.clipboard.writeText(rewrittenText)}
                  className="flex-1 px-6 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-colors"
                >
                  复制
                </button>
                <button
                  onClick={handleRewrite}
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 transition-colors disabled:opacity-50"
                >
                  {loading ? '生成中...' : '重新仿写'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 