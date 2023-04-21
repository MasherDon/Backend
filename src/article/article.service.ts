import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { queryInterface } from './interface/query.interface';
import { CreateCommentDto } from './dto/comments.dto';
import { CommentInterface } from './interface/comment.interface';
import { ArticleInterface } from './interface/article.interface';
import slugify from 'slugify';
import { ArticlesInterface } from './interface/articles.interface';
import { userType } from '../user/type/user.type';
import { ComInterface } from './interface/comments.interface';
import { CreateArticleDto } from './dto/createArticle.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private readonly ArticleModule: Model<ArticleDocument>,
    @InjectModel(User.name)
    private readonly UserModule: Model<UserDocument>,
    @InjectModel(Comment.name)
    private readonly CommentModule: Model<CommentDocument>,
  ) {}

  async createArticle(
    currentUser: string,
    createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    const pos = Object.assign(new Article(), createArticleDto);
    pos['author'] = currentUser;
    pos['slug'] = ArticleService.slugAt(pos['title']);
    pos['createAt'] = new Date(Date.now());
    pos['updateAt'] = new Date(Date.now());
    return await new this.ArticleModule(pos).save();
  }

  async getComment(currentUser: string, slug: string): Promise<ComInterface> {
    const article = await this.findArticle(slug);
    const comments = await this.CommentModule.find({
      article: ArticleService.idString(article['_id']),
    });
    const art = [];
    for (let i = 0; i < comments.length; i++) {
      art.push(
        await this.buildComments(
          comments[i],
          ArticleService.idString(currentUser),
        ),
      );
    }
    return {
      comments: art,
    };
  }

  async buildComments(
    comment: Comment,
    currentUser: string,
  ): Promise<ComInterface> {
    const user = await this.findUserById(comment['author']);
    user['password'] = undefined;
    user['email'] = undefined;
    comment['_id'] = undefined;
    comment['article'] = undefined;
    const use = {
      ...user['_doc'],
      fallowing: user['fallowing'].includes(
        ArticleService.idString(currentUser),
      ),
    };
    return {
      ...comment['_doc'],
      author: use,
    };
  }

  async createComments(
    currentUser: string,
    slug: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const pos = Object.assign(new Comment(), createCommentDto);
    const article = await this.findArticle(slug);
    pos['article'] = ArticleService.idString(article['_id']);
    pos['createAt'] = new Date(Date.now());
    pos['author'] = ArticleService.idString(currentUser);
    pos['id'] = await this.CommentModule.find({
      article: pos['article'],
    }).count();
    return await new this.CommentModule(pos).save();
  }

  async buildComment(
    comment: Comment,
    currentUser: string,
  ): Promise<CommentInterface> {
    const user = await this.findUserById(comment['author']);
    user['password'] = undefined;
    user['email'] = undefined;
    comment['_id'] = undefined;
    comment['article'] = undefined;
    const use = {
      ...user['_doc'],
      fallowing: user['fallowing'].includes(
        ArticleService.idString(currentUser),
      ),
    };
    return {
      comment: {
        ...comment['_doc'],
        author: use,
      },
    };
  }

  async deleteComments(
    currentUser: string,
    slug: string,
    id: number,
  ): Promise<HttpException> {
    const error = {
      errors: {},
    };
    error.errors['username'] = 'You are not an author';
    const article = await this.findArticle(slug);
    const comment = await this.CommentModule.findOne({
      article: ArticleService.idString(article['_id']),
      id: id,
    });
    const user = await this.UserModule.findById(
      ArticleService.idString(currentUser),
    );
    if (
      article['author'] !== ArticleService.idString(currentUser) &&
      user['rights'] > 1
    ) {
      throw new HttpException(error, HttpStatus.ACCEPTED);
    }
    await this.CommentModule.findByIdAndDelete(comment['_id']);
    const comments = await this.CommentModule.find({
      article: ArticleService.idString(article['_id']),
    }).sort({ id: 1 });
    for (let i = 0; i < comments.length; i++) {
      await this.CommentModule.updateOne(
        { _id: comments[i]['_id'] },
        { $set: { id: i } },
      );
    }
    return new HttpException('Article comment', HttpStatus.OK);
  }

  async buildArticle(
    article: Article,
    currentUser: string,
  ): Promise<ArticleInterface> {
    const user = await this.findUserById(article['author']);
    user['password'] = undefined;
    user['email'] = undefined;
    const use = {
      ...user['_doc'],
      fallowing: user['fallowing'].includes(
        ArticleService.idString(currentUser),
      ),
    };
    return {
      article: {
        ...article['_doc'],
        favorited: article['favorited'].includes(
          ArticleService.idString(currentUser),
        ),
        author: use,
      },
    };
  }

  async buildArticles(
    article: Article,
    currentUser: string,
  ): Promise<ArticleInterface> {
    const user = await this.findUserById(article['author']);
    user['password'] = undefined;
    user['email'] = undefined;
    const use = {
      ...user['_doc'],
      fallowing: user['fallowing'].includes(
        ArticleService.idString(currentUser),
      ),
    };
    return {
      ...article['_doc'],
      favorited: article['favorited'].includes(
        ArticleService.idString(currentUser),
      ),
      author: use,
    };
  }

  async getFeed(
    currentUser: string,
    query: queryInterface,
  ): Promise<ArticlesInterface> {
    const favor = await this.UserModule.find({
      fallowing: { $all: ArticleService.idString(currentUser) },
    });
    const sta = [];
    for (const x of favor) {
      sta.push(ArticleService.idString(x['_id']));
    }
    const articles = await this.ArticleModule.find({
      author: { $all: sta },
    })
      .skip(query.offset)
      .limit(query.limit)
      .sort({ updateAt: -1 });
    const articlesCount = articles.length;
    const art = [];
    for (let i = 0; i < articles.length; i++) {
      art.push(
        await this.buildArticles(
          articles[i],
          ArticleService.idString(currentUser),
        ),
      );
    }
    return {
      articles: art,
      articlesCount: articlesCount,
    };
  }

  async findAll(
    currentUser: string,
    query: queryInterface,
  ): Promise<ArticlesInterface> {
    let filter = {};
    if (query.tag) {
      filter = { tagList: query.tag };
    } else {
      if (query.author) {
        const up = await this.findUser(query.author);
        if (up) {
          filter = { author: up['_id'] };
        }
      } else {
        if (query.favorited) {
          const up = await this.findUser(query.favorited);
          if (up) {
            filter = {
              favorited: { $all: ArticleService.idString(up['_id']) },
            };
          }
        }
      }
    }
    const articles = await this.ArticleModule.find(filter)
      .skip(query.offset)
      .limit(query.limit)
      .sort({ updateAt: -1 });
    const articlesCount = articles.length;
    const art = [];
    for (let i = 0; i < articles.length; i++) {
      art.push(
        await this.buildArticles(
          articles[i],
          ArticleService.idString(currentUser),
        ),
      );
    }
    return {
      articles: art,
      articlesCount: articlesCount,
    };
  }

  async favorites(slug: string, currentUser: string): Promise<Article> {
    const article = await this.findArticle(slug);
    if (!article['favorited'].includes(ArticleService.idString(currentUser))) {
      return this.ArticleModule.findOneAndUpdate(
        { slug: slug },
        {
          $push: { favorited: ArticleService.idString(currentUser) },
          favoritesCount: Number(article['favoritesCount']) + 1,
        },
      );
    }
    return article;
  }

  async favoritesDelete(slug: string, currentUser: string): Promise<Article> {
    const article = await this.findArticle(slug);
    if (article['favorited'].includes(ArticleService.idString(currentUser))) {
      return this.ArticleModule.findOneAndUpdate(
        { slug: slug },
        {
          $pull: { favorited: ArticleService.idString(currentUser) },
          favoritesCount: Number(article['favoritesCount']) - 1,
        },
      );
    }
    return article;
  }

  async updateArticle(
    currentUser: string,
    slug: string,
    createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    const error = {
      errors: {},
    };
    error.errors['username'] = 'You are not an author';
    const article = await this.findArticle(slug);
    if (article['author'] !== ArticleService.idString(currentUser)) {
      throw new HttpException(error, HttpStatus.ACCEPTED);
    }
    Object.assign(article, createArticleDto);
    article['updateAt'] = new Date(Date.now());
    article['slug'] = ArticleService.slugAt(article['title']);
    await this.ArticleModule.findByIdAndUpdate(article['_id'], article);
    return article;
  }

  async deleteArticle(
    slug: string,
    currentUser: string,
  ): Promise<HttpException> {
    const error = {
      errors: {},
    };
    error.errors['username'] = 'You are not an author';
    const article = await this.findArticle(slug);
    const user = await this.UserModule.findById(
      ArticleService.idString(currentUser),
    );
    if (
      article['author'] !== ArticleService.idString(currentUser) &&
      user['rights'] > 1
    ) {
      throw new HttpException(error, HttpStatus.ACCEPTED);
    }
    await this.ArticleModule.findByIdAndDelete(article['_id']);
    await this.CommentModule.deleteMany({ article: article['_id'] });
    return new HttpException('Article delete', HttpStatus.OK);
  }

  async findUserById(_id: string): Promise<userType> {
    const out = await this.UserModule.findById(_id);
    const error = {
      errors: {},
    };
    error.errors['_id'] = 'User does not exist';
    if (!out) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
    return out;
  }

  async findUser(username: string): Promise<userType> {
    const out = await this.UserModule.findOne({ username: username });
    const error = {
      errors: {},
    };
    error.errors['username'] = 'User does not exist';
    if (!out) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
    return out;
  }
  async findArticle(slug: string): Promise<Article> {
    const out = await this.ArticleModule.findOne({ slug: slug });
    const error = {
      errors: {},
    };
    error.errors['slug'] = 'User does not exist';
    if (!out) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
    return out;
  }

  private static idString(currentUser: string): string {
    return String(currentUser).split('"')[0];
  }

  private static slugAt(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
