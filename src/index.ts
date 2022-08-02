import { Context } from 'koishi'
import {} from '@koishijs/plugin-adapter-onebot'

declare module 'koishi' {
  interface Channel {
    autokick: number
  }
}

export const name = 'autokick'
export const using = ['database']

export function apply(ctx: Context) {
  ctx = ctx.platform('onebot')

  ctx.model.extend('channel', {
    autokick: 'integer',
  })

  ctx.command('autokick [count:number]', '自动踢人', { authority: 3 })
    .channelFields(['autokick'])
    .action(async ({ session }, count) => {
      if (typeof count === 'number') {
        session.channel.autokick = count
      }
      if (!session.channel.autokick) return

      let users = await session.onebot.getGroupMemberList(session.guildId)
      if (session.channel.autokick >= users.length) return '无需踢人。'
      users = users.sort((a, b) => a.last_sent_time - b.last_sent_time)
      const target = users[0]
      await session.send([
        `将 ${target.nickname || target.card} (${target.user_id}) 移出群……`,
        `入群时间：${new Date(target.join_time * 1000)}`,
        `最后发言：${new Date(target.last_sent_time * 1000)}`,
      ].join('\n'))
      await session.onebot.setGroupKick(session.guildId, target.user_id)
    })
}
