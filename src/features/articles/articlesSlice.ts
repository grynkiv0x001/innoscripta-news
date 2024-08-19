// src/features/articles/articlesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';

// Define the structure of an article
interface Article {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

// Define the state for the slice
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

// Replace with your NewsAPI key
const NEWS_API_KEY = 'your_newsapi_key';

const endpoints = [
  `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`,
  // Add other endpoints here, e.g., from different sources
];

// Define the async thunk to fetch articles
export const fetchArticles = createAsyncThunk<Article[]>(
  'articles/fetchArticles',
  async () => {
    const responses: AxiosResponse[] = await Promise.all(
      endpoints.map((url) => axios.get(url)),
    );
    return responses.flatMap((response) => response.data.articles);
  },
);

// Define the articles slice
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

// Export the actions and reducer
export const { filterArticles } = articlesSlice.actions;
export default articlesSlice.reducer;
