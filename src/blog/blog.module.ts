import { Module } from "@nestjs/common";
import { PostsController } from "src/blog/cotroller/posts.cotroller";
import { UserController } from "src/blog/cotroller/user.controller";

@Module({
  controllers: [PostsController, UserController]
})
export class BlogModule { }
