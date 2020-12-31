module.exports = async function (context, req) {
  const rssRead = require('rss-parser')
  const rssWrite = require('rss')
  const urls = [
    'https://qiita.com/tags/powerapps/feed',
    'https://zenn.dev/topics/powerbi/feed',
    'https://dev.to/feed/tag/powerbi/',
    'https://www.google.com/alerts/feeds/13357381248301763516/10433208722293411973',
    // https://blog.feedspot.com/microsoft_power_bi_rss_feeds/
    'https://powerbi.microsoft.com/en-us/blog/feed/',
    'http://powerbi.news/~api/papers/afa21d1c-dc2e-497f-abcb-46a7f45bb824/rss',
    'https://blog.crossjoin.co.uk/feed/',
    'https://exceleratorbi.com.au/feed/',
    'https://www.fourmoo.com/blog/feed/',
    'https://prathy.com/feed/',
    'https://insightsquest.com/category/power-bi/feed/',
    // "https://dataveld.com/feed/", // died
    'https://www.thebiccountant.com/feed/',
    'https://www.kasperonbi.com/feed/',
    'https://www.reddit.com/r/PowerBI/.rss'
  ]

  await Promise.all(urls.map(url => {
    return new Promise((resolve, _reject) => {
      const parser = new rssRead()
      const feed = parser.parseURL(url)
      resolve(feed)
    })
  })).then((feeds) => {
    const sortable = []
    feeds.forEach(feed => {
      feed.items.forEach(item => {
        sortable.push([Date.parse(item.pubDate), item])
      })
    })

    const rss = new rssWrite({
      title: 'Power BI News'
    })
    sortable.sort((a, b) => b[0] - a[0]).forEach(item => {
      rss.item({
        title: item[1].title,
        url: item[1].link,
        date: item[1].pubDate
      })
    })

    context.res = {
      headers: {
        'Content-Type': 'application/rss+xml'
      },
      body: rss.xml()
    }
  })
}
