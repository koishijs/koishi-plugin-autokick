# koishi-plugin-autokick

[![npm](https://img.shields.io/npm/v/koishi-plugin-autokick?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-autokick)

踢出太久没有发言的群友 (仅对 QQ 生效)。

## 指令：autokick

- 基本语法：`autokick [threshold]`
- 选项列表：
  - --dry 只检测不踢人

以 threshold 为允许最大人数。如果当前群组中人数大于这个数值，则将自动踢出上次发言时间最早的群友。
