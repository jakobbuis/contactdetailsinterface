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

        hasMembers: function() {
            return this.data.count > 0;
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

            // Add gendering explanation
            this.data = this.data.map(function(){
                var map = {
                    M: 'man',
                    F: 'vrouw',
                };
                this.genderName = map[this.gender];
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
        }
    };
})();
