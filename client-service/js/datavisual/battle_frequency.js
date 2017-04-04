//var data = d3.range(num).map(d3.randomBates(10));
// C3
var chart = c3.generate({
    bindto: '#chart',
    data: {
        columns:timepoint_total
    }
});
