$(function() {
  $('[type=file]').fileupload({
    add: function(e, data) {
      $.getJSON('/attachments/images/cache/presign', function(result) {
        data.formData = result['fields'];
        data.url = result['url'];
        data.submit();
      });
    },
    done: function(e, data) {
      var image = {
        id: data.formData.key.match(/\w+$/)[0],
        storage: 'cache',
        metadata: {
          size:      data.files[0].size,
          filename:  data.files[0].name,
          mime_type: data.files[0].type
        }
      }

      data = {photo: {image: JSON.stringify(image)}}
      $.ajax("/photos", {method: 'POST', data: data, dataType: 'script'})
    }
  });
});
