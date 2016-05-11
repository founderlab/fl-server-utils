import _ from 'lodash'

function getAssetJSON(webpack_assetsPath) {
  return process.env.NODE_ENV === 'development' ? JSON.parse(require('fs').readFileSync(webpack_assetsPath).toString()) : require(webpack_assetsPath)
}

export function jsAssets(entries, webpack_assetsPath) {
  const assets = getAssetJSON(webpack_assetsPath)
  return _(entries).map(e => assets[e].js).compact().value()
}

export function cssAssets(entries, webpack_assetsPath) {
  if (process.env.NODE_ENV === 'development') return []
  const assets = getAssetJSON(webpack_assetsPath)
  return _(entries).map(e => assets[e].css).compact().value()
}
