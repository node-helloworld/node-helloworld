# What is node-helloworld?

It is a project containing a simple node.js application. It is mainly intended for testing by external tooling, but the application does work.

## Releasing

Get the latest version of [release.sh](https://github.com/node-helloworld/node-helloworld/blob/master/release.sh) by cloning repository or downloading it.

After that simply run:

```bash
export GITHUB_TOKEN=(your-token)
./release.sh "1.2.3" "Touching Tagline"
```

This will create a release of version 1.2.3 with "Touching Tagline" name.

You can also release forked repositories by setting `GITHUB_OWNER` environment variable - such as:

```bash
GITHUB_OWNER=(yourname) ./release.sh "1.2.3" "Forked Fate"
```

