import { CommentModel } from './../../src/model/Comment';
import { UserModel } from './../../src/model/User';
import * as request from 'supertest';
import { PostModel } from 'src/model/Post';
import * as mongoose from 'mongoose';
import { connection, closeConnection, getTest } from 'test/tools';
import * as sha1 from "sha1";

describe('blog module', () => {
  let agent = request.agent('http://localhost:3000')
  const registerName = 'register'
  const testId = mongoose.Types.ObjectId()
  const testPost = {
    title: 'testPost',
    tags: 'testPost',
    content: 'testPost',
    author: mongoose.Types.ObjectId(),
    _id: testId
  }

  const testUser = {
    name: 'testName',
    password: sha1('123'),
    ip: '0'
  }

  beforeAll(async () => {
    connection()
    await new PostModel(testPost).save()
    await new UserModel(testUser).save()
  })

  afterAll(async () => {
    await PostModel.deleteOne({ title: 'testPost' })
    await CommentModel.deleteMany({ postId: testId })
    await UserModel.deleteOne({ name: 'testName' })
    await UserModel.deleteOne({ name: registerName })
    closeConnection()
  })

  test('/', (done) => {
    return agent
      .get('/')
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('testPost')).toBeTruthy()
        done()
      })
  })

  test('/posts', (done) => {
    return getTest(agent, '/posts', (res) => {
      expect(res.text.includes('testPost')).toBeTruthy()
    })(done)
  })

  test('/posts?tag=testPost', (done) => {
    return getTest(agent, '/posts?tag=testPost', (res) => {
      expect(res.text.includes('testPost')).toBeTruthy()
    })(done)
  })

  test('/posts?p=2', (done) => {
    return getTest(agent, '/posts?p=2', (res) => {
      expect(res.text.includes('testPost')).toBeFalsy()
    })(done)
  })

  test('/posts?tag=testPost&p=2', (done) => {
    return getTest(agent, '/posts?tag=testPost&p=2', (res) => {
      expect(res.text.includes('testPost')).toBeFalsy()
    })(done)
  })

  test('/posts?tag=testPost&p=1', (done) => {
    return getTest(agent, '/posts?tag=testPost&p=1', (res) => {
      expect(res.text.includes('testPost')).toBeTruthy()
    })(done)
  })

  test('/posts/:postId', (done) => {
    return getTest(agent, `/posts/${testId}`, (res) => {
      expect(res.text.includes('testPost')).toBeTruthy()
      expect(res.text.includes('返回顶部')).toBeTruthy()
      expect(res.text.includes('id="comments-content"')).toBeTruthy()
      expect(res.text.includes('class="comments-none"')).toBeTruthy()
      expect(res.text.includes('登录后评论')).toBeTruthy()
    })(done)
  })

  test('/posts/:postsId notfound', (done) => {
    return agent
      .get('/posts/:dadsd')
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('文章不存在'))
        done()
      })
  })

  test('404', (done) => {
    return getTest(agent, '/dsfsx', (res) => {
      expect(res.text.includes('http://www.qq.com/404/search_children.js')).toBeTruthy()
    })(done)
  })

  test('/tags', (done) => {
    return getTest(agent, '/tags', (res) => {
      expect(res.text.includes('Tag -')).toBeTruthy()
    })(done)
  })

  test('/comments/:postId notlogin', (done) => {
    agent
      .post(`/comments/${testId}`)
      .send('content=123')
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('请先登录')).toBeTruthy()
        done()
      })
  })

  test('/login dtoValidate', (done) => {
    agent
      .post('/login')
      .send('name=   &password=')
      .redirects(2)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('testPost')).toBeTruthy()
        done()
      })
  })

  test('/login dtoValidate2', (done) => {
    agent
      .post('/login')
      .send('name=ls&password=')
      .redirects(2)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('testPost')).toBeTruthy()
        done()
      })
  })

  test('/login password error', (done) => {
    agent
      .post('/login')
      .send('name=testName&password=1234')
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('用户名被占用或密码错误')).toBeTruthy()
        done()
      })
  })

  // 注册
  test('/login register', (done) => {
    agent
      .post('/login')
      .send(`name=${registerName}&password=123`)
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('注册成功')).toBeTruthy()
        done()
      })
  })

  // 登录
  test('/login', (done) => {
    agent
      .post('/login')
      .send('name=testName&password=123')
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('登录成功')).toBeTruthy()
        done()
      })
  })

  test('/login?next', (done) => {
    agent
      .post(`/login?next=/posts/${testId}`)
      .send('name=testName&password=123')
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('返回顶部')).toBeTruthy()
        expect(res.text.includes('id="comments-content"')).toBeTruthy()
        done()
      })
  })

  test('/posts/:postId logined', (done) => {
    getTest(agent, `/posts/${testId}`, (res) => {
      expect(res.text.includes('testPost')).toBeTruthy()
      expect(res.text.includes('返回顶部')).toBeTruthy()
      expect(res.text.includes('id="comments-content"')).toBeTruthy()
      expect(res.text.includes('class="comments-none"')).toBeTruthy()
      expect(res.text.includes('登录后评论')).toBeFalsy()
    })(done)
  })

  test('/comments/:postId logined', (done) => {
    agent
      .post(`/comments/${testId}`)
      .send('content=123test')
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('id="comments-content"')).toBeTruthy()
        expect(res.text.includes('123test')).toBeTruthy()
        done()
      })
  })

  test('/comments/:postId logined validate', (done) => {
    agent
      .post(`/comments/${testId}`)
      .send('content=   ')
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('评论不能为空')).toBeTruthy()
        done()
      })
  })

  test('/posts/:postId?p=1 logined', (done) => {
    getTest(agent, `/posts/${testId}?p=1`, (res) => {
      expect(res.text.includes('123test')).toBeTruthy()
    })(done)
  })

  test('/posts/:postId?p=2 logined', (done) => {
    getTest(agent, `/posts/${testId}?p=2`, (res) => {
      expect(res.text.includes('123test')).toBeFalsy()
    })(done)
  })

  // 登出
  test('/logout', (done) => {
    agent
      .get('/logout')
      .redirects(1)
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('登出成功')).toBeTruthy()
        done()
      })
  })
})
