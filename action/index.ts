import { parseOutputs } from './parseOutputs'
import { parseArray, parseBoolean, parseString } from './utils'
import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'
import { fetchStats, renderStats } from 'pixel-profile'

async function main() {
  try {
    const githubToken = process.env.GITHUB_TOKEN ?? core.getInput('github_token')

    const options = parseOutputs(core.getMultilineInput('outputs'))

    for (const option of options) {
      if (option === null) continue

      const {
        background,
        color,
        exclude_repo,
        hide,
        include_all_commits,
        pixelate_avatar,
        screen_effect,
        show,
        username,
        theme,
        avatar_border,
        dithering,
        filename
      } = option

      const showStats = parseArray(show)
      const includeAllCommits = parseBoolean(include_all_commits)

      const stats: Parameters<typeof renderStats>[0] = await fetchStats(
        typeof username === 'string' ? username : '',
        includeAllCommits,
        parseArray(exclude_repo),
        showStats.includes('prs_merged') || showStats.includes('prs_merged_percentage'),
        showStats.includes('discussions_started'),
        showStats.includes('discussions_answered'),
        githubToken
      )

      const options = {
        background: parseString(background),
        color: parseString(color),
        hiddenStatsKeys: hide ? parseArray(hide) : undefined,
        includeAllCommits,
        pixelateAvatar: parseBoolean(pixelate_avatar),
        theme: parseString(theme),
        screenEffect: parseBoolean(screen_effect),
        avatarBorder: parseBoolean(avatar_border),
        dithering: parseBoolean(dithering),
        isFastMode: false
      }

      const result = await renderStats(stats, options)

      console.log(`💾 writing to ${filename}`)
      fs.mkdirSync(path.dirname(filename), { recursive: true })
      fs.writeFileSync(filename, result)
    }
  } catch (e: any) {
    core.setFailed(`Action failed with "${e.message}"`)
  }
}

main()
