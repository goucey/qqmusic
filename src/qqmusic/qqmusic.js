import { initMixin } from '../qqmusic/init'
import { coreMixin } from '../qqmusic/core'
import { eventMixin } from '../qqmusic/event'

function QQMusic (Player) {
  this.player = Player
  this._init(Player.options)
}
initMixin(QQMusic)
coreMixin(QQMusic)
eventMixin(QQMusic)

QQMusic.Version = '1.0.0.1'

export default QQMusic
