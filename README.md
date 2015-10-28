# Shrine Rails example

This is a most basic, scaffolded Rails application using Shrine for file uploads.

## Requirements

To run the application you need to setup the following things:

* Install ImageMagick:

  ```rb
  $ brew install imagemagick
  ```

* Install the gems:

  ```rb
  $ bundle install
  ```

* Migrate the database

  ```rb
  $ ./bin/rake db:migrate
  ```

Once you have all of these things set up, you can run the application:

```rb
$ ./bin/rails s
```

[Shrine]: https://github.com/janko-m/shrine