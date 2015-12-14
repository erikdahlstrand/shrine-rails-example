# Shrine Rails example

This an Rails app demonstrating how easy it is to implement complex file upload
workflow using [Shrine]. The app does direct S3 multiple uploads, with storing
and processing done in background jobs.

## Requirements

To run the app you need to setup the following things:

* Install ImageMagick:

  ```rb
  $ brew install imagemagick
  ```

* Install the gems:

  ```rb
  $ bundle install
  $ gem install foreman
  ```

* Run the migrations

  ```sh
  $ rake db:migrate
  ```

* Put your Amazon S3 credentials in `.env`

  ```sh
  S3_ACCESS_KEY_ID="..."
  S3_SECRET_ACCESS_KEY="..."
  S3_REGION="..."
  S3_BUCKET="..."
  ```

* Install Redis and have it running (for Sidekiq)

Once you have all of these things set up, you can run the app:

```sh
$ foreman start
```

[Shrine]: https://github.com/janko-m/shrine
