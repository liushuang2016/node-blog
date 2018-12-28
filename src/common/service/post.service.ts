import { Injectable, BadRequestException } from "@nestjs/common";
import { Comment } from "src/model/Comment";
import { format, toMarked, markedToDir } from "src/common/utils";
import { Post } from "src/model/Post";
import { GlobalService } from "src/common/service/global.service";
import * as config from "config";

@Injectable()
export class PostService {
  public readonly postSize: number = config.get('postSize') || 12

  // 通过id得到 marked 后的文章
  async findByIdToHtml(id: any) {
    try {
      let posts = await Post.findById(id)
      posts = posts.toObject()
      if (posts['_delete']) {
        throw new Error('文章不存在')
      }
      // pv + 1, 如果不await则函数返回后，异步操作会失败
      await Post.updateOne({ _id: posts._id }, { $inc: { pv: 1 } })
      posts['pv'] += 1
      posts['dir'] = markedToDir(posts['content'])
      posts['content'] = toMarked(posts['content'])
      posts['ct'] = format(posts['ct'])
      posts['ut'] = format(posts['ut'])
      return posts
    } catch (e) {
      throw new BadRequestException('文章不存在')
    }
  }

  // 通过id 获取原生文章
  async getRawPostById(id: any) {
    try {
      let posts = await Post.findById(id)
      posts = posts.toObject()
      if (posts['_delete']) {
        throw new Error('文章不存在')
      }
      posts['ct'] = format(posts['ct'])
      posts['ut'] = format(posts['ut'])
      return posts
    } catch (e) {
      throw new Error('文章不存在')
    }
  }

  // 获取所有文章
  async getPosts(update = false) {
    // 按时间降序排列
    let posts = await Post.find({ _delete: false }).sort({ _id: -1 })

    posts = posts.map(post => {
      post = post.toObject()
      // 获取文章首段作为摘要
      post['excerpt'] = post['content'].split('\r\n')[0]
      // post['commentsCount'] = await Comment.countDocuments({ postId: post._id })
      post['ct'] = format(post['ct'])
      post['ut'] = format(post['ut'])
      return post
    })
    return posts
  }

  // 分页获取文章
  async getPostsUsePage(page = 1, tag?: string) {
    let query = { _delete: false }
    let posts = []

    if (tag) {
      posts = await Post.find(query).sort({ _id: -1 })
      posts = posts.filter(post => {
        return post['tags'].indexOf(tag) !== -1
      })
    } else {
      posts = await Post.find(query)
        .sort({ _id: -1 })
        .skip(this.postSize * (page - 1)).limit(this.postSize)
    }

    posts = posts.map(post => {
      post = post.toObject()
      // 获取文章首段作为摘要
      post['excerpt'] = post['content'].split('\r\n')[0]
      // post['commentsCount'] = await Comment.countDocuments({ postId: post._id })
      post['ct'] = format(post['ct'])
      post['ut'] = format(post['ut'])
      return post
    })
    return posts
  }

  // 删除文章
  async delPostById(id: any) {
    try {
      await Post.updateOne({ _id: id }, { _delete: true })
      return true
    } catch (e) {
      throw new Error('文章不存在')
    }
  }

  // 根据id更新文章
  async updateById(id: any, post: any) {
    try {
      post.ut = Date.now()
      // post.commentsCount = await Comment.countDocuments({ postId: id })
      await Post.updateOne({ _id: id }, post)
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  // 新建文章
  async addPost(post: any) {
    await new Post(post).save()
  }

  // 通过文章 id 更新文章commentsCount
  async updateCommentsCount(id: any, commentsCount?: number) {
    try {
      if (commentsCount) {
        await Post.updateOne({ _id: id }, { commentsCount })
      } else {
        const commentsCount = await Comment.countDocuments({ postId: id })
        await Post.updateOne({ _id: id }, { commentsCount })
      }
      return true
    } catch (e) {
      return false
    }
  }

  // 获取文章数量
  async getPostsCount(tag?: string) {
    if (tag) {
      const posts = await Post.find({ _delete: false })
      return posts.filter(post => {
        return post['tags'].indexOf(tag) !== -1
      }).length
    }
    return await Post.countDocuments({ _delete: false })
  }
}
