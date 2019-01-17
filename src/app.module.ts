import { UserSchema } from './model/User';
import { TagSchema } from './model/Tag';
import { CommentSchema } from './model/Comment';
import { PostSchema } from './model/Post';
import { UserService } from './common/service/user.service';
import { Module, Global } from '@nestjs/common';
import { BlogModule } from './blog/blog.module';
import { PostService } from './common/service/post.service';
import { CommentService } from './common/service/comment.service';
import { TagService } from './common/service/tag.service';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from "@nestjs/mongoose";
import * as config from "config";
import { InfoService } from './common/service/info.service';
import { InfoSchema } from './model/Info';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(config.get('mongodb'), {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    }),
    MongooseModule.forFeature([
      { name: 'post', schema: PostSchema },
      { name: 'comment', schema: CommentSchema },
      { name: 'tag', schema: TagSchema },
      { name: 'user', schema: UserSchema },
      { name: 'info', schema: InfoSchema }
    ]),
    BlogModule,
    AdminModule
  ],
  providers: [PostService, CommentService, TagService, UserService, InfoService],
  exports: [PostService, CommentService, TagService, UserService, InfoService]
})
export class AppModule { }
