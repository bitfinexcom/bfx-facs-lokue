/* eslint-env mocha */

'use strict'

const assert = require('assert')
const path = require('path')

const mkdirp = require('mkdirp')
const rimraf = require('rimraf')

const Fac = require('../')

const relativePathToDb = './db'
const absolutePathToDb = path.join(__dirname, 'db')
const fakeDbDir = path.join(__dirname, 'fake_db_dir')

beforeEach(() => {
  rimraf.sync(absolutePathToDb)
  mkdirp.sync(absolutePathToDb)

  Fac.ctx = { root: '' }
})

afterEach(() => {
  rimraf.sync(absolutePathToDb)
})

describe('General', () => {
  it('Uses absolute path to db', (done) => {
    const fac = new Fac(
      Fac,
      {
        name: 'name',
        label: 'label',
        persist: true,
        dbFolder: absolutePathToDb
      }
    )

    fac._start((err) => {
      assert.ifError(err)

      fac._stop((err) => {
        assert.ifError(err)

        done()
      })
    })
  })

  it('Uses relative path to db', (done) => {
    Fac.ctx = { root: './test' }

    const fac = new Fac(
      Fac,
      {
        name: 'name',
        label: 'label',
        persist: true,
        dbFolder: relativePathToDb
      }
    )

    fac._start((err) => {
      assert.ifError(err)

      fac._stop((err) => {
        assert.ifError(err)

        done()
      })
    })
  })

  it('Returns an error if db directory does not exist', (done) => {
    const fac = new Fac(
      Fac,
      {
        name: 'name',
        label: 'label',
        persist: true,
        dbFolder: fakeDbDir
      }
    )

    fac._start((err) => {
      assert.ifError(err)

      fac._stop((err) => {
        assert.ok(err instanceof Error)

        done()
      })
    })
  })
})
