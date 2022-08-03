import { Context, Schema } from 'koishi'
import {} from '@koishijs/plugin-adapter-onebot'

declare module 'koishi' {
  interface Channel {
    autokick: number
  }
}

export const name = 'autokick'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx = ctx.platform('onebot').guild()

  ctx.command('autokick <threshold:number>', '踢出太久没有发言的群友', { authority: 3 })
    .option('dry', '只检测不踢人')
    .action(async ({ session, options }, threshold) => {
      if (!threshold) return '请输入一个最大人数。'

      let users = await session.onebot.getGroupMemberList(session.guildId, true)
      if (threshold >= users.length) return options.dry ? '群成员数量未超过限制。' : ''
      users = users.sort((a, b) => a.last_sent_time - b.last_sent_time)
      const target = users[0]
      await session.send([
        `将 ${target.nickname || target.card} (${target.user_id}) 移出群……`,
        `入群时间：${new Date(target.join_time * 1000)}`,
        `最后发言：${new Date(target.last_sent_time * 1000)}`,
      ].join('\n'))
      if (options.dry) return
      await session.onebot.setGroupKick(session.guildId, target.user_id)
    })
}
