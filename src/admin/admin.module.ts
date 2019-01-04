import { TagAdminController } from './controller/tag.controller';
import { LoginAdminCtroller } from './controller/login.controller';
import { AdminExceptionFilter } from './filter/admin-exception.filter';
import { Module, UseFilters } from "@nestjs/common";
import { PostAdminController } from "./controller/post.controller";
import { UserAdminController } from "./controller/user.controller";
import { CommentAdminController } from "./controller/comment.controller";
import { APP_FILTER } from "@nestjs/core";

@Module({
  controllers: [PostAdminController, UserAdminController, CommentAdminController, LoginAdminCtroller, TagAdminController]
})
export class AdminModule { }
