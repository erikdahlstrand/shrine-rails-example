//= require jquery
//= require jquery_ujs
//= require jquery-fileupload/vendor/jquery.ui.widget
//= require jquery-fileupload/jquery.iframe-transport
//= require jquery-fileupload/jquery.fileupload
//= require bootstrap
//= require_self

$(function() {
  $('[type=file]').fileupload({
    add: function(e, data) {
      data.progressBar = $('<div class="progress" style="width: 300px"><div class="progress-bar"></div></div>').insertAfter(".form-group");
      var options = {
        extension: data.files[0].name.match(/\.\w+$/)[0], // set extension
        _: Date.now(),                                    // prevent caching
      }
      $.getJSON('/attachments/images/cache/presign', options, function(result) {
        data.formData = result['fields'];
        data.url = result['url'];
        data.submit();
      });
    },
    progress: function(e, data) {
      var progress = parseInt(data.loaded / data.total * 100, 10);
      var percentage = progress.toString() + '%'
      data.progressBar.find(".progress-bar").css("width", percentage).html(percentage);
    },
    done: function(e, data) {
      data.progressBar.remove();

      var image = {
        id: data.formData.key.match(/cache\/(.+)/)[1], // we have to remove the prefix part
        storage: 'cache',
        metadata: {
          size:      data.files[0].size,
          filename:  data.files[0].name.match(/[^\/\\]*$/)[1], // IE returns full path
          mime_type: data.files[0].type
        }
      }

      $.ajax("/album/photos", {method: 'POST', data: {photo: {image: JSON.stringify(image)}}})
        .done(function(data) { $("ul").append(data) })
    }
  });
});
