$(document).on('ready', function(){

    // Must authenticate to OAuth
    var oauth = new OAuth(config);
    oauth.authenticate(function(access_token){
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

    // The form cannot be submitted
    $('form').on('submit', function(event){
        event.preventDefault();
    })
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
    var template = Handlebars.compile($("#member-template").html());
    matches.each(function(){
        $('section').append(template(this));
    });
}

function loadMemberData()
{
    $.ajax({
        type: 'GET',
        url: 'https://people.i.bolkhuis.nl/persons?access_token='+window.access_token,
        success: function(result) {
            // Sort results by first name
            result = [].sort.call($(result), function(a,b){
                return a.firstname.toLowerCase() > b.firstname.toLowerCase() ? 1 : -1;
            });
            window.memberData = result;
            $('section').html('');
        }
    });
}
