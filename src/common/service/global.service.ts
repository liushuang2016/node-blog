import { Injectable } from "@nestjs/common";

// 保存全局共享变量
@Injectable()
export class GlobalService {
  private static g = global['blog'] ? global['blog'] : global['blog'] = {}

  static get(key: string) {
    if (this.g[key]) {
      return this.g[key]
    }
    return null
  }

  static set(key: string, value: any) {
    this.g[key] = value
  }
}
