/**
 * This file encapsulates the dtw slicing approach.
 * It exports the according methods to be called from the evaluation.js file.
 * It applies slicing to the (normalized) values of a feature
 * and applies dtw on these slices.
 * It returns a final distance value for the two compared series.
 */

'use strict'

// Configutation parameters
const INDEX_MAX_THRESHOLD = 40
const INDEX_MIN_THRESHOLD = 3
const EXTREMA_GRANULARITY = '1'

module.exports = {
	computeDTWResult: computeDTWResult,
  getExtrema: prepare_slicing // only exported for testing the dtw slicing algorithm with the test_evaluation.js, not needed for the frontend
}

var DTW = require('dtw')
var dtw = new DTW()

function arrayMin(arr) { return Math.min.apply(Math, arr) }

function computeDTWResult(normalizedNew, normalizedSaved) {
  try {
  	var result = compute_slicing_result(normalizedNew, normalizedSaved)
		return result
  }
  catch(err) {
    return false
  }
}

function compute_slicing_result(s, t) {
	// Remove 'undefined' values because they would deliver wrong results
	s = s.filter(function(n){ return n != undefined })
	t = t.filter(function(n){ return n != undefined })

	// Determine extrema for both series s & t
	var extrema_s = prepare_slicing(s)
	var extrema_t = prepare_slicing(t)
	if (extrema_s.minlist.length == 0 && extrema_s.maxlist.length == 0 &&
		extrema_t.minlist.length == 0 && extrema_t.maxlist.length == 0) {
			// Return false if extrema could not be determined
		return false
	}

	// Map extrema to each other (first minumum to minimum, then maximum to maximum) and only keep the mapped extrema, reject the other extrema.
	var mapped_extrema_minlists = map_extrema_lists(extrema_s.minlist, extrema_t.minlist)
	extrema_s.minlist = mapped_extrema_minlists[0]
	extrema_t.minlist = mapped_extrema_minlists[1]
	var mapped_extrema_maxlists = map_extrema_lists(extrema_s.maxlist, extrema_t.maxlist)
	extrema_s.maxlist = mapped_extrema_maxlists[0]
  extrema_t.maxlist = mapped_extrema_maxlists[1]
	// Check if the extrema appear in a predefined distance to each other (INDEX_MAX_THRESHOLD, INDEX_MIN_THRESHOLD), clean up if not.
	var cleaned_extrema_minlists = clean_up_lists(extrema_s.minlist, extrema_t.minlist)
	extrema_s.minlist = cleaned_extrema_minlists[0]
	extrema_t.minlist = cleaned_extrema_minlists[1]
	var cleaned_extrema_maxlists = clean_up_lists(extrema_s.maxlist, extrema_t.maxlist)
	extrema_s.maxlist = cleaned_extrema_maxlists[0]
	extrema_t.maxlist = cleaned_extrema_maxlists[1]
	// Determine the cutting points for obtaining the slices. Check if the extrema appear in chronological order (to determine correct slices), clean up if not.
	var cutting_points = determine_cutting_points(extrema_s, extrema_t)

	// Calculate and return the costs for the series considering/comparing the slices (apply dtw to slices)
	var costs = calculate_costs(s, t, cutting_points)

	return costs
}

function prepare_slicing(values) {
	// Extrema function

	var extrema = function(values, eps) {
	    // Make y enumerated and define x = 1, 2, 3, ...
	    var x, y;
	    y = enumerate(values);
	    x = Object.keys(y).map(Math.floor);
	    // Call extremaXY version
	    var res = extremaXY(x, y, eps);
	    res.minlist = res.minlist.map(function(val) {
	        var index = Math.floor((val[1] + val[0]) / 2);
	        return Object.keys(values)[index];
	    });
	    res.maxlist = res.maxlist.map(function(val) {
	        var index = Math.floor((val[1] + val[0]) / 2);
	        return Object.keys(values)[index];
	    });

	    return {minlist: res.minlist, maxlist: res.maxlist};
	}

	var extremaXY = function(x, y, eps) {
	        // Declare local variables
	        var n, s, m, M, maxlist, minlist, i, j;
	        // Define x & y enumerated arrays
	        var enumerate = function(obj) {
	            var arr = [];
	            var keys = Object.keys(obj);
	            for (var k = 0; k < keys.length; k++) {
	                arr[k] = obj[keys[k]];
	            }
	            return arr;
	        }
	        y = enumerate(y);
	        x = enumerate(x);
	        // Set initial values
	        n = y.length;
	        s = 0;
	        m = y[0];
	        M = y[0];
	        maxlist = [];
	        minlist = [];
	        i = 1;
	        if (typeof eps == "undefined") {
	            eps = 0.1;
	        }
	        // The algorithm for finding extrema
	        while (i < n) {
	            if (s == 0) {
	                if (!(M - eps <= y[i] && y[i] <= m + eps)) {
	                    if (M - eps > y[i]) {
	                        s = -1;
	                    }
	                    if (m + eps < y[i]) {
	                        s = 1;
	                    }
	                }
	                M = Math.max(M, y[i]);
	                m = Math.min(m, y[i]);
	            }
	            else {
	                if (s == 1) {
	                    if (M - eps <= y[i]) {
	                        M = Math.max(M, y[i]);
	                    }
	                    else {
	                        j = i - 1;
	                        while(y[j] >= M - eps) {
	                            j--;
	                        }
	                        maxlist.push( [x[j], x[i]] );
	                        s = -1;
	                        m = y[i];
	                    }
	                }
	                else {
	                    if(s == -1) {
	                        if(m + eps >= y[i]) {
	                            m = Math.min(m, y[i]);
	                        }
	                        else {
	                            j = i - 1;
	                            while(y[j] <= m + eps) {
	                                j--;
	                            }
	                            minlist.push( [x[j], x[i]] );
	                            s = 1;
	                            M = y[i];
	                        }
	                    }
	                }
	            }
	            i++;
	        }

	        return {minlist: minlist, maxlist: maxlist};
	    }

	    // Helper to make an array or object an enumerated array
	    var enumerate = function(obj) {
	        var arr = [];
	        var keys = Object.keys(obj);
	        for (var k = 0; k < keys.length; k++) {
	            arr[k] = obj[keys[k]];
	        }
	        return arr;
	}

	values = values.filter(function(n){ return n != undefined })
	var extrema = extrema(values, EXTREMA_GRANULARITY)

	extrema.minlist = extrema.minlist.filter(function(n){ return n != undefined })
	extrema.maxlist = extrema.maxlist.filter(function(n){ return n != undefined })

	for(var i = 0; i < extrema.minlist.length; i++) extrema.minlist[i] = parseInt(extrema.minlist[i])
	for(var i = 0; i < extrema.maxlist.length; i++) extrema.maxlist[i] = parseInt(extrema.maxlist[i])

	return extrema
}

function map_extrema_lists(list_s, list_t) {
	if (list_s.length > 1 && list_t.length > 1) {
		var cost_intervals = dtw.compute(list_s, list_t);
	  var path = dtw.path();
	  var new_list_s = [];
	  var new_list_t = [];
	  if (list_s.length <= list_t.length) {
	    for (var i = 0; i < path.length; i++) {
        if (i < path.length-1 && path[i][0] == path[i+1][0]) {
          var indices = []
          for (var j = i; j < path.length; j++) {
            if (path[i][0] == path[j][0]) {
              indices.push(path[j][1]);
            }
          }
          var distances = []
          for (var k = 0; k < indices.length; k++) {
            var local_distance = Math.abs(list_s[path[i][0]] - list_t[indices[k]]);
            distances.push(local_distance);
          }
          var min = arrayMin(distances);
          var index = indices[distances.indexOf(min)];

          new_list_s.push(list_s[path[index][0]]);
          new_list_t.push(list_t[path[index][1]]);
          i = i + indices.length
        } else {
          new_list_s.push(list_s[path[i][0]]);
          new_list_t.push(list_t[path[i][1]]);
        }
	    }
	  } else if (list_t.length < list_s.length) {
	    for (var i = 0; i < path.length; i++) {
        if (i < path.length-1 && path[i][1] == path[i+1][1]) {
          var indices = []
          for (var j = i; j < path.length; j++) {
            if (path[i][1] == path[j][1]) {
              indices.push(path[j][0]);
            }
          }
          var distances = []
          for (var k = 0; k < indices.length; k++) {
            var local_distance = Math.abs(list_s[indices[k]] - list_t[path[i][1]]);
            distances.push(local_distance);
          }
          var min = arrayMin(distances);
          var index = indices[distances.indexOf(min)];

          new_list_s.push(list_s[path[index][0]]);
          new_list_t.push(list_t[path[index][1]]);
          i = i + indices.length
        } else {
          new_list_s.push(list_s[path[i][0]]);
          new_list_t.push(list_t[path[i][1]]);
        }
      }
	  }
	  return [new_list_s, new_list_t]
	} else if (list_s.length == 1 && list_t.length == 1) {
		return [[list_s[0]], list_t[0]]
	} else {
		return [[],[]]
	}
}

function clean_up_lists(list_s, list_t) {
	var rejected_s = []
	var rejected_t = []
	for (var i = 0; i < list_s.length; i++) {
	  if (Math.abs(list_s[i] - list_t[i]) > INDEX_MAX_THRESHOLD) {
	    rejected_s.push(list_s[i])
	    rejected_t.push(list_t[i])
	  }
	}

	for (var i = 0; i < rejected_s.length; i++) {
	  list_s.splice(list_s.indexOf(rejected_s[i]), 1)
	  list_t.splice(list_t.indexOf(rejected_t[i]), 1)
	}

	return [list_s, list_t]
}

function determine_cutting_points(extrema_s, extrema_t) {
	var min_minlists = arrayMin(extrema_s.minlist.concat(extrema_t.minlist));
	var min_maxlists = arrayMin(extrema_s.maxlist.concat(extrema_t.maxlist));
	var cutting_points = undefined

	if (min_minlists < min_maxlists) {
		cutting_points = cutting_points_for_lists(extrema_s.minlist, extrema_s.maxlist, extrema_t.minlist, extrema_t.maxlist)
	} else {
		cutting_points = cutting_points_for_lists(extrema_s.maxlist, extrema_s.minlist, extrema_t.maxlist, extrema_t.minlist)
	}
	return cutting_points
}

function cutting_points_for_lists(list_s1, list_s2, list_t1, list_t2) {
	var points_s = []
	var points_t = []
	if (list_s1.length > 0 && list_t1.length > 0) {
		points_s.push(list_s1[0])
		points_t.push(list_t1[0])
	}
	if (list_s2.length > 0 && list_t2.length > 0 &&
		(Math.abs(list_s2[0] - points_s[points_s.length - 1]) > INDEX_MIN_THRESHOLD) &&
		(Math.abs(list_t2[0] - points_t[points_t.length - 1]) > INDEX_MIN_THRESHOLD)) {
		points_s.push(list_s2[0])
		points_t.push(list_t2[0])
	}
	for (var i = 1; i < Math.max(list_s1.length, list_t1.length, list_s2.length, list_t2.length); i++) {
		if ((list_s1[i] != undefined) &&
				(list_t1[i] != undefined) &&
				(list_s1[i] > points_s[points_s.length - 1]) &&
				(list_t1[i] > points_t[points_t.length - 1]) &&
				(Math.abs(list_s1[i] - points_s[points_s.length - 1]) > INDEX_MIN_THRESHOLD) &&
				(Math.abs(list_t1[i] - points_t[points_t.length - 1]) > INDEX_MIN_THRESHOLD)) {
					points_s.push(list_s1[i])
					points_t.push(list_t1[i])
		} else if ((list_s1[i + 1] != undefined) &&
				(list_t1[i + 1] != undefined) &&
				(list_s1[i + 1] > points_s[points_s.length - 1]) &&
				(list_t1[i + 1] > points_t[points_t.length - 1]) &&
				(Math.abs(list_s1[i + 1] - points_s[points_s.length - 1]) > INDEX_MIN_THRESHOLD) &&
				(Math.abs(list_t1[i + 1] - points_t[points_t.length - 1]) > INDEX_MIN_THRESHOLD) &&
				(list_s1[i + 1] < list_s2[i]) &&
				(list_t1[i + 1] < list_t2[i])) {
					points_s.push(list_s1[i + 1])
					points_t.push(list_t1[i + 1])
		}
		if ((list_s2[i] != undefined) &&
				(list_t2[i] != undefined) &&
				(list_s2[i] > points_s[points_s.length - 1]) &&
				(list_t2[i] > points_t[points_t.length - 1]) &&
				(Math.abs(list_s2[i] - points_s[points_s.length - 1]) > INDEX_MIN_THRESHOLD) &&
				(Math.abs(list_t2[i] - points_t[points_t.length - 1]) > INDEX_MIN_THRESHOLD)) {
					points_s.push(list_s2[i])
					points_t.push(list_t2[i])
		} else if ((list_s2[i + 1] != undefined) &&
				(list_t2[i + 1] != undefined) &&
				(list_s2[i + 1] > points_s[points_s.length - 1]) &&
				(list_t2[i + 1] > points_t[points_t.length - 1]) &&
				(Math.abs(list_s2[i + 1] - points_s[points_s.length - 1]) > INDEX_MIN_THRESHOLD) &&
				(Math.abs(list_t2[i + 1] - points_t[points_t.length - 1]) > INDEX_MIN_THRESHOLD) &&
				(list_s2[i + 1] < list_s1[i]) &&
				(list_t2[i + 1] < list_t1[i])) {
					points_s.push(list_s2[i + 1])
					points_t.push(list_t2[i + 1])
		}
	}
	return [points_s, points_t]
}

function calculate_costs(s, t, cutting_points) {
	var sum = 0
	var costs = undefined
	for (var i = 0; i < cutting_points[0].length - 1; i++) {
	  var s_slice = s.slice(cutting_points[0][i], cutting_points[0][i+1])
	  var t_slice = t.slice(cutting_points[1][i], cutting_points[1][i+1])
	  costs = dtw.compute(s_slice, t_slice)
	  sum = sum + costs
	}

	return sum
}
