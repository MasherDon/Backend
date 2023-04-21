import { Article } from '../schemas/article.schema';
import { userType } from '../../user/type/user.type';

export interface ArticleInterface {
  article: Article & userType;
}
