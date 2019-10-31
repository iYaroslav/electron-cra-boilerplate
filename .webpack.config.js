module.exports = config => {
  return {
    ...config,
    target: 'electron-renderer',
    stats: {
      colors: true,
      children: false,
      chunks: false,
      modules: false
    }
  }
}
