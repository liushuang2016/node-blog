import { Injectable } from "@nestjs/common";
import { format } from "src/common/utils";
import { Comment } from "src/model/Comment";

@Injectable()
export class CommentService {
  // 获取对应文章下所有留言
  async getComments(postId: any) {
    let comments = await Comment.find({ postId })

    comments = comments.map(comment => {
      comment = comment.toObject()
      comment['ct'] = format(comment['ct'])
      return comment
    })
    return comments
  }
}
