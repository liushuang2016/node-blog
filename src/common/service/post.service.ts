import { Model } from 'mongoose';
import { Injectable, BadRequestException } from "@nestjs/common";
import { format, toMarked, markedToDir } from "../../common/utils";
import * as config from "config";
import { InjectModel } from "@nestjs/mongoose";
import { PostInterface } from '../../model/Post';
import { CommentInterface } from '../../model/Comment';
import * as mongoose from "mongoose";

@Injectable()
export class PostService {
  public readonly postSize: number = config.get('postSize') || 12

  constructor(
    @InjectModel('post') private readonly postModel: Model<PostInterface>,
    @InjectModel('comment') private readonly commentModel: Model<CommentInterface>
  ) { }

  // 得到 marked 后的文章
  async findOneToHtml(id: any) {
    try {
      let posts: PostInterface
      if (mongoose.Types.ObjectId.isValid(id)) {
        posts = await this.postModel.findById(id)
      } else {
        posts = await this.postModel.findOne({ title: id })
      }
      if (!posts || posts._delete) {
        throw new Error('文章不存在')
      }
      posts = posts.toObject()
      // pv + 1, 如果不await则函数返回后，异步操作会失败
      await this.postModel.updateOne({ _id: posts._id }, { $inc: { pv: 1 } })
      posts.pv += 1
      posts['dir'] = markedToDir(posts.content)
      posts.content = toMarked(posts.content)
      posts.ct = format(posts.ct)
      posts.ut = format(posts.ut)
      return posts
    } catch (e) {
      throw new BadRequestException('文章不存在')
    }
  }

  // 通过id 获取原生文章
  async getRawPostById(id: any) {
    try {
      let posts = await this.postModel.findById(id)
      posts = posts.toObject()
      if (posts._delete) {
        throw new Error('文章不存在')
      }
      posts.ct = format(posts.ct)
      posts.ut = format(posts.ut)
      return posts
    } catch (e) {
      throw new Error('文章不存在')
    }
  }

  // 获取所有文章
  async getPosts(update = false) {
    // 按时间降序排列
    let posts = await this.postModel.find({ _delete: false }).sort({ _id: -1 })

    posts = posts.map(post => {
      post = post.toObject()
      // 获取文章首段作为摘要
      post['excerpt'] = post.content.split('\r\n')[0]
      // post.commentsCount = await Comment.countDocuments({ postId: post._id })
      post.ct = format(post.ct)
      post.ut = format(post.ut)
      return post
    })
    return posts
  }

  // 分页获取文章
  async getPostsUsePage(page = 1, tag?: string) {
    let query = { _delete: false }
    if (tag) {
      query['tags'] = tag
    }

    let posts = await this.postModel.find(query)
      .sort({ _id: -1 })
      .skip(this.postSize * (page - 1)).limit(this.postSize)

    posts = posts.map(post => {
      post = post.toObject()
      // 获取文章首段作为摘要
      post['excerpt'] = post.content.split('\r\n')[0]
      post['contentLength'] = post.content.length
      delete post.content
      post.ct = format(post.ct)
      post.ut = format(post.ut)
      return post
    })
    return posts
  }

  // 逻辑删除文章
  async delPostById(id: any) {
    try {
      await this.postModel.updateOne({ _id: id }, { _delete: true })
      return true
    } catch (e) {
      throw new Error('文章不存在')
    }
  }

  // 物理删除
  async dangerDel(query) {
    try {
      await this.postModel.deleteOne(query)
      return true
    } catch (e) {
      throw new Error('文章不存在')
    }
  }

  // 根据id更新文章
  async updateById(id: any, post: any) {
    post.ut = Date.now()
    await this.postModel.updateOne({ _id: id }, post)
  }

  // 新建文章
  async addPost(post: any) {
    await new this.postModel(post).save()
  }

  // 通过文章 id 更新文章commentsCount
  async updateCommentsCount(id: any, commentsCount?: number) {
    try {
      if (commentsCount) {
        await this.postModel.updateOne({ _id: id }, { commentsCount })
      } else {
        const commentsCount = await this.commentModel.countDocuments({ postId: id })
        await this.postModel.updateOne({ _id: id }, { commentsCount })
      }
      return true
    } catch (e) {
      return false
    }
  }

  // 获取文章数量
  async getPostsCount(tag?: string) {
    if (tag) {
      const posts = await this.postModel.find({ _delete: false })
      return posts.filter(post => {
        return post.tags.indexOf(tag) !== -1
      }).length
    }
    return await this.postModel.countDocuments({ _delete: false })
  }
}
