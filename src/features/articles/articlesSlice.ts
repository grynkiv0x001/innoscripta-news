import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';

import { IArticle } from '@/types';

interface ArticlesSliceState {
  articles: IArticle[];
  source?: 'nyt' | 'guardian';
  status: 'idle' | 'loading' | 'failed' | 'success';
  error: string | null;
}

const initialState: ArticlesSliceState = {
  articles: [],
  status: 'idle',
  error: null,
};

const NEWS_ORG_KEY = import.meta.env.VITE_NEWS_ORG_KEY;
const THE_NEWS_KEY = import.meta.env.VITE_THE_NEWS_KEY;
const NYT_KEY = import.meta.env.VITE_NYT_KEY;
const GUARDIAN_KEY = import.meta.env.VITE_GUARDIAN_KEY;

const endpoints = [
  // `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_ORG_KEY}`,
  `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${NYT_KEY}`,
  // `https://api.thenewsapi.com/v1/news/headlines?api_token=${thenewsapi}`
  // `https://content.guardianapis.com/search?api-key=${guardianapi}`
];

export const fetchArticles = createAsyncThunk<IArticle[]>(
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
        urlToImg:
          article.urlToImg ||
          'https://nytimes.com/' +
            article.multimedia.find((el) => el.subType === 'thumbnail')?.url,
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
        (state, action: PayloadAction<IArticle[]>) => {
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
