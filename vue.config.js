module.exports = {
    publicPath: process.env.NODE_ENV === 'main'
        ? '/bingo/'
        : '/'
}