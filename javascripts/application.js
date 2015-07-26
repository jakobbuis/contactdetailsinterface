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

    // Search field typing triggers search
    $('#search').on('keyup', search);
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

    // Explicit back button
    $('section').on('click', '.back', function(event){
        history.back();
    });

    // Clicking the main header 'resets' the interface
    // as if the user had reloaded
    $('header h1').click(function(){
        $('#members_only').prop('checked', true);
        $('#search').val('');
        $('#search').trigger('keyup');
    });
});

function search(event)
{
    // If the data isn't ready yet, silently wait for it
    if (! Member.hasMembers()) {
        setTimeout(search, 100, [event]);
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
        timeout: 10000,
        success: function(results) {
            // Store data in models
            Member.loadData(results)

            // Trigger the search field to show all current entries
            $('#search').trigger('keyup');
        },
        error: function() {
            showError('Kan de ledenadministratie niet bereiken.<br><br> \
                        Weet je zeker dat je verbinding met het interne netwerk hebt? \
                        Je bereikt het interne netwerk door te verbinden met Bolknet of de VPN.', true);
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
    var member = Member.get($(this).attr('data-uid'));

    // Check if we need to load extended data
    if (Member.hasExtendedData(member.uid)) {
        // Render the member
        $('section').html(window.templates.form(member));
    }
    else {
        // We need to gather extra data, roll the spinner!
        $('section').html($('<img>').attr('src', config.callback + '/images/spinner.gif'));

        // Load data
        $.ajax({
            type: 'GET',
            url: 'https://operculum.i.bolkhuis.nl/person/'+member.uid+'?access_token='+window.access_token,
            dataType: 'json',
            success: function(result) {
                Member.addExtendedData(member.uid, result);
                $('section').html(window.templates.form(member));
            },
            error: function(result) {
                showError('unknown fatal error');
            }
        });
    }
}

function showError(message, clear_ui)
{
    if (clear_ui === undefined) {
        clear_ui = false;
    }

    if (clear_ui) {
        $('section').html('');
    }
    var error = $('<p>').addClass('error').html(message);
    $('section').prepend(error);
}
