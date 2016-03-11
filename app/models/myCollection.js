exports.definition = {
	config: {
		columns: {
			id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
			uid: 'TEXT',
			testDate: 'TEXT',
			image: 'TEXT',
		},
		defaults: {
		},
		adapter: {
			type: 'sql',
			collection_name: 'myCollection',
			idAttribute: 'id'
		}
	},
	
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// transform : function transform() {
				// var transformed = this.toJSON();
				// transformed.artist = transformed.artist.toUpperCase();
				// return transformed;
			// }
		});
		return Model;
	},
	
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {

			// For Backbone v1.1.2, uncomment this to override the fetch method
			/*
			fetch: function(options) {
				options = options ? _.clone(options) : {};
				options.reset = true;
				return Backbone.Collection.prototype.fetch.call(this, options);
			}
			*/
			initialize: function () {
                //*** Default sort field.  Replace with your own default.
                this.sortField = "testDate";
                //*** Default sort direction
                this.sortDirection = "DESC";
            },
            //*** Use setSortField to specify field and direction before calling sort method
            setSortField: function (field, direction) {
                this.sortField = field;
                this.sortDirection = direction;
            },
 
            comparator: function(collection) {
                return collection.get(this.sortField);
            },
 
            //*** Override sortBy to allow sort on any field, either direction 
            sortBy: function (iterator, context) {
                var obj = this.models;
                var direction = this.sortDirection;
 
                return _.pluck(_.map(obj, function (value, index, list) {
                    return {
                        value: value,
                        index: index,
                        criteria: iterator.call(context, value, index, list)
                    };
                }).sort(function (left, right) {
                    // swap a and b for reverse sort
                    var a = direction === "ASC" ? left.criteria : right.criteria;
                    var b = direction === "ASC" ? right.criteria : left.criteria;
 
                    if (a !== b) {
                        if (a > b || a === void 0) return 1;
                        if (a < b || b === void 0) return -1;
                    }
                    return left.index < right.index ? -1 : 1;
                }), 'value');
            }
		});

		return Collection;
	}
};
