import { render } from '../src/renderer'
import { compare } from '../src/utils'
import { getPixelsFromPngBuffer, getPngBufferFromBase64 } from '../src/utils/converter'
import { LUCI_AVATAR } from './utils/avatar/luci'
import { describe, expect, it } from 'vitest'

describe('Renderer', () => {
  it('Render', async () => {
    const png = getPngBufferFromBase64(LUCI_AVATAR)
    const { pixels: source, width, height } = await getPixelsFromPngBuffer(png)
    const target = render(source, width, height, (uv, texture2D) => texture2D([uv[0], uv[1]]), {
      textureFilter: 'NEAREST'
    })

    expect(compare(source, target)).toBeTruthy()
  })
})
