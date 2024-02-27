![Pixel Profile](.github/img/card.png)
**Pixel Profile**: Generate pixel art profiles from your GitHub data

> This Pixel Profile project would not have been possible without these amazing projects:
> 
> [Github Readme Stats](https://github.com/anuraghazra/github-readme-stats): One of the best tools out there for generating awesome Github stats cards.
> 
> [resvg-js](https://github.com/yisibl/resvg-js): A high-performance SVG renderer and toolkit.
>
> [Satori](https://github.com/vercel/satori): An enlightened library to convert HTML and CSS to SVG.
> 
> [Jubilee](https://ko-fi.com/8pxl) A truly unmatched pixel artist! ❤️

## Overview

You can easily generate a Github stats card with default styling using the following link:
```html
<!--Replace <username> with your own GitHub username.-->
https://pixel-profile.vercel.app/api/github-stats?username=<username>
```
![Default Github Stats Card](.github/img/default-github-stats.png)

Of course, you can customize the styling to better suit your preferences. For example, here is a stats card designed for GitHub's Dark Theme::
```html
https://pixel-profile.vercel.app/api/github-stats?username=LuciNyan&screen_effect=true&theme=rainbow
```
This is what it looks like in use in a README:

![Demo 1](.github/img/demo-1.png)

If you want to include a GitHub stats card in your own README file and have it display the appropriate card for both the light and dark themes on GitHub, you can refer to the following configuration and configure your preferred theme, or fully customize elements like color, background, screen effects, etc:

```md
<picture decoding="async" loading="lazy">
  <source media="(prefers-color-scheme: light)" srcset="https://pixel-profile.vercel.app/api/github-stats?username=LuciNyan&theme=summer">
  <source media="(prefers-color-scheme: dark)" srcset="https://pixel-profile.vercel.app/api/github-stats?username=LuciNyan&screen_effect=true&theme=blue_chill">
  <img alt="github stats" src="https://pixel-profile.vercel.app/api/github-stats?username=LuciNyan&theme=summer">
</picture>
```

[Here](https://github.com/LuciNyan) is a ready-made example configuration you can reference if you need inspiration for your own config.

## Documentation
### Themes
Below are some prebuilt themes to get started. However, cards are fully customizable by passing in background and color props. Feel free to ditch the premade themes and design unique cards by selecting your own colors and backgrounds!
#### 1. Journey without pixelated avatar.
![Journey](./packages/pixel-profile/test/__image_snapshots__/theme-test-ts-packages-pixel-profile-test-theme-test-ts-theme-render-card-with-journey-theme-1-snap.png)
```html
https://pixel-profile.vercel.app/api/github-stats?username=LuciNyan&theme=journey&pixelate_avatar=false
```

#### 2. Road trip without pixelated avatar.
![Road Trip](./packages/pixel-profile/test/__image_snapshots__/theme-test-ts-packages-pixel-profile-test-theme-test-ts-theme-render-card-with-road-trip-theme-1-snap.png)
```html
https://pixel-profile.vercel.app/api/github-stats?username=LuciNyan&theme=road_trip&pixelate_avatar=false
```

#### 3. Fuji without pixelated avatar.
![Fuji](./packages/pixel-profile/test/__image_snapshots__/theme-test-ts-packages-pixel-profile-test-theme-test-ts-theme-render-card-with-fuji-theme-1-snap.png)
```html
https://pixel-profile.vercel.app/api/github-stats?username=LuciNyan&theme=fuji&pixelate_avatar=false
```

#### 4. Rainbow without pixelated avatar.
![Rainbow](./packages/pixel-profile/test/__image_snapshots__/theme-test-ts-packages-pixel-profile-test-theme-test-ts-theme-render-card-with-rainbow-theme-1-snap.png)
```html
https://pixel-profile.vercel.app/api/github-stats?username=LuciNyan&theme=rainbow&pixelate_avatar=false
```

#### 5. Monica.
![Monica](./packages/pixel-profile/test/__image_snapshots__/theme-test-ts-packages-pixel-profile-test-theme-test-ts-theme-render-card-with-monica-theme-1-snap.png)
```html
https://pixel-profile.vercel.app/api/github-stats?username=LuciNyan&theme=monica
```

#### 6. Summer.
![Summer](./packages/pixel-profile/test/__image_snapshots__/theme-test-ts-packages-pixel-profile-test-theme-test-ts-theme-render-card-with-summer-theme-1-snap.png)
```html
https://pixel-profile.vercel.app/api/github-stats?username=LuciNyan&theme=summer
```

#### 7. Lax.
![Lax](./packages/pixel-profile/test/__image_snapshots__/theme-test-ts-packages-pixel-profile-test-theme-test-ts-theme-render-card-with-lax-theme-1-snap.png)
```html
https://pixel-profile.vercel.app/api/github-stats?username=LuciNyan&theme=lax
```

#### 8. Serene without pixelated avatar.
![Serene](./packages/pixel-profile/test/__image_snapshots__/theme-test-ts-packages-pixel-profile-test-theme-test-ts-theme-render-card-with-serene-theme-1-snap.png)
```html
https://pixel-profile.vercel.app/api/github-stats?username=LuciNyan&theme=serene&pixelate_avatar=false
```

### Github Stats Card Options

| Name                  | Description                                                                                                                                           | Default value |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| `background`          | Set background color/image. Supports a subset of CSS background property values                                                                       | `#434343`     |
| `color`               | Set text color to any valid CSS color value                                                                                                           | `white`       |
| `hide`                | Hide specific stats or elements by passing a comma-separated list. Valid keys: 'avatar', 'commits', 'contributions', 'issues', 'prs', 'rank', 'stars' |               |
| `include_all_commits` | Count all commits                                                                                                                                     | `false`       |
| `pixelate_avatar`     | Apply pixelation to avatar                                                                                                                            | `true`        |
| `screen_effect`       | Enable curved screen effect                                                                                                                           | `false`       |
| `username`            | GitHub username                                                                                                                                       | ''            |
| `theme`               | Check out the built-in themes below                                                                                                                   | ''            |

### Hiding individual stats

You can pass a query parameter `&hide=` to hide any specific stats with comma-separated values.

> Options: `&hide=avatar,commits,contributions,issues,prs,rank,stars`
```html
<!--Replace <username> with your own GitHub username.-->
https://pixel-profile.vercel.app/api/github-stats?username=<username>&hide=avatar,stars
```
![Hiding individual stats](.github/img/sample-github-stats-with-hidden-stats.png)

## Deploy on your own

### 1. Deploy on Vercel
The GitHub API has a rate limit of 5k requests per hour. So my https://pixel-profile.vercel.app/api setup could potentially hit that cap. By self-hosting it on Vercel, you eliminate that concern. Simply click "Deploy" to begin seamlessly hosting your own instance!

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/LuciNyan/pixel-profile)

### 2. Creating a Personal Access Token
To use this tool to retrieve user statistics, you'll need to generate a Personal Access Token (PAT) with the proper scopes.

Click [here](https://github.com/settings/tokens/new) to create a new PAT.

Under "Select scopes" check the box for "repo" and "user" like in the image below:

![Image of selecting repo scope for PAT](.github/img/select-scopes.png)

Copy the generated PAT for use in the config file or as an environment variable.

### 3. Using the PAT with Vercel
Once you have generated a Personal Access Token (PAT) from your GitHub account, you'll need to add it to your Vercel project configuration in order to authenticate API requests.

To add the PAT to Vercel:

![Image of adding env step 1](.github/img/add-env-step-1.png)

![Image of adding env step 2](.github/img/add-env-step-2.png)

## Contribute
The layout in this project is entirely done with JSX, so developing it is almost no different than a normal React project. This means anyone can easily create new cards with very little effort. If you have any ideas, feel free to contribute them here! ❤️

### Running Locally
Follow these 4 easy steps to get `pixel-profile` running on your local machine:

#### 1. Install dependencies
```shell
pnpm install
```

#### 2. Generate a Personal Access Token (PAT)
Refer to the "Creating a Personal Access Token" section above.

#### 3. Create a .env file
Use .env.example as a guide to set your environment variables.
```markdown
PAT_1=xxxxxxx
```

#### 4. Run! 🚀
```shell
pnpm start
```

### TODO
- [X] Github stats card.
- [ ] Github repo card.
- [ ] Leetcode stats card.

## Author

- [LuciNyan](https://github.com/LuciNyan)

&nbsp;

<a aria-label="Vercel logo" href="https://vercel.com">
  <img src="https://badgen.net/badge/icon/Made%20with%20Love?icon=zeit&label&color=black&labelColor=black">
</a>
