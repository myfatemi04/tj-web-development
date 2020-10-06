setTimeout(() => alert("Hello!"), 1000);
setInterval(() => alert("Hello!"), 1000);
["hello", "hi", "hi there"].forEach(alert);
["hello", "hi", "hi there"].map(elem => elem.upper());
[20, 1, 3, 4, 9, 10].filter(elem => (elem % 10 == 0));
[1, 10, 100].reduce((cur, next) => cur + next, 0);
[1, 100, 20].reduce((cur, next) => {max: max(cur.max, next)}, {max: 0});