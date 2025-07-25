import ResultClient from './ResultClient';
import { Metadata } from 'next';
import { kv } from '@vercel/kv';

export async function generateMetadata(props: any) {
  const { params } = await props;
  const id = (await params).id;
  const captureServer = process.env.CAPTURE_SERVER_URL || 'http://localhost:4000';
  const ogImageUrl = `${captureServer}/images/${id}.png`;
  return {
    title: '결과 페이지',
    openGraph: {
      images: [ogImageUrl],
    },
    metadataBase: new URL('http://localhost:3000'),
  };
}

export default async function ResultPage(props: any) {
  const { params } = await props;
  const id = (await params).id;
  // KV에서 결과 데이터 패칭
  let data = null;
  try {
    data = await kv.get(`result:${id}`);
  } catch (e) {
    // 에러 무시, data는 null
  }
  if (!data) {
    return <div className="text-red-500 text-center mt-10">결과를 찾을 수 없습니다.</div>;
  }
  const { subject, sender, receiver, translatedText } = data;
  return <ResultClient id={id} subject={subject} sender={sender} receiver={receiver} translatedText={translatedText} />;
} 