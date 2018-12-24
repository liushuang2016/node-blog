import { UserService } from 'src/common/service/user.service';
import { Module, Global } from '@nestjs/common';
import { BlogModule } from 'src/blog/blog.module';
import { PostService } from 'src/common/service/post.service';
import { CommentService } from 'src/common/service/comment.service';
import { TagService } from 'src/common/service/tag.service';
import { AdminModule } from 'src/admin/admin.module';

@Global()
@Module({
  imports: [BlogModule, AdminModule],
  controllers: [],
  providers: [PostService, CommentService, TagService, UserService],
  exports: [PostService, CommentService, TagService, UserService]
})
export class AppModule { }
