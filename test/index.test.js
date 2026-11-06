'use strict'

const fs = require('fs')
const path = require('path')
const test = require('brittle')

const Fac = require('../')

const relativePathToDb = './db'
const absolutePathToDb = path.join(__dirname, 'db')
const fakeDbDir = path.join(__dirname, 'fake_db_dir')

function resetDb () {
  fs.rmSync(absolutePathToDb, { recursive: true, force: true })
  fs.mkdirSync(absolutePathToDb, { recursive: true })
  Fac.ctx = { root: '' }
}

function cleanupDb () {
  fs.rmSync(absolutePathToDb, { recursive: true, force: true })
  Fac.ctx = { root: '' }
}

test('Uses absolute path to db', function (t) {
  resetDb()

  const fac = new Fac(
    Fac,
    {
      name: 'name',
      label: 'label',
      persist: true,
      dbPathAbsolute: absolutePathToDb
    }
  )

  t.teardown(() => new Promise((resolve) => fac.stop(resolve)), { force: true })
  t.teardown(cleanupDb, { force: true })

  t.plan(2)

  fac._start((err) => {
    t.absent(err)

    fac._stop((stopErr) => {
      t.absent(stopErr)
    })
  })
})

test('Uses relative path to db', function (t) {
  resetDb()
  Fac.ctx = { root: './test' }

  const fac = new Fac(
    Fac,
    {
      name: 'name',
      label: 'label',
      persist: true,
      dbPathAbsolute: relativePathToDb
    }
  )

  t.teardown(() => new Promise((resolve) => fac.stop(resolve)), { force: true })
  t.teardown(cleanupDb, { force: true })

  t.plan(2)

  fac._start((err) => {
    t.absent(err)

    fac._stop((stopErr) => {
      t.absent(stopErr)
    })
  })
})

test('Returns an error if db directory does not exist', function (t) {
  resetDb()

  const fac = new Fac(
    Fac,
    {
      name: 'name',
      label: 'label',
      persist: true,
      dbPathAbsolute: fakeDbDir
    }
  )

  t.teardown(() => new Promise((resolve) => fac.stop(resolve)), { force: true })
  t.teardown(cleanupDb, { force: true })

  t.plan(2)

  fac._start((err) => {
    t.absent(err)

    fac._stop((stopErr) => {
      t.ok(stopErr instanceof Error)
    })
  })
})
