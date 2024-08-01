import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '0';
  const query = searchParams.get('query') || '';
  const language = searchParams.get('language') || '';
  const perPage = 15; // Number of repositories per page

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  const githubToken = process.env.GITHUB_TOKEN;

  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  }

  try {
    const searchQuery = query ? `+${query} in:name` : '';
    const languageQuery = language ? `+language:${language}` : '';
    const { data } = await axios.get(
      `https://api.github.com/search/repositories?q=stars:>1${searchQuery}${languageQuery}&sort=stars&order=desc&per_page=${perPage}&page=${
        parseInt(page) + 1
      }`,
      { headers }
    );

    return NextResponse.json(data.items);
  } catch (error: any) {
    console.error('Failed to fetch data:', error);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to fetch data';
    return NextResponse.json({ error: message }, { status });
  }
}
