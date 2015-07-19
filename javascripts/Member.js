/**
 * Model for the Member-class
 * Caution: singleton
 */
var Member = (function () {

    /**
     * "Data-store" for member data
     * @type {Array}
     */
    var data = [];

    /*
     * Public interface
     */
    return {

        /**
         * Return whether the data is loaded
         * @return {Boolean} true if filled with members
         */
        hasMembers: function() {
            return this.data.length > 0;
        },

        /**
         * Store data in the store, sorted by name
         * @param  {Array} members the array of member data from people
         */
        loadData: function(members) {
            // Store the data
            this.data = $(members);

            // Sort by first name
            this.data = this.data.sort(function(a,b){
                return a.firstname.toLowerCase() > b.firstname.toLowerCase() ? 1 : -1;
            });

            // Customize the data for our purposes
            this.data = this.data.map(function(){
                // Add a full gender name
                var map = {
                    M: 'man',
                    F: 'vrouw',
                };
                this.genderName = map[this.gender];

                // Add an operculum toggle
                this.operculum = false;

                return this;
            });
        },

        /**
         * Return the data-set of a member
         * @param  {String} uid the user ID of the member
         * @return {Array}      the data of the member or null if not present
         */
        get: function (uid) {
            return this.data.filter(function(){
                return this.uid === uid;
            }).first()[0];
        },

        /**
         * Find a subset of all members that match a criterium
         * @param  {String} query         name to search for
         * @param  {Boolean} members_only whether to return only full members and candidate members
         * @return {Array}                members objects
         */
        search: function(query, members_only) {
            var data = this.data;

            // Filter name by query
            data = data.filter(function(){
                return (this.name.toLowerCase().indexOf(query) !== -1);
            })

            // Filter on membership if needed
            if (members_only) {
                data = data.filter(function(){
                    return (this.membership === 'lid' || this.membership === 'kandidaatlid');
                });
            }

            return data;
        },

        /**
         * Whether the extended operculum data is present for a user
         * @param  {String}  uid
         * @return {Boolean}     true if loaded
         */
        hasExtendedData: function(uid) {
            for (var i = this.data.length - 1; i >= 0; i--) {
                if (this.data[i].uid === uid) {
                    return this.data[i].operculum === true;
                }
            };
        },

        /**
         * Adds extended (operculum) data to the storage
         * @param {String} uid  uid of the user
         * @param {Array} data  extended data from operculum
         */
        addExtendedData: function(uid, data) {
            for (var i = this.data.length - 1; i >= 0; i--) {
                if (this.data[i].uid === uid) {
                    $.extend(this.data[i], data);
                    this.data[i].operculum = true;
                    return;
                }
            };
        },
    };
})();
