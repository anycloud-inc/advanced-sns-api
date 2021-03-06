# advanced-sns

## Setup

### Dockerのセットアップ

```sh
# クローン
git clone https://github.com/anycloud-inc/advanced-sns.git
or 
git clone git@github.com:anycloud-inc/advanced-sns.git

# リポジトリに移動
cd advanced-sns

# Copy Environment Variable
cp advanced-sns-api/.env.sample advanced-sns-api/.env

# Install docker-sync
sudo gem install docker-sync

# Start containers
make docker-up

```

※ `Install unison for you? [y/N]` の無限ループが生じた場合、`Ctrl + C`してからリトライするとループがなくなる。

※ `Fatal error: No file monitoring helper program found` が出た場合は `brew unlink unox && brew link unox` で解決できる。場合によって`brew reinstall unison`も必要。

### Setup API Server

```sh
# Install dependencies
docker-compose exec api yarn install

# Run migration
docker-compose exec api yarn typeorm migration:run
```

http://localhost:3000/
にアクセスして、OKと表示されれば環境構築が完了

## APIドキュメント
https://anycloud-inc.github.io/advanced-sns-openapi/document.html
