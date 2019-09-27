# Shrine Rails demo

This is a Rails demo for [Shrine]. It allows the user to create albums and
attach images. The demo shows an advanced workflow:

Uploading:

1. User selects one or more files
2. The files get asynchronously uploaded directly to S3 and a progress bar is displayed
3. The cached file data gets written to the hidden fields
4. Once the form is submitted, background jobs are kicked off to process the images
5. The records are saved with cached files, which are shown as fallback
6. Once background jobs are finished, records are updated with processed attachment data

Deleting:

1. User marks photos for deletion and submits
2. Deletion starts in background, and form submits instantly
3. Background job finishes deleting

This asynchronicity generally provides an ideal user experience, because the
user doesn't have to wait for processing or deleting, and due to fallbacks
they can be unaware of background jobs.

Direct uploads and backgrounding also have performance advantages, since your
app doesn't have to receive file uploads (as files are uploaded directly to S3),
and the web workers aren't blocked by processing, storing or deleting.

## Implementation

The demo can upload files directly to S3 (default in production), or they can be
uploaded to the app on stored on disk (default in development and test environment).
See "Upload server modes" below for more info.

The demo features both single and multiple uploads.

On the client side [Uppy] is used for handling file uploads. The complete
JavaScript implementation for the demo can be found in [application.js].

## Requirements

To run the app you need to setup the following things:

* Install ImageMagick:

  ```rb
  $ brew install imagemagick
  ```

* Install the gems:

  ```rb
  $ bundle install
  ```

* Have SQLite installed and run the migrations:

  ```sh
  $ rake db:migrate
  ```

* If you'll be using Amazon S3, run `rails credentials:edit` and put your S3
  credentials, and [setup CORS]:

  ```yaml
  s3:
    access_key_id: "..."
    secret_access_key: "..."
    region: "..."
    bucket: "..."
  ```

Once you have all of these things set up, you can run the app:

```sh
$ rails server
```

## Upload server modes

This demo app is capable of uploading files directly to S3 (using straight
upload or S3 multipart upload), or of uploading to an application action and
storing on local disk.

In all three modes, the file selected in the browser is immediately uploaded by
Javascript to some storage location ("JS direct upload"), and then on form
submit a shrine-compatible hash describing the already-stored file is sent to
the Rails app. Using shrine [cached_attachment_data] and [restore_cached_data]
plugins. The difference is in where the Javascript sends the file, and how.

You can choose which upload server mode to by setting the `UPLOAD_SERVER` env
variable. Otherwise, the default is `s3` in production, and `app` in test and
development.

* `s3`
  * Shrine storages are set to S3.
  * The Uppy [AwsS3] plugin is used to upload files directly to the S3 `cache`
    storage.
  * The shrine [presign_endpoint] plugin is used to support Uppy AwsS3 plugin,
    providing authorized signed S3 URL for upload.
  * This is the default in Rails `production` environment.
* `app`
  * Shrine storages are set to local filesystem, in `./public`.
  * The Uppy [XHRUpload] plugin is used to submit files directly to Rails app.
  * The Shrine [upload_endpoint] plugin is used to provide a local app HTTP
    action to accept the uploads.
  * This is the default in non-production Rails environments (development and
    test).
* `s3_multipart`
  * Shrine storages are set to S3.
  * The Uppy [AwsS3Multipart] plugin is used to upload files directly to the S3
    `cache` storage, using S3's multipart upload strategy. This allows files
    larger than 5GB to be uploaded to S3, and can have other reliability and
    performance advantages from uploading in multiple smaller requests,
    especially for large files even if less than 5GB.
  * The [uppy-s3_multipart] gem, supporting the shrine `uppy_s3_multipart`
    plugin, are used to provide endpoints for the AwsS3Multipart Uppy plugin.
  * This is never the default, but you can have the app use it by setting an
    ENV variable.

So if you would like to use the app with the S3 multipart upload server
strategy, launch the rails app with:

    UPLOAD_SERVER=s3_multipart rails server

## Consider access control

In a real apps, if you only want logged-in users to be able to upload files
directly to your cache storage, you will want to limit access to the signing
and/or file-receiving endpoints in routes.rb. For example, if using devise one
way to do this is:

  ```rb
  authenticate :user do
    mount Shrine.upload_endpoint(:cache) => "/upload"
  end
  ```

## References

* Shrine docs: [Direct Uploads to S3]
* Shrine wiki: [Adding Direct App Uploads]
* Shrine wiki: [Adding Direct S3 Uploads]
* [uppy-s3_multipart] gem
* Janko's Blog: [Better File Uploads with Shrine: Direct Uploads]

[Shrine]: https://github.com/shrinerb/shrine
[setup CORS]: http://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html
[Uppy]: https://uppy.io
[application.js]: /app/javascript/packs/application.js
[cached_attachment_data]: https://github.com/shrinerb/shrine/blob/master/doc/plugins/cached_attachment_data.md#readme
[restore_cached_data]: https://github.com/shrinerb/shrine/blob/master/doc/plugins/restore_cached_data.md#readme
[presign_endpoint]: https://github.com/shrinerb/shrine/blob/master/doc/plugins/presign_endpoint.md#readme
[upload_endpoint]: https://github.com/shrinerb/shrine/blob/master/doc/plugins/upload_endpoint.md#readme
[XHRUpload]: https://uppy.io/docs/xhr-upload/
[AwsS3]: https://uppy.io/docs/aws-s3/
[AwsS3Multipart]: https://uppy.io/docs/aws-s3-multipart/
[uppy-s3_multipart]: https://github.com/janko/uppy-s3_multipart
[Direct Uploads to S3]: https://shrinerb.com/rdoc/files/doc/direct_s3_md.html
[Adding Direct App Uploads]: https://github.com/shrinerb/shrine/wiki/Adding-Direct-App-Uploads
[Adding Direct S3 Uploads]: https://github.com/shrinerb/shrine/wiki/Adding-Direct-S3-Uploads
[Better File Uploads with Shrine: Direct Uploads]: https://twin.github.io/better-file-uploads-with-shrine-direct-uploads/
