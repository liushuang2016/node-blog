import { Injectable, BadRequestException } from "@nestjs/common";
import { format } from "src/common/utils";
import { Comment } from "src/model/Comment";
import { User } from "src/model/User";
import * as config from "config";
import { PostService } from "src/common/service/post.service";

@Injectable()
export class CommentService {
  // 每页留言的条数
  public readonly commentSize: number = config.get('commentSize') || 20

  // 获取对应文章下的留言
  async getComments(postId: any, page = 1) {
    let comments = await Comment.find({ postId })
      .skip((page - 1) * this.commentSize).limit(this.commentSize).populate('author')

    comments = comments.map(comment => {
      comment = comment.toObject()
      delete comment['author']['password']
      comment['ct'] = format(comment['ct'])
      return comment
    })
    return comments
  }

  // 获取用户的留言
  async getCommentsByUserId(userId: any, page = 1) {
    let comments = await Comment.find({ author: userId })
      .skip((page - 1) * this.commentSize).limit(this.commentSize).populate('author')

    comments = comments.map(comment => {
      comment = comment.toObject()
      delete comment['author']['password']
      comment['ct'] = format(comment['ct'])
      return comment
    })
    return comments
  }

  // 添加留言
  async addComment(obj: any) {
    const userId = obj.author
    const user = await User.findById(userId)
    // 非管理员有留言数量限制
    if (user['role'] !== 1) {
      // 获取该用户的留言数
      const commentsCount = await Comment.countDocuments({ author: userId })
      if (commentsCount > 200) {
        throw new Error('留言数量超限制')
      }
    }
    // 防止 xss，增加换行功能
    obj.content = obj.content
      .replace(/</g, '&lt').replace(/>/g, '&gt')
      .replace(/\r\n/g, '<br>')
    // 换行过多
    if (obj.content.split('<br>').length + 1 > 8) {
      throw new Error('留言行数太多')
    }
    await new Comment(obj).save()
  }

  // 获取留言数量
  async getCommentsCount(obj: any) {
    return await Comment.countDocuments(obj)
  }

  // 删除留言
  async delById(id) {
    return await Comment.findOneAndDelete({ _id: id })
  }

  // 根据id获取留言
  async getCommentById(id) {
    return await Comment.findById(id)
  }
}
