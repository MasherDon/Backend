import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Article, ArticleSchema } from './schemas/article.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
