import * as request from "supertest";
import { connection, closeConnection, getTest } from "test/tools";
import * as sha1 from "sha1";
import { UserModel } from "src/model/User";
import * as mongoose from "mongoose";
import { PostModel } from "src/model/Post";
import { CommentModel } from "src/model/Comment";

describe('admin module', () => {
  let agent = request.agent('http://localhost:3000')
  let adminUser = {
    name: 'admin',
    password: sha1('123'),
    ip: '0',
    role: 1
  }
  const uid = mongoose.Types.ObjectId()
  let normalUser = {
    name: 'normal',
    password: sha1('123'),
    ip: '0',
    _id: uid
  }
  const testId = mongoose.Types.ObjectId()
  const testPost = {
    title: 'testPost2',
    tags: 'testPost',
    content: 'testPost',
    author: mongoose.Types.ObjectId(),
    _id: testId
  }
  const testDId = mongoose.Types.ObjectId()
  const testPostD = {
    title: 'testPostD',
    tags: 'testPost',
    content: 'testPost',
    author: uid,
    _id: testDId
  }
  const testCreatePostTitle = 'testCreate'
  const cid = mongoose.Types.ObjectId()
  const testComment = {
    author: uid,
    postId: testId,
    content: 'testComment',
    _id: cid
  }

  beforeAll(async () => {
    connection()
    await new UserModel(adminUser).save()
    await new UserModel(normalUser).save()
    await new PostModel(testPost).save()
    await new CommentModel(testComment).save()
    await new PostModel(testPostD).save()
  })

  afterAll(async () => {
    await UserModel.deleteOne({ name: 'admin' })
    await UserModel.deleteOne({ name: 'normal' })
    await PostModel.deleteOne({ title: 'testPost2' })
    await CommentModel.deleteMany({ postId: testId })
    await PostModel.deleteOne({ title: testCreatePostTitle })
    await PostModel.deleteOne({ title: 'testPostD' })
    closeConnection()
  })

  // 普通登录
  test('/login normal', (done) => {
    agent
      .post('/login')
      .send('name=normal&password=123')
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('登录成功')).toBeTruthy()
        done()
      })
  })

  // 权限验证
  test('/admin forbidden', (done) => {
    agent
      .get('/admin')
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('Forbidden')).toBeTruthy()
        done()
      })
  })

  // 管理员登录登录
  test('/login admin', (done) => {
    agent
      .post('/login')
      .send('name=admin&password=123')
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('登录成功')).toBeTruthy()
        done()
      })
  })

  test('/admin', (done) => {
    agent
      .get('/admin')
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('testPost2')).toBeTruthy()
        done()
      })
  })

  test('/admin/posts', (done) => {
    getTest(agent, '/admin/posts', (res) => {
      expect(res.text.includes('testPost2')).toBeTruthy()
      done()
    })(done)
  })

  test('/admin/users', (done) => {
    getTest(agent, '/admin/users', (res) => {
      expect(res.text.includes('admin')).toBeTruthy()
      expect(res.text.includes('normal')).toBeTruthy()
      done()
    })(done)
  })

  // 创建文章
  test('/admin/posts/create validate', (done) => {
    agent
      .post('/admin/posts/create')
      .send(`title=`)
      .redirects(2)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('testPost2')).toBeTruthy()
        done()
      })
  })

  test('/admin/posts/create', (done) => {
    agent
      .post('/admin/posts/create')
      .send(`title=${testCreatePostTitle}&tags=123&content=111`)
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('发布成功')).toBeTruthy()
        done()
      })
  })

  test('/admin/posts/create repeat', (done) => {
    agent
      .post('/admin/posts/create')
      .send(`title=${testCreatePostTitle}&tags=123&content=111`)
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('文章标题重复')).toBeTruthy()
        done()
      })
  })

  // 删除文章
  test('/admin/posts/:postId/delete not', (done) => {
    agent
      .get('/admin/posts/dasdfs/delete')
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('testPost2')).toBeTruthy()
        done()
      })
  })

  test('/admin/posts/:postId/delete', (done) => {
    agent
      .get(`/admin/posts/${testDId}/delete`)
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('删除成功')).toBeTruthy()
        done()
      })
  })

  // 编辑文章
  test('/admin/posts/:postId/edit validate', (done) => {
    agent
      .post(`/admin/posts/${testId}/edit`)
      .send('title=')
      .redirects(2)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('testPost2')).toBeTruthy()
        done()
      })
  })

  test('/admin/posts/:postId/edit', (done) => {
    agent
      .post(`/admin/posts/${testId}/edit`)
      .send(`title=testPost2&tags=123&content=123`)
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('更新成功')).toBeTruthy()
        done()
      })
  })

  test('/posts/:postId', (done) => {
    getTest(agent, `/posts/${testId}`, (res) => {
      expect(res.text.includes('testPost2')).toBeTruthy
    })(done)
  })

  // 添加评论
  test('/comments/:postId', (done) => {
    agent
      .post(`/comments/${testId}?p=22`)
      .send('content=12222')
      .redirects(2)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('id="comments-content"')).toBeTruthy()
        expect(res.text.includes('12222')).toBeTruthy()
        done()
      })
  })

  // 删除评论
  test('/admin/comments/:commentId/delete?next notfound', (done) => {
    agent
      .get(`/admin/comments/jklsad/delete?next=/admin/posts/${testId}/edit`)
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('删除失败')).toBeTruthy()
        done()
      })
  })

  test('/admin/comments/:commentId/delete?next', (done) => {
    agent
      .get(`/admin/comments/${cid}/delete?next=/admin/posts/${testId}/edit`)
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('删除成功')).toBeTruthy()
        done()
      })
  })

  // 用户评论管理
  test('/admin/users/:userId/comments notfound', (done) => {
    agent
      .get(`/admin/users/dadafdf/comments`)
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('用户不存在')).toBeTruthy()
        done()
      })
  })

  test('/admin/users/:userId/comments', (done) => {
    agent
      .get(`/admin/users/${uid}/comments`)
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('total:')).toBeTruthy()
        done()
      })
  })

  // 删除用户
  test('/admin/users/:userId/delete notfound', (done) => {
    agent
      .get(`/admin/users/dadxxcz/delete`)
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('删除失败')).toBeTruthy()
        done()
      })
  })

  test('/admin/users/:userId/delete', (done) => {
    agent
      .get(`/admin/users/${uid}/delete`)
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('删除成功')).toBeTruthy()
        done()
      })
  })
})
