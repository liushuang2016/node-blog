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

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(config.get('mongodb'), {
      useNewUrlParser: true,
      useCreateIndex: true
    }),
    MongooseModule.forFeature([
      { name: 'post', schema: PostSchema },
      { name: 'comment', schema: CommentSchema },
      { name: 'tag', schema: TagSchema },
      { name: 'user', schema: UserSchema }
    ]),
    BlogModule,
    AdminModule
  ],
  controllers: [],
  providers: [PostService, CommentService, TagService, UserService],
  exports: [PostService, CommentService, TagService, UserService]
})
export class AppModule { }
