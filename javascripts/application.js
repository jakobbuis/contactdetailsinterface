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
        timer = setTimeout(search, 1000, [event]);
    });
    $('#members_only').on('click', search);
});

function search(event)
{
    // If the data isn't ready yet, silently wait for it
    var data = window.memberData;
    if (data === undefined) {
        setTimeout('search', 100, [event]);
    }

    // Clear UI
    $('section').html('')

    // Search entries
    var query = $('#search').val().toLowerCase();
    var members_only = $('#members_only').prop('checked');

    var matches = $(data).filter(function(){
        var is_match = (this.name.toLowerCase().indexOf(query) !== -1);
        var is_member = (this.membership === 'lid' || this.membership === 'kandidaatlid');

        if (members_only) {
            return (is_match && is_member);
        }
        else {
            return is_match;
        }
    });

    // Insert matches
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
