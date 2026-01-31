import { parseCrtOutputs, parseOutputs } from './parseOutputs'
import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'
import { fetchStats, renderCrtStats, renderStats } from 'pixel-profile'
import { parseArray, parseBoolean, parseString } from 'pixel-profile-utils'

async function main() {
  try {
    const githubToken = process.env.GITHUB_TOKEN ?? core.getInput('github_token')

    // Process regular stats outputs
    const outputs = parseOutputs(core.getMultilineInput('outputs'))

    for (const option of outputs) {
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

      const renderOptions = {
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

      const result = await renderStats(stats, renderOptions)

      console.log(`💾 writing to ${filename}`)
      fs.mkdirSync(path.dirname(filename), { recursive: true })
      fs.writeFileSync(filename, new Uint8Array(result))
    }

    // Process CRT stats outputs
    const crtOutputs = parseCrtOutputs(core.getMultilineInput('crt_outputs'))

    for (const option of crtOutputs) {
      if (option === null) continue

      const { username, exclude_repo, include_all_commits, filename } = option

      const includeAllCommits = parseBoolean(include_all_commits)

      const stats: Parameters<typeof renderCrtStats>[0] = await fetchStats(
        typeof username === 'string' ? username : '',
        includeAllCommits,
        parseArray(exclude_repo),
        false,
        false,
        false,
        githubToken
      )

      const crtOptions = {
        includeAllCommits,
        isFastMode: false
      }

      const result = await renderCrtStats(stats, crtOptions)

      console.log(`💾 writing CRT stats to ${filename}`)
      fs.mkdirSync(path.dirname(filename), { recursive: true })
      fs.writeFileSync(filename, new Uint8Array(result))
    }
  } catch (e: any) {
    core.setFailed(`Action failed with "${e.message}"`)
  }
}

main()
