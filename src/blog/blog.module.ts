import { Module } from "@nestjs/common";
import { PostsController } from "src/blog/cotroller/posts.cotroller";

@Module({
  controllers: [PostsController]
})
export class BlogModule { }
