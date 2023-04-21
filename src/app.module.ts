import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { authMiddleware } from './middlewares/auth.middleware';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MapModule } from './map/map.module';
import { RegionModule } from './region/region.module';
import { ReserveModule } from './reserve/reserve.module';
import { AnimalModule } from './animal/animal.module';
import { ProfileModule } from './profile/profile.module';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot('mongodb://localhost/RedBook'),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // upgrade later with STARTTLS
          auth: {
            user: '',
            pass: '',
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: process.cwd() + '/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    MapModule,
    RegionModule,
    ReserveModule,
    AnimalModule,
    ProfileModule,
    ArticleModule,
    TagModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
