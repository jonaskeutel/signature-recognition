var DTW = require('dtw');
var dtwManhattan = new DTW({distanceMetric: 'manhattan'});
var dtwEuclidean = new DTW({distanceMetric: 'euclidean'});
var dtwSquaredEuclidean = new DTW({distanceMetric: 'squaredEuclidean'});

console.log(dtwSquaredEuclidean.compute([1,null,null],[null,2,null,null]))
//
// const LENGTH = 100;
//
// // var a0 = [1, 10, 100];
// // var a0normalized = normalize(a0);
// // var a1 = [1,2,3,4,5];
// // var a2 = [2,3,4,5,6];
// var a1 = [null,null,null];
// // var a1 = [1,2,3,3.5,4,4.5,5];
// var a2 = [null,null];
//
// var a1n = norm(a1);
// var a2n = norm(a2);
//
//
// for (var i = 0; i < 100; i++) {
//     a1[i] = i;
//     a2[i] = i/2 + 5;
//     a2[100+i] = 50 + i/2 + 5;
// }
// //
// // for (var i = 0; i < a2.length; i++) {
// //     console.log(a2[i]);
// // }
//
// // normalizeLinear([1,2,3]);
// console.log("Comparing arrays: ");
// printArray(a1);
// printArray(a2);
// console.log("##########");
// console.log("dtwEuclidean, unchanged: " + dtwEuclidean.compute(a1, a2));
// console.log("dtwSquaredEuclidean, unchanged: " + dtwSquaredEuclidean.compute(a1, a2));
// console.log("dtwManhattan, unchanged: " + dtwManhattan.compute(a1, a2));
// console.log("dtwEuclidean, linear interpolated: " + dtwEuclidean.compute(normalizeLinear(a1), normalizeLinear(a2)));
// console.log("dtwSquaredEuclidean, linear interpolated: " + dtwSquaredEuclidean.compute(normalizeLinear(a1), normalizeLinear(a2)));
// console.log("dtwManhattan, linear interpolated: " + dtwManhattan.compute(normalizeLinear(a1), normalizeLinear(a2)));
// console.log("dtwEuclidean, linear interpolated / length: " + dtwEuclidean.compute(normalizeLinear(a1), normalizeLinear(a2)) / LENGTH);
// console.log("dtwSquaredEuclidean, linear interpolated / length: " + dtwSquaredEuclidean.compute(normalizeLinear(a1), normalizeLinear(a2)) / LENGTH);
// console.log("dtwManhattan, linear interpolated / length: " + dtwManhattan.compute(normalizeLinear(a1), normalizeLinear(a2)) / LENGTH);
// console.log("dtwEuclidean, min normalized: " + dtwEuclidean.compute(norm(a1), norm(a2)));
// console.log("dtwSquaredEuclidean, min normalized: " + dtwSquaredEuclidean.compute(norm(a1), norm(a2)));
// console.log("dtwManhattan, min normalized: " + dtwManhattan.compute(norm(a1), norm(a2)));
// console.log("dtwEuclidean, both normalized / length: " + dtwEuclidean.compute(normalizeLinear(norm(a1)), normalizeLinear(norm(a2))) / LENGTH);
// console.log("dtwSquaredEuclidean, both normalized / length: " + dtwSquaredEuclidean.compute(normalizeLinear(norm(a1)), normalizeLinear(norm(a2))) / LENGTH);
// console.log("dtwManhattan, both normalized / length: " + dtwManhattan.compute(normalizeLinear(norm(a1)), normalizeLinear(norm(a2))) / LENGTH);
//
//
// function norm(a) {
//     var min = Math.min.apply(null, a);
//     return a.map(function(num) {return num - min});
// }
//
// function normalizeLinear(a) {
//     var normalized = [];
//     var startIndex = 0;
//     var endIndex = 0;
//     // console.log("Normalize array of length " +  a.length);
//     for (var i = 0; i < a.length - 1; i++) {
//         var startValue = a[i];
//         var endValue = a[i+1];
//         endIndex = Math.floor(((i+1) / (a.length - 1)) * LENGTH - 1);
//         // console.log("should interpolate between index " + startIndex + " with value " + startValue + " and index " + endIndex + " with value " + endValue );
//         for (var j = startIndex; j <= endIndex; j++) {
//             normalized[j] = startValue + ((j-startIndex) / (endIndex - startIndex)) * (endValue - startValue);
//             // console.log(normalized[j]);
//         }
//         startIndex = endIndex;
//     }
//     return normalized;
// }
//
// function printArray(a) {
//     res = "";
//     for (var i = 0; i < a.length; i++) {
//         res += a[i] + ", ";
//     }
//     console.log(res.substring(0, res.length - 2));
// }
