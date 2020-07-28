import DOMPurify from 'dompurify'
import showdown from 'showdown'

/*
 * From:
 * https://github.com/CodingGarden/sproutkit/bljb/master/src/lib/sanitizeMessage.ts
 */

const converter = new showdown.Converter()

const options = [
  'underline',
  'strikethrough',
  'emoji',
  'tables',
  'tasklists',
  'smoothLivePreview',
  'openLinksInNewWindow',
  'simplifiedAutoLink',
]

options.forEach(opt => converter.setOption(opt, true))

export default (text, markdownSupport = false) => {
  const finalHTML = markdownSupport ? converter.makeHtml(text) : text
  return DOMPurify.sanitize(finalHTML, {
    FORBID_ATTR: ['style', 'onerror', 'onload'],
    FORBID_TAGS: [
      'table',
      'script',
      'audio',
      'video',
      'style',
      'iframe',
      'object',
      'embed',
      'textarea',
      'frame',
      'frameset',
    ],
  })
}
