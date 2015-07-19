$(document).on('ready', function(){

    // Compile templates
    window.templates = {
        member: Handlebars.compile($("#member-template").html()),
        form: Handlebars.compile($('#form-template').html()),
    };

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
        timer = setTimeout(search, 500, [event]);
    });
    $('#members_only').on('click', search);

    // The form cannot be submitted
    $('form').on('submit', function(event){
        event.preventDefault();
    });

    // Details link handler
    $('section').on('click', '.details', showForm);

    // Pressing back on a detail view shows the search list
    $(window).on('popstate', function(){
        $('#search').trigger('keyup');
    });

    $('section').on('click', '.back', function(event){
        history.back();
    });
});

function search(event)
{
    // If the data isn't ready yet, silently wait for it
    if (! Member.hasMembers()) {
        setTimeout('search', 100, [event]);
    }

    // Gather search parameters
    var query = $('#search').val().toLowerCase();
    var members_only = $('#members_only').prop('checked');

    // Ssearch and display results
    renderMembers(Member.search(query, members_only));
}

function loadMemberData()
{
    $.ajax({
        type: 'GET',
        url: 'https://people.i.bolkhuis.nl/persons?access_token='+window.access_token,
        success: function(results) {
            // Store data in models
            Member.loadData(results)

            // Trigger the search field to show all current entries
            $('#search').trigger('keyup');
        }
    });
}

function renderMembers(set)
{
    $('#search-counter').html('(' + set.length + ')');
    $('section').html('');
    set.each(function() {
        $('section').append(window.templates.member(this));
    })
}

function showForm(event)
{
    // We have custom link behaviour
    event.preventDefault();
    history.pushState(null, null, this.href);

    // Show details page of a member
    var entry = Member.get($(this).attr('data-uid'));
    $('section').html(window.templates.form(entry));
}
