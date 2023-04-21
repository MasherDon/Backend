import { Article } from '../schemas/article.schema';

export interface ArticlesInterface {
  articles: Article[];
  articlesCount: number;
}
