import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '0', 10);
    const query = searchParams.get('query') || '';
    const language = searchParams.get('language') || '';
    const perPage = 15; // Number of repositories per page

    const headers: { [key: string]: string } = {
      Accept: 'application/vnd.github.v3+json',
    };

    const githubToken = process.env.GITHUB_TOKEN;

    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }

    const searchQuery = query ? `+${query} in:name` : '';
    const languageQuery = language ? `+language:${language}` : '';
    const githubApiUrl = `https://api.github.com/search/repositories?q=stars:>1${searchQuery}${languageQuery}&sort=stars&order=desc&per_page=${perPage}&page=${
      page + 1
    }`;

    const { data } = await axios.get(githubApiUrl, { headers });

    return NextResponse.json(data.items);
  } catch (error: any) {
    console.error('Failed to fetch data:', error);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to fetch data';
    return NextResponse.json({ error: message }, { status });
  }
}
