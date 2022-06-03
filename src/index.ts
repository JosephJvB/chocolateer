import os from 'os'
import path from 'path'
import fs from 'fs'
import chokidar from 'chokidar'

const zshHistoryFile = path.join(os.homedir(), '.zsh_history')
const logDir = path.join(os.homedir(), 'zsh-history-logs/')
const changeCountFile = __dirname + '/../changeCount.txt'

if (!fs.existsSync(changeCountFile)) {
  fs.writeFileSync(changeCountFile, '0')
}
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

chokidar.watch(zshHistoryFile)
.on('change', filePath => {
  handleChange()
})

function handleChange() {
  let nextChangeCount = Number(fs.readFileSync(changeCountFile)) + 1
  if (nextChangeCount >= 10000) {
    saveLogFile()
    nextChangeCount = 0
  }
  fs.writeFileSync(changeCountFile, nextChangeCount.toString())
}
function saveLogFile() {
  const logsSoFar = fs.readdirSync(logDir).filter(f => f.endsWith('.txt'))
  fs.copyFileSync(
    zshHistoryFile,
    logDir + (logsSoFar.length + 1) + '.txt'
  )
}
// .on('raw', (eventName, filePath, details) => {
//   console.log(filePath, 'raw event', eventName, details)
//   // /Users/jvb-milk/.zsh_history raw event modified {
//   //   path: '/Users/jvb-milk/.zsh_history',
//   //   flags: 69632,
//   //   event: 'modified',
//   //   type: 'file',
//   //   changes: { inode: false, finder: false, access: false, xattrs: false }
//   // }
// })