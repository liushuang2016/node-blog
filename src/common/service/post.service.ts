import { Injectable } from "@nestjs/common";
import * as marked from "marked";
import { Comment } from "src/model/Comment";
import { format } from "src/common/utils";
import { Post } from "src/model/Post";

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
      posts['content'] = marked(posts['content'])
      posts['ct'] = format(posts['ct'])
      posts['ut'] = format(posts['ut'])
      return posts
    } catch (e) {
      throw new Error('文章不存在')
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
  async getPosts() {
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
    return Promise.all(promisePosts)
  }

  // 删除文章
  async delPostById(id: any) {
    try {
      await Post.updateOne({ _id: id }, { _delete: false })
      return true
    } catch (e) {
      return false
    }
  }
}
