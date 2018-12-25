
import { Injectable } from '@nestjs/common';
import { User } from 'src/model/User';
import { format } from 'src/common/utils';
import { Comment } from 'src/model/Comment';

@Injectable()
export class UserService {
  async getAllUsers() {
    let users = await User.find()
    let promiseUsers = users.map(async user => {
      user = user.toObject()
      user['ct'] = format(user['ct'])
      user['commentsCount'] = await Comment.countDocuments({ author: user._id })
      return user
    })
    return Promise.all(promiseUsers)
  }

  // 根据id删除user
  async delUserById(id: any) {
    try {
      await User.deleteOne({ _id: id })
      return true
    } catch (e) {
      throw new Error('用户不存在')
    }
  }
}
