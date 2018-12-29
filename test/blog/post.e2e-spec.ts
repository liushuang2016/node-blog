import * as request from 'supertest';
import { PostModel } from 'src/model/Post';
import * as mongoose from 'mongoose';
import { beforA, afterA } from 'test/tools';

const testPost = {
  title: 'testPost',
  tags: 'testPost',
  content: 'testPost',
  author: mongoose.Types.ObjectId()
}

describe('posts', () => {
  let agent = request.agent('http://localhost:3000')

  beforeAll(async () => {
    beforA()
    await new PostModel(testPost).save()
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
    return agent
      .get('/posts')
      .end((err, res) => {
        if (err) done(err)
        expect(res.text.includes('testPost')).toBeTruthy()
        done()
      })
  })

  afterAll(async () => {
    await PostModel.deleteOne({ title: 'testPost' })
    afterA()
  })
})
