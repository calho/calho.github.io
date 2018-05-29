$.ajax({
    type: 'POST',
    url: '/test'
})
.done(function( data ) {
    $('result').text(data)
})