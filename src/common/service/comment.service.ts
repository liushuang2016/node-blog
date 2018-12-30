import { Injectable, BadRequestException } from "@nestjs/common";
import { format } from "../utils";
import * as config from "config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommentInterface } from "../../model/Comment";

@Injectable()
export class CommentService {
  // 每页留言的条数
  public readonly commentSize: number = config.get('commentSize') || 20

  constructor(
    @InjectModel('comment') private readonly commentModel: Model<CommentInterface>
  ) { }

  // 获取对应文章下的留言
  async getComments(postId: any, page = 1) {
    let comments = []
    try {
      comments = await this.commentModel.find({ postId })
        .skip((page - 1) * this.commentSize).limit(this.commentSize).populate('author')

      comments = comments.map(comment => {
        comment = comment.toObject()
        comment.ct = format(comment.ct)
        return comment
      })
      return comments
    } catch (e) {
      return []
    }
  }

  // 获取用户的留言
  async getCommentsByUserId(userId: any, page = 1) {
    let comments = await this.commentModel.find({ author: userId })
      .skip((page - 1) * this.commentSize).limit(this.commentSize).populate('author')

    comments = comments.map(comment => {
      comment = comment.toObject()
      delete comment.author.password
      comment.ct = format(comment.ct)
      return comment
    })
    return comments
  }

  // 添加留言
  async addComment(obj: any, user: any) {
    const userId = obj.author
    // 非管理员有留言数量限制
    if (user.role !== 1) {
      // 获取该用户的留言数
      const commentsCount = await this.commentModel.countDocuments({ author: userId })
      if (commentsCount > 200) {
        throw new Error('留言数量超限制')
      }
    }
    // 防止 xss，增加换行功能
    obj.content = obj.content
      .replace(/</g, '&lt').replace(/>/g, '&gt')
      .replace(/\r\n/g, '<br>')
    // 换行过多
    if (obj.content.split('<br>').length > 8) {
      throw new Error('留言行数太多')
    }
    await new this.commentModel(obj).save()
  }

  // 获取留言数量
  async getCommentsCount(obj: any) {
    return await this.commentModel.countDocuments(obj)
  }

  // 删除留言
  async delById(id) {
    return await this.commentModel.findOneAndDelete({ _id: id })
  }

  // 根据id获取留言
  async getCommentById(id) {
    return await this.commentModel.findById(id)
  }
}
