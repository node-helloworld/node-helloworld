# What is node-helloworld?

It is a project containing a simple node.js application. It is mainly intended for testing by external tooling, but the application does work.

## Releasing

Get the latest version of [release.sh](https://github.com/node-helloworld/node-helloworld/blob/master/release.sh) by cloning repository or downloading it.

You will need your GitHub token that is used to access the GitHub APIs. It can be retrieved from the [Personal access tokens](https://github.com/settings/tokens) page.

The script also needs to be able to clone the repository (it uses a fresh copy to avoid issues with stale commit being released) so `git` has to be available and be able to clone the repository from GitHub.

In order to make the release simply run:

```bash
export GITHUB_TOKEN=(your-token)
./release.sh "1.2.3" "Touching Tagline"
```

This will create a release of version `1.2.3` with _Touching Tagline_ name.

You can also release forked repositories by setting `GITHUB_OWNER` environment variable - such as:

```bash
GITHUB_OWNER=(yourname) ./release.sh "1.2.3" "Forked Fate"
```
