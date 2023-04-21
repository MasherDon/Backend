import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { AuthGuard } from '../guards/auth.guard';
import { BackPipe } from '../pipes/back.pipe';
import { CreateCommentDto } from './dto/comments.dto';
import { UserDecorator } from '../decoretors/userDecorator';
import { queryInterface } from './interface/query.interface';
import { ArticleInterface } from './interface/article.interface';
import { ArticlesInterface } from './interface/articles.interface';
import { CommentInterface } from './interface/comment.interface';
import { ComInterface } from './interface/comments.interface';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(
    @UserDecorator('_id') currentUser: string,
    @Query() query: queryInterface,
  ): Promise<ArticlesInterface> {
    return await this.articleService.findAll(currentUser, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @UserDecorator('_id') currentUser: string,
    @Query() query: queryInterface,
  ): Promise<ArticlesInterface> {
    return await this.articleService.getFeed(currentUser, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackPipe())
  async create(
    @UserDecorator('_id') currentUser: string,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articleService.buildArticle(article, currentUser);
  }

  @Post(':slug/comments')
  @UseGuards(AuthGuard)
  @UsePipes(new BackPipe())
  async comment(
    @UserDecorator('_id') currentUser: string,
    @Param('slug') slug: string,
    @Body('comment') createCommentDto: CreateCommentDto,
  ): Promise<CommentInterface> {
    const comment = await this.articleService.createComments(
      currentUser,
      slug,
      createCommentDto,
    );
    return this.articleService.buildComment(comment, currentUser);
  }

  @Delete(':slug/comments/:id')
  @UseGuards(AuthGuard)
  async commentDelete(
    @UserDecorator('_id') currentUser: string,
    @Param('slug') slug: string,
    @Param('id') id: number,
  ): Promise<HttpException> {
    return await this.articleService.deleteComments(currentUser, slug, id);
  }

  @Get(':slug/comments')
  async getComment(
    @UserDecorator('_id') currentUser: string,
    @Param('slug') slug: string,
  ): Promise<ComInterface> {
    return this.articleService.getComment(currentUser, slug);
  }

  @Get(':slug')
  async getArticle(
    @Param('slug') slug: string,
    @UserDecorator('_id') currentUser: string,
  ): Promise<ArticleInterface> {
    const article = await this.articleService.findArticle(slug);
    return await this.articleService.buildArticle(article, currentUser);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @Param('slug') slug: string,
    @UserDecorator('_id') currentUser: string,
  ): Promise<HttpException> {
    return await this.articleService.deleteArticle(slug, currentUser);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async favorites(
    @Param('slug') slug: string,
    @UserDecorator('_id') currentUser: string,
  ): Promise<ArticleInterface> {
    const article = await this.articleService.favorites(slug, currentUser);
    return await this.articleService.buildArticle(article, currentUser);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async favoritesDelete(
    @Param('slug') slug: string,
    @UserDecorator('_id') currentUser: string,
  ): Promise<ArticleInterface> {
    const article = await this.articleService.favoritesDelete(
      slug,
      currentUser,
    );
    return await this.articleService.buildArticle(article, currentUser);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new BackPipe())
  async updateArticle(
    @UserDecorator('_id') currentUser: string,
    @Param('slug') slug: string,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleInterface> {
    const article = await this.articleService.updateArticle(
      currentUser,
      slug,
      createArticleDto,
    );
    return this.articleService.buildArticle(article, currentUser);
  }
}
