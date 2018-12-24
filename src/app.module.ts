import { Module, Global } from '@nestjs/common';
import { BlogModule } from 'src/blog/blog.module';
import { PostService } from 'src/common/service/post.service';
import { CommentService } from 'src/common/service/comment.service';
import { TagService } from 'src/common/service/tag.service';

@Global()
@Module({
  imports: [BlogModule],
  controllers: [],
  providers: [PostService, CommentService, TagService],
  exports: [PostService, CommentService, TagService]
})
export class AppModule { }
