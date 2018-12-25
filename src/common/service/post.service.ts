import { Injectable, BadRequestException } from "@nestjs/common";
import * as marked from "marked";
import { Comment } from "src/model/Comment";
import { format } from "src/common/utils";
import { Post } from "src/model/Post";
import { GlobalService } from "src/common/service/global.service";

@Injectable()
export class PostService {
  // 通过id得到 marked 后的文章
  async findByIdToHtml(id: any) {
    try {
      let posts = await Post.findById(id)
      posts = posts.toObject()
      if (posts['_delete']) {
        throw new Error('文章不存在')
      }
      // 获取评论数
      posts['commentsCount'] = await Comment.countDocuments({ postId: posts._id })
      // pv + 1, 如果不await则函数返回后，异步操作会失败
      await Post.updateOne({ _id: posts._id }, { $inc: { pv: 1 } })
      posts['pv'] += 1
      posts['content'] = marked(posts['content'])
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
    if (GlobalService.get('posts') && !update) {
      return GlobalService.get('posts')
    }
    let posts = await Post.find({ _delete: false })
    let promisePosts = posts.map(async post => {
      post = post.toObject()
      // 获取文章首段作为摘要
      post['excerpt'] = post['content'].split('\r\n')[0]
      post['commentsCount'] = await Comment.countDocuments({ postId: post._id })
      post['ct'] = format(post['ct'])
      post['ut'] = format(post['ut'])
      return post
    })
    posts = await Promise.all(promisePosts)
    GlobalService.set('posts', posts)
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
      await Post.updateOne({ _id: id }, post)
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  // 新建文章
  async addPost(post: any) {
    try {
      await new Post(post).save()
    } catch (e) {
      throw e
    }
  }
}
