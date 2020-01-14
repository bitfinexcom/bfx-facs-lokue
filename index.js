'use strict'

const path = require('path')
const async = require('async')
const Lokue = require('lokue')
const Base = require('bfx-facs-base')

class LokueFacility extends Base {
  constructor (caller, opts, ctx) {
    super(caller, opts, ctx)

    this.name = 'lokue'

    this.init()
  }

  init () {
    super.init()

    const cal = this.caller

    const {
      dbPathAbsolute,
      label,
      persist
    } = this.opts
    const baseName = `${this.name}_${this.opts.name}_${label}.db.json`
    const name = (
      typeof dbPathAbsolute === 'string' &&
      path.isAbsolute(dbPathAbsolute)
    )
      ? path.join(dbPathAbsolute, baseName)
      : path.join(cal.ctx.root, 'db', baseName)

    this.q = new Lokue({
      name,
      persist
    })
  }

  _start (cb) {
    async.series([
      next => { super._start(next) },
      next => {
        this.q.init(next)
      },
      next => {
        this._clearItv = setInterval(() => {
          if (!this.q.isReady()) return
          this.q.clearCompletedJobs()
          this.q.clearErrorJobs()
        }, 60000)
        next()
      }
    ], cb)
  }

  _stop (cb) {
    async.series([
      next => { super._stop(next) },
      next => {
        this.q.stop(next)
      }
    ], cb)
  }
}

module.exports = LokueFacility
