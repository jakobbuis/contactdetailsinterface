$(document).on('ready', function(){

    // Must authenticate to OAuth
    var oauth = new OAuth({
        client: 'mead-development',
        secret: 'UTknClCHAZqfYzJNZnjg',
        resource: 'lid',
        callback: 'http://mead.dev'
    });
    oauth.authenticate(function(access_token){
        console.log(access_token);
        if (! access_token === false) {
            window.access_token = access_token;
            $('#search').prop('disabled', false).focus();
            loadMemberData();
        }
    });

    // Search (delayed)
    var timer = 0;
    $('#search').on('keyup', function(event){
        clearTimeout(timer);
        timer = setTimeout(search, 1000, [this, event]);
    });
});

function search(searchInput, event)
{
    // If the data isn't ready yet, silently wait for it
    var data = window.memberData;
    if (data === undefined) {
        setTimeout('search', 100, [event]);
    }

    // Clear UI
    $('section').html('')

    // Search entries
    var query = $(searchInput).val().toLowerCase();
    var matches = $(data).filter(function(){
        return (this.name.toLowerCase().indexOf(query) !== -1);
    });

    // Insert matches
    console.log(matches);
    matches.each(function(){
        $('section').append(memberEntry(this));
    });
}

function loadMemberData()
{
    // Show spinner
    $('section').html('<img src="images/spinner.gif">');

    $.ajax({
        type: 'GET',
        url: 'https://people.i.bolkhuis.nl/persons?access_token='+window.access_token,
        success: function(result) {
            window.memberData = result;
            $('section').html('');
        }
    });
}

function memberEntry(data)
{
    return $('<div>').addClass('member').html('<h2>'+data.name+'</h2>E-mail: <a href="mailto:'+data.email+'">'+data.email+'</a>Telefoon: <a href="tel:'+data.mobile+'">'+data.mobile+'</a>')
}
