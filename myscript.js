//myscript
//http://www.html5canvastutorials.com/labs/html5-canvas-graphing-an-equation/

function arrayMin(arr) {
    var len = arr.length, min = Infinity;
    while (len--) {
        if (arr[len] < min) {
            min = Number(arr[len]);
        }
    }
    return min;
};

function arrayMax(arr) {
    var len = arr.length, max = -Infinity;
    while (len--) {
        if (arr[len] > max) {
            max = Number(arr[len]);
        }
    }
    return max;
};

function shuffleArray(arr) {//Durstenfeld shuffle algorithm
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

/*
Net Present Value - NPV

In finance, the net present value (NPV) is a measurement of the
profitability of an undertaking that is calculated by subtracting
the present values (PV) of cash outflows (including initial cost)
from the present values of cash inflows over a period of time.

Here is the general formula:

			N        Cn
	NPV = SIGMA  ----------
		   n=0     (1+r)^n

	Cn = net cash inflow during the period n
	Co = total initial investment costs
	r = discount rate, and
	N = number of time periods

In general for the formula above, Co < 0. Alternatively, we could write:

			N        Cn
	NPV = SIGMA  ---------- - Co
			n=1     (1+r)^n

	where Co > 0
*/
function CalcNPV(values,r)
{
    //Parameters:
    // values: an array of cash flows (floating-point numbers)
    // r: discout rate (floating point number)
    var NPV = 0;
    for (var n = 0; n < values.length; n++)
        NPV += (values[n] / Math.pow(1 + r, n));
    return NPV;
}

/*
In numerical analysis, the secant method is a root-finding algorithm
that uses a succession of roots of secant lines to better approximate
a root of a function f. The secant method can be thought of as a finite
difference approximation of Newton's method.
*/
function secant(guess, dx, f, values) {
    var root = guess;
    var x0 = guess - dx;
    var x1 = guess + dx;

    for (var i = 0; i < 5; i++) {
        var y0 = f(values,x0);
        var y1 = f(values,x1);
        if (x0 == x1 || y0 == y1)
            break;
        var x2 = x1 - y1 * ((x1 - x0) / (y1 - y0));
        root = x2;
        x0 = x1;
        x1 = x2;
    }
    return root;
}

/*
Internal Rate of Return
Returns the internal rate of return for a series of cash flows
represented by the numbers in values. These cash flows do not
have to be even, as they would be for an annuity. However, the
cash flows must occur at regular intervals, such as monthly or
annually. The internal rate of return is the interest rate received
for an investment consisting of payments (negative values) and
income (positive values) that occur at regular periods.
*/
function IRR(values, guess) {
    var root = secant(guess, 0.025, CalcNPV, values);
    return root;
}

function plotData(xvals, yvals,graph, ColorString, first_time)
{
    var canvas = document.getElementById("myCanvas");
    var canvas_width = Number(document.getElementById("myCanvas").getAttribute("width"));
    var canvas_height = Number(document.getElementById("myCanvas").getAttribute("height"));

    var xmin = graph.x_min;
    var xmax = graph.x_max;
    var ymin = graph.y_min;
    var ymax = graph.y_max;

    var xrange = xmax - xmin;
    var yrange = ymax - ymin;
    var xscale = Math.floor(canvas_width / xrange);
    var yscale = Math.floor(canvas_height / yrange);

    var ctx = canvas.getContext("2d");
    var max = xvals.length;

    //prepare canvas
    if (first_time) {
        //clear
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        //draw gridlines
        var firstYr = Number(document.getElementById("frm1").elements[3].value);
        for (var i = 0; i < max; i++)
        {
            var xpos = Math.floor(xvals[i] * xscale);

            ctx.beginPath();
            ctx.moveTo(xpos, 0);
            ctx.lineTo(xpos, canvas_height - 20);
            ctx.strokeStyle = "grey";
            ctx.stroke();

            var year = firstYr + i;
            ctx.fillStyle = 'grey';
            ctx.fillText(year, xpos-10, canvas_height - 10);
        }
    }

    //initialize points
    var xa = 0;
    var ya = 0;
    var xb = 0;
    var yb = 0;

    //loop and plot
    for (var i = 0; i < max; i++) {
        xa = Math.floor(xvals[i] * xscale);
        //ya = canvas_height - Math.floor(yvals[i] * yscale);
        ya = (canvas_height) - ((yvals[i] / ymax) * canvas_height);
        //ya = canvas_height - (((yvals[i]-ymin) / yrange) * canvas_height);

        ctx.beginPath();
        ctx.arc(xa, ya, 2, 0, 2 * Math.PI, true);//x y radius sAngle eAngle
        ctx.closePath();
        ctx.fillStyle = ColorString;
        ctx.fill();
        ctx.strokeStyle = ColorString;
        ctx.stroke();

        //draw line
        if (i > 0) {
            ctx.moveTo(xb, yb);
            ctx.lineTo(xa, ya);
            ctx.strokeStyle = ColorString;
            ctx.stroke();
        }

        //update previous point
        xb = xa;
        yb = ya;
    }
}

function drawTheGraph(x1vals, y1vals, x2vals, y2vals, x3vals, y3vals) {

    var canvas_width = Number(document.getElementById("myCanvas").getAttribute("width"));
    var canvas_height = Number(document.getElementById("myCanvas").getAttribute("height"));

    var x1min = arrayMin(x1vals);
    var x1max = arrayMax(x1vals);
    var x2min = arrayMin(x2vals);
    var x2max = arrayMax(x2vals);
    var x3min = arrayMin(x3vals);
    var x3max = arrayMax(x3vals);

    var y1min = arrayMin(y1vals);
    var y1max = arrayMax(y1vals);
    var y2min = arrayMin(y2vals);
    var y2max = arrayMax(y2vals);
    var y3min = arrayMin(y3vals);
    var y3max = arrayMax(y3vals);

    var xmin = Math.min(x1min, x2min);
    xmin = Math.min(xmin,x3min);

    var xmax = Math.max(x1max, x2max);
    xmax = Math.max(xmax,x3max);

    var ymin = Math.min(y1min, y2min);
    ymin = Math.min(ymin,y3min);

    var ymax = Math.max(y1max, y2max);
    ymax = Math.max(ymax,y3max);

    var graph = { x_min: xmin, x_max: xmax, y_min: ymin, y_max: ymax };

    plotData(x1vals, y1vals, graph, "red", true);
    plotData(x2vals, y2vals, graph, "blue", false);
    plotData(x3vals, y3vals, graph, "green", false);
}

function calcTable(table, initial_balance, rate)
{

    //*******************************************************
	//main algorithm
	//*******************************************************
	for (var i = 0; i < table.length; i++)
	{
		if (i == 0)
		{
			table[i].balance = initial_balance;
			table[i].withdrawal = initial_balance*rate;
		}
		else
		{
			var prev_balance = table[i - 1].balance;
			var prev_return = table[i - 1].historical_return;
			var prev_withdrawal = table[i - 1].withdrawal;
			table[i].balance = (prev_balance*(1 + prev_return)) - prev_withdrawal;

			var cur_balance = table[i].balance;
			var cur_return = table[i].historical_return;
			table[i].withdrawal = Math.min(prev_withdrawal, cur_balance*(1 + cur_return));
		}
	}

	//*******************************************************
	//TOTAL row
	//*******************************************************

	//Compute Internal Rate of Return
	var O_data = [];
	O_data.push(-1 * table[0].balance);
	for (var j = 0; j < table.length - 1; j++)
		O_data.push(table[j].withdrawal);
	var last = table[table.length - 1];
	var total_bal = (last.balance *(1 + last.historical_return)) - last.withdrawal;
	O_data.push(last.withdrawal + total_bal);
	var total_ret = IRR(O_data, 0.03);
 	var total_with = 0;
	for (var r = 0; r < table.length; r++)
		total_with += table[r].withdrawal;
    
	var row = { year: "TOTAL", balance: total_bal, historical_return: total_ret, withdrawal: total_with };
	table.push(row);

}

function drawTable(table, displayID, Title_of_Table)
{
    var tableText = "<br/><h3>" + Title_of_Table + "</h3>";
    tableText += "<table align=\"center\"><tr><td>Year</td><td>Beginning Balance</td><td>Historical Return</td><td>Annual Withdrawal</td></tr>";
    for (var i = 0; i < table.length; i++) {
        tableText += "<tr>";

        //Year (x-vals)
        tableText += "<td>";
        tableText += table[i].year;
        tableText += "</td>";

        //Beginning Balance (y-vals)
        tableText += "<td>";
        tableText += "$";
        tableText += table[i].balance.toFixed(0);
        tableText += "</td>";

        //Historical Return
        tableText += "<td>";
        var percent = 100 * table[i].historical_return;
        tableText += percent.toFixed(3);
        tableText += "%";
        tableText += "</td>";

        //Annual Withdrawal
        tableText += "<td>";
        tableText += "$";
        tableText += table[i].withdrawal.toFixed(2);
        tableText += "</td>";

    }
    tableText += "</table>";
    document.getElementById(displayID).innerHTML = tableText;
}

function myFunction(b_randomize) {

    //get user input
    var bal = Number(document.getElementById("frm1").elements[0].value);
    var rate = Number(document.getElementById("frm1").elements[1].value)/100;
    var gains = Number(document.getElementById("frm1").elements[2].value) / 100;
    var begYr = Number(document.getElementById("frm1").elements[3].value);
    var endYr = Number(document.getElementById("frm1").elements[4].value);
    var capRate = Number(document.getElementById("frm1").elements[5].value)/100;

    //check input
    if (begYr < 1999)
        begYr = 1999;
    if (begYr > 2015)
        begYr = 2015;
    if (endYr > 2016)
        endYr = 2016;
    if (endYr <= begYr)
        endYr = begYr + 1;
    document.getElementById("frm1").elements[3].value = begYr;
    document.getElementById("frm1").elements[4].value = endYr;

    //init S&P 500
    var sp500 = [];
    sp500.push(0.19526045);//1999
    sp500.push(-0.10139187);//2000
    sp500.push(-0.130426879);//2001
    sp500.push(-0.233659676);//2002
    sp500.push(0.26380396);//2003
    sp500.push(0.089934528);//2004
    sp500.push(0.030010232);//2005
    sp500.push(0.136194314);//2006
    sp500.push(0.035295776);//2007
    sp500.push(-0.384857937);//2008
    sp500.push(0.234541933);//2009
    sp500.push(0.1278271);//2010
    sp500.push(-0.0000318049);//2011
    sp500.push(0.134056933);//2012
    sp500.push(0.296012453);//2013
    sp500.push(0.1139063856);//2014
    sp500.push(-0.0073);//2015
    sp500.push(0.0954);//2016

    //init table1
    var years = [];
    for (var y = begYr; y <= endYr; y++)
        years.push(y);
    if (b_randomize)
        shuffleArray(years);

    var table1 = [];
    for (var i = 0; i < years.length - 1; i++) {
        var sp_index = years[i] - 1999;
        var row = { year: years[i], balance: 0, historical_return: sp500[sp_index], withdrawal: 0 };
        table1.push(row);
    }
    //console.log(table1);

    //init table2
    var table2 = [];//capped
    for (var y = begYr, i = 0; y <= endYr; y++, i++)
    {
        var sp_index = y - 1999;
        var sp = sp500[sp_index];
        if (sp > 0)
            sp = sp * gains;
        else
            sp = 0.0;
        if(sp > capRate)
            sp = capRate;
        var row = { year: y, balance: 0, historical_return: sp, withdrawal: 0 };
        table2.push(row);
    }

    //init table3
    var table3 = [];//uncapped
    for (var y = begYr, i = 0; y <= endYr; y++, i++)
    {
        var sp_index = y - 1999;
        var sp = sp500[sp_index];
        if (sp > 0)
            sp = sp * gains;
        else
            sp = 0.0;
        var row = { year: y, balance: 0, historical_return: sp, withdrawal: 0 };
        table3.push(row);
    }

    //calculate values
    calcTable(table1,bal,rate);
    calcTable(table2,bal,rate);
    calcTable(table3,bal,rate);

    //draw tables
    drawTable(table1, 'tableArea1', "Table 1");//javascript uses either single quotes or double quotes for strings, it doesn't mater
    document.getElementById("demo").innerHTML = "<br/><br/>Gains Captured = " + document.getElementById("frm1").elements[2].value + "%";
    drawTable(table2, 'tableArea2', "Capped");//javascript uses either single quotes or double quotes for strings, it doesn't mater
    drawTable(table3, 'tableArea3', "Uncapped");

    //initialize x&y values
    var x1vals = [];
    var y1vals = [];
    for (var i = 0; i < table1.length-1; i++)
    {
        x1vals.push(i);
        y1vals.push(table1[i].balance);
    }
    var x2vals = [];
    var y2vals = [];
    for (var i = 0; i < table2.length-1; i++) {
        x2vals.push(i);
        y2vals.push(table2[i].balance);
    }

    var x3vals = [];
    var y3vals = [];
    for (var i = 0; i < table3.length-1; i++) {
        x3vals.push(i);
        y3vals.push(table3[i].balance);
    }

    //draw graph
    if (!b_randomize)
    {
        var canvas = document.getElementById("myCanvas");
        canvas.width = 550;
        canvas.height = 300;
        drawTheGraph(x1vals, y1vals, x2vals, y2vals,x3vals,y3vals);
    }
    else
    {
        //remove graph (chronological order doesn't make sense when years are randomized)
        var canvas = document.getElementById("myCanvas");
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = 0;
        canvas.height = 0;
    }
    
}

/*Button Functions*/

function normal_calc() {
    myFunction(false);
}

function rand_calc() {
    myFunction(true);
}

function reset_input()
{
    document.getElementById("frm1").elements[0].value = "100000";
    document.getElementById("frm1").elements[1].value = "2";
    document.getElementById("frm1").elements[2].value = "50";
    document.getElementById("frm1").elements[3].value = "1999";
    document.getElementById("frm1").elements[4].value = "2014";
    normal_calc();
}