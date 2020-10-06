// stop this with clearTimeout(timeout_id)
let timeout_id = setTimeout(() => alert("Hello!"), 1000);

// stop this with clearInterval(interval_id)
let interval_id = setInterval(() => console.log("Hello!"), 1000);

let hellos = ["hello", "hi", "hi there"];

// short for e => alert(e)
hellos.forEach(alert);

let hellos_upper = hellos.map(e => e.toUpperCase());

let numbers = [20, 1, 3, 4, 9, 10];

let tens = numbers.filter(x => (x % 10 == 0))

// default initial value is 0
let sum = [1, 10, 100].reduce((acc, elem) => (acc + elem));

// use custom initial value
let max_object = [1, 100, 20].reduce((acc, elem) => (elem > acc.max ? {max: elem} : acc), {max: 0})
