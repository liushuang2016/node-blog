import { Module } from "@nestjs/common";
import { PostController } from "src/blog/cotroller/post.cotroller";
import { UserController } from "src/blog/cotroller/user.controller";

@Module({
  controllers: [PostController, UserController]
})
export class BlogModule { }
