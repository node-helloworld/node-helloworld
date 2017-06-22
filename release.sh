#!/bin/bash

# Helper release script that can be used to automate release and uploading of "binary" versions

set -eu

owner="wojciechka"
repo="node-helloworld"
version=${1:-}
desc=${2:-}
commit=${3:-}
token="${GITHUB_TOKEN}"

mime_type="application/x-gzip"

# trim leading "v" from version
version=$(echo ${version} | sed 's/^v//')

usage() {
  echo "Usage: $0 version (description) (commit-id)"
  exit 1
}

if [ "x${version}" = "x" ] ; then
  echo "Version not supplied"
  usage
fi

if [ "x${desc}" = "x" ] ; then
  desc="Release of version ${version}"
fi

if [ "x${commit}" = "x" ] ; then
  commit="v${version}"
fi

# TODO: check prerequisites
for prereq in git jq curl ; do
  if ! which ${prereq} >/dev/null 2>/dev/null ; then
    echo "Binary ${prereq} not found ; please install it to run the release script"
    exit 1
  fi
done

tmpdir=$(mktemp -d)
tmpfile="${tmpdir}/tempfile"


cleanup() {
  rm -fR ${tmpdir}
}

trap cleanup EXIT

# clone and add appropriate tag
git clone git@github.com:${owner}/${repo}.git ${tmpdir}/clone
cd ${tmpdir}/clone
git tag ${commit} master
commit_id=$(git rev-parse ${commit})
git push --tags

response=$(curl -sSLf -H "Authorization: token ${token}" \
  --data "{\"tag_name\": \"${version}\",\"target_commitish\": \"${commit_id}\",\"name\": \"${version}\",\"body\": \"${desc}\",\"draft\": false,\"prerelease\": false}" \
  "https://api.github.com/repos/${owner}/${repo}/releases")
release_id=$(echo "${response}" | jq -r .id)
release_tgz=$(echo "${response}" | jq -r .tarball_url)
curl -sSLf "${release_tgz}" >${tmpfile}

for platform in linux-x64 ; do
  for distro in debian-8 debian-9 ; do
    asset_name="canary-${version}-${platform}-${distro}.tar.gz"
    response=$(curl -sSLf -H "Authorization: token ${token}" \
      -H "Content-Type: ${mime_type}" --data-binary @${tmpfile} \
      "https://uploads.github.com/repos/${owner}/${repo}/releases/${release_id}/assets?name=${asset_name}")
  done
done
