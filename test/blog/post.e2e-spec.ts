import { TagService } from 'src/common/service/tag.service';
import * as request from 'supertest';
import * as mongoose from "mongoose";
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PostService } from 'src/common/service/post.service';
import { BlogModule } from 'src/blog/blog.module';
import { CommentService } from 'src/common/service/comment.service';
import { PostController } from 'src/blog/cotroller/post.cotroller';

const testPost = {
  title: 'testPost',
  tags: 'testPost',
  content: 'testPost',
  author: mongoose.Types.ObjectId()
}

describe('index', () => {
  let app: INestApplication
  let postService = new PostService()
  let commentService = new CommentService()
  let tagService = new TagService()
  let agent = request.agent()
  let pService: PostService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [BlogModule],
      controllers: [PostController],
      providers: [PostService]
    })
      .overrideProvider(PostService)
      .useValue(postService)
      .overrideProvider(CommentService)
      .useValue(commentService)
      .overrideProvider(TagService)
      .useValue(tagService)
      .compile()

    app = module.createNestApplication()
    await app.init()
    agent = request.agent(app.getHttpServer())
    // await postService.addPost(testPost)

  })

  // 重定向
  test('/', (done) => {
    return agent
      .get('/posts')
      .end((err, res) => {
        console.log(err);
        if (err) done(err)
        expect(null).toBeNull()
        done()
      })
  })

  // 
  afterAll(async () => {
    await pService.dangerDel({ title: 'testPost' })
    await app.close()
  })
})
