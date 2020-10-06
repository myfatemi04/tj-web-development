// Michael Fatemi, 2020/09/22, 3:51 PM EDT

/* 
	all problems must use some combination of forEach, map, reduce or filter
*/

// ----------------------------
//   Q.1 
//
// Assuming that x_0 is a 4-D physics vector as defined below, use one of the functions (forEach, map, etc.)  
// that computes the overall magnitude of the vector
let x_0 = [ 0.91,  4.31,  2.10,  0.07];

let magnitude = x => Math.sqrt(x.reduce((acc, elem) => acc + elem * elem));

// => return value must be a single scalar
let x_0_magnitude = magnitude(x_0);

console.log("Magnitude of x_0:", x_0_magnitude);

// ----------------------------
//   Q.2 
//
// Assuming that x is an array of rows of 4-D vectors (as defined below), use some combination of
//  one (forEach, map, reduce, filter) to compute the magnitude vector of each row.
//
// => the result should be an array with 12 elements (i.e. result is an array with one result for each row)

let x = [
   [ 0.91,  4.31,  2.10,  0.07],
   [-1.80, -5.88, -6.16, -0.79],
   [ 1.47, -0.59, -1.06, -5.25],
   [ 2.22, -3.62, -2.47, -0.86],
   [ 5.14,  8.72, -4.73, -2.49],
   [-0.58,  2.48,  1.52, -2.94],
   [-6.42,  4.14,  0.85, -3.47],
   [-2.52, -3.17,  0.10, -1.60],
   [ 4.06, -1.41, -4.00, -6.01],
   [-3.22, -0.82,  3.38,  2.89],
   [ 2.88,  3.30,  1.05,  1.56],
   [ 0.37, -0.83, -0.90, -0.06]
];

let x_magnitudes = x.map(magnitude);
console.log("Magnitudes of x:", x_magnitudes);

// ----------------------------
//   Q.3 
//
// Using x as defined above, define an operation that finds vectors with a magnitude 
//  greater than 8.0 - AND returns the vector, not the magnitude:
//
//  i.e.
//    - compute the magnitude vector for each row as defined in Q.2
//    - return only original vectors that pass the test 
//  
// => the result should be an array with N elements, where each element one of the size 4 physics vectors
let x_greater_than_8 = x.filter(x => magnitude(x) > 8.0);
console.log("Vectors with magnitude greater than 8.0:");
console.log(x_greater_than_8);

// ----------------------------
//   Q.4
//
// Using x as defined above, define an operation that produces an object that contains the magnitude 
// of the largest and smallest vectors as keyed values. The output should look like:
// { max: 12.7, min: 0.04 }
let find_max_min = vector_list => vector_list.reduce((acc, elem) => {

    let current_magnitude = magnitude(elem);
    if (current_magnitude > acc.max) {
        acc.max = current_magnitude;
    }

    if (current_magnitude < acc.min) {
        acc.min = current_magnitude;
    }

    return acc;
}, {max: 0, min: Infinity});

let x_max_min = find_max_min(x);
console.log("Max and min of X:", x_max_min);

// ----------------------------
//   Q.5
//
// Using x as defined above, define an operation that produces an output array 
// that only contains vectors whose magnitude is within the bounds of a parameters object.
//  
// Run twice using the following objects to assist the operation:
//  var params = {'low' : 4.5, 'high' : 8.0 };
//  var params = {'low' : 5.0, 'high' : 6.0 };
//
// => the result should be an array with N elements, where each element one of the size 4 physics vectors
let params = {low: 4.5, high: 8.0};

let filter_by_boundary = (vector_list, params) =>
    vector_list.filter(vector => params.low <= magnitude(vector) <= params.high);

let filtered = filter_by_boundary(x, params);

console.log("Values in x filtered based on", params);
console.log(filtered);

// ----------------------------
//   Q.6 
//
// Define a function that takes two arguments: 
//  1) an array of vectors of form similar to x
//  2) params, of the form defined in Q.5
//
// => return only vectors whose value are within the bounds of params (similar to Q.5)

// let filter_by_boundary = (vector_list, params) =>
//     vector_list.filter(vector => params.low <= magnitude(vector) <= params.high);

// ----------------------------
//   Q.7 
//
// Define a function that:
//  - reads an array of vectors from an external text file: 
//  - computes the maximum and minimum vectors as defined in Q.4
//  - prints the result to the console AND writes the output to a file named out.txt

const fs = require("fs");

let output_max_min = filename => {
    let file_content = fs.readFileSync(filename, {encoding: "utf-8"});
    let vector_list = JSON.parse(file_content);
    let max_min = find_max_min(vector_list);

    console.log(max_min);
    fs.writeFileSync("out.txt", JSON.stringify(max_min));
};

output_max_min("X.txt");
