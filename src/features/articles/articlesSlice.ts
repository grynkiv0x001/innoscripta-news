import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';

interface Article {
  source: string;
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

interface ArticlesSliceState {
  articles: Article[];
  status: 'idle' | 'loading' | 'failed' | 'success';
  error: string | null;
}

// Initial state
const initialState: ArticlesSliceState = {
  articles: [],
  status: 'idle',
  error: null,
};

// TODO: Move to .env
const NEWS_API_KEY = '910d3cbd919044b8816401685ebeac2d';

const nyt = 'bAvjbzlMS2eLKJZbbcCQAOGFTHGIVAeM';
const nyt_secret = 'vyRn6hS5alEaZGaB';

const thenewsapi = 'td9j6F3engxa0xy3wm7NgzZkDjBe3VbZzgwN91Ht';

const guardianapi = '';

const endpoints = [
  `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`,
  // `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${nyt}`,
  // `https://api.thenewsapi.com/v1/news/headlines?api_token=${thenewsapi}`
  // `https://content.guardianapis.com/search?api-key=${guardianapi}`
];

export const fetchArticles = createAsyncThunk<Article[]>(
  'articles/fetchArticles',
  async () => {
    const responses: AxiosResponse[] = await Promise.all(
      endpoints.map((url) => axios.get(url)),
    );

    return responses.flatMap((response) => {
      const data = response.data;
      const articles = data.articles || data.response.docs;

      return articles.map((article: any) => ({
        ...article,
        source: article.source?.name || article.source,
        title: article.title || article.abstract,
      }));
    });
  },
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    filterArticles: (state, action: PayloadAction<string>) => {
      state.articles = state.articles.filter((article) =>
        article.title.toLowerCase().includes(action.payload.toLowerCase()),
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchArticles.fulfilled,
        (state, action: PayloadAction<Article[]>) => {
          state.status = 'success';
          state.articles = action.payload;
        },
      )
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch articles';
      });
  },
});

export const { filterArticles } = articlesSlice.actions;
export default articlesSlice.reducer;
