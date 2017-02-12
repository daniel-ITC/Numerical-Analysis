/**
 * Created by Daniel on 10/02/2017.
 */

var MathFunction = '', Num = 0, IntervalA = 0, IntervalB = 0, H = 0;
var XAxisValues = [], FunctionValues = [];

var MyConfig = {
    CavansId: 'FunctionChart',
    MinX: -10,
    MinY: -10,
    MaxX: 10,
    MaxY: 10,
    UnitPerTick: 1
};

//var Chart = document.getElementById('FunctionChart');
//var ChartContext = Chart.getContext('2d'), Axes = {};

//window.onload = DrawChart();
/*
function DrawChart() {
    if (Chart == null || !Chart.getContext)
        return;

    Axes.X0 = .5 + (.5 * Chart.width);
    Axes.Y0 = .5 + (.5 * Chart.height);
    Axes.Scale = 10; // Distanza tra X = 0 e X = 1;
    Axes.DoNegativeX = true;

    DrawAxes(ChartContext);
}

function DrawAxes(_ChartContext) {
    var X0 = Axes.X0, Width = document.getElementById('FunctionChart').width;
    var Y0 = Axes.Y0, Height = document.getElementById('FunctionChart').height;
    var XMin = Axes.DoNegativeX ? 0 : X0;

    _ChartContext.beginPath();
    _ChartContext.strokeStyle = 'rgb(0,0,0)';
    _ChartContext.moveTo(XMin, Y0);
    _ChartContext.lineTo(Width, Y0);
    _ChartContext.moveTo(X0, 0);
    _ChartContext.lineTo(X0, Height);
    _ChartContext.stroke();
}

function DrawFunctionGraph(_ChartContext, _MathFunction, _Color, _Thick) {
    var XX, YY, DX = 4, X0 = Axes.X0, Y0 = Axes.Y0, Scale = Axes.Scale;
    var ChartMax = Math.round((document.getElementById('FunctionChart').width - X0) / DX);
    var ChartMin = Axes.DoNegativeX ? Math.round(-X0 / DX) : 0;

    _ChartContext.beginPath();
    _ChartContext.lineWidth = _Thick;
    _ChartContext.strokeStyle = _Color;

    for (var i = ChartMin; i <= ChartMax; i++) {
        XX = DX * i;
        YY = Scale * _MathFunction(XX / Scale);
        if (i == ChartMin)
            _ChartContext.moveTo(X0 + XX, Y0 - YY);
        else
            _ChartContext.lineTo(X0 + XX, Y0 - YY);
    }
    _ChartContext.stroke();
}

function MyFunction(_x) {

    return (2*_x)/_x;
}
*/
function Graph(_Config) {
    this.Cavans = document.getElementById(_Config.CavansId);
    this.MinX = _Config.MinX;
    this.MinY = _Config.MinY;
    this.MaxX = _Config.MaxX;
    this.MaxY = _Config.MaxY;
    this.UnitsPerTick = _Config.UnitsPerTick;

    this.AxisColor = 'rgb(0,0,0)';
    this.Font = '8pt Calibri';
    this.TickSize = 20;

    this.Context = this.Cavans.getContext('2d');
    this.RangeX = this.MaxX - this.MinX;
    this.RangeY = this.MaxY - this.MinY;
    this.UnitX = this.Cavans.width / this.RangeX;
    this.UnitY = this.Cavans.height / this.RangeY;
    this.CenterX = Math.round(Math.abs(this.MinX / this.RangeX) * this.Cavans.width);
    this.CenterY = Math.round(Math.abs(this.MinY / this.RangeY) * this.Cavans.height);
    this.Interaction = (this.MaxX - this.MinX) / 1000;
    this.ScaleX = this.Cavans.width / this.RangeX;
    this.ScaleY = this.Cavans.height / this.RangeY;

    this.DrawXAxis();
    this.DrawYAxis();
}
Graph.prototype.DrawXAxis = function() {
    var Context = this.Context;
    Context.save();
    Context.beginPath();
    Context.moveTo(0, this.CenterY);
    Context.lineTo(this.Cavans.width, this.CenterY);
    Context.strokeStyle = this.AxisColor;
    Context.lineWidth = 1;
    Context.stroke();

    var XPosInc = this.UnitsPerTick * this.UnitX, XPos, Unit;
    Context.font = this.font;
    Context.textAlign = 'center';
    Context.textBaseline = 'top';

    XPos = this.CenterX - XPosInc;
    Unit = -1 * this.UnitsPerTick;
    while (XPos > 0) {
        Context.moveTo(XPos, this.CenterY - this.TickSize / 2);
        Context.lineTo(XPos, this.CenterY + this.TickSize / 2);
        Context.stroke();
        Context.fillText(Unit, XPos, this.CenterY + this.TickSize / 2 + 3);
        Unit -= this.UnitsPerTick;
        XPos = Math.round(XPos - XPosInc);
    }

    XPos = this.CenterX + XPosInc;
    Unit = this.UnitsPerTick;
    while (XPos < this.Cavans.width) {
        Context.moveTo(XPos, this.CenterY - this.TickSize / 2);
        Context.lineTo(XPos, this.CenterY + this.TickSize / 2);
        Context.stroke();
        Context.fillText(Unit, XPos, this.CenterY + this.TickSize / 2 + 3);
        Unit += this.UnitsPerTick;
        XPos = Math.round(XPos + XPosInc);
    }
    Context.restore();
};

Graph.prototype.DrawYAxis = function() {
    var Context = this.Context;
    Context.save();
    Context.beginPath();
    Context.moveTo(this.CenterX, 0);
    Context.lineTo(this.CenterX, this.Cavans.height);
    Context.strokeStyle = this.AxisColor;
    Context.lineWidth = 1;
    Context.stroke();

    var YPosInc = this.UnitsPerTick * this.UnitY, YPos, Unit;
    Context.font = this.font;
    Context.textAlign = 'right';
    Context.textBaseline = 'middle';

    YPos = this.CenterY - YPosInc;
    Unit = this.UnitsPerTick;
    while (YPos > 0) {
        Context.moveTo(this.CenterX - this.TickSize / 2, YPos);
        Context.lineTo(this.CenterX + this.TickSize / 2, YPos);
        Context.stroke();
        Context.fillText(Unit, this.CenterX + this.TickSize / 2 - 3, YPos);
        Unit += this.UnitsPerTick;
        YPos = Math.round(YPos - YPosInc);
    }

    YPos = this.CenterY + YPosInc;
    Unit = -1 * this.UnitsPerTick;
    while (YPos < this.Cavans.height) {
        Context.moveTo(this.CenterX - this.TickSize / 2, YPos);
        Context.lineTo(this.CenterX + this.TickSize / 2, YPos);
        Context.stroke();
        Context.fillText(Unit, this.CenterY + this.TickSize / 2 - 3, YPos);
        Unit -= this.UnitsPerTick;
        YPos = Math.round(YPos + YPosInc);
    }
    Context.restore();
};

Graph.prototype.TransformContext = function() {
    var Context = this.Context;
    this.Context.translate(this.CenterX, this.CenterY);
    Context.scale(this.ScaleX, -this.ScaleY);
};

Graph.prototype.DrawFunction = function(_MathFunction, _Color, _Thickness) {
    var Context = this.Context;
    Context.save();
    Context.save();
    this.TransformContext();

    Context.beginPath();
    Context.moveTo(this.MinX, _MathFunction(this.MinX));

    for (var i = this.MinX + this.Interaction; i <= this.MaxX; i += this.Interaction) {
        Context.lineTo(i, _MathFunction(i));
    }

    Context.restore();
    Context.lineJoin = 'round';
    Context.lineWidth = _Thickness;
    Context.strokeStyle = _Color;
    Context.stroke();
    Context.restore();
};

function Calculate() {
    GetValues();

    /* Calcolo l'altezza */
    H = (IntervalB - IntervalA) / Num;

    /* Calcolo i valori dell'assse delle ascisse nei vari punti */
    XAxisValues = [];
    XAxisValues[0] = IntervalA;
    for (var i = 1; i < Num; i++) {
        XAxisValues[i] = XAxisValues[i-1] + H;
    }
    XAxisValues[Num] = IntervalB;

    /* Calcolo dei valori della funzione nei vari punti */
    FunctionValues = [];
    for (i = 0; i < XAxisValues.length; i++) {
        FunctionValues[i] = CalcFunctionValue(XAxisValues[i]);
    }

    /* Calcolo AR1 */
    var Sum = 0;
    for (i=0; i < (FunctionValues.length-1); i++) {
        Sum += FunctionValues[i];
    }
    var AR1=Sum*H;

    /* Calcolo AR2 */
    Sum=0;
    for (i=1; i<FunctionValues.length; i++) {
        Sum += FunctionValues[i];
    }
    var AR2=Sum*H;

    PrintOutput(H, AR1, AR2);
}

function GetValues() {
    /* Input dei dati */
    MathFunction = document.getElementById('InputMathFunction').value; // Funzione matematica
    Num = parseInt(document.getElementById('InputDivisions').value); // Numero di divisioni
    IntervalA = parseInt(document.getElementById('InputIntervalBegin').value); // Inizio dell'intervallo
    IntervalB = parseInt(document.getElementById('InputIntervalEnd').value); // Fine dell'intervallo
}

function CalcFunctionValue(_XAxisValue) {
    var ElaboratedFunction = ReplaceX(_XAxisValue);
    var FunctionLength = ElaboratedFunction.length;

    for (var k = 0; k < FunctionLength; k++) {
        if (ElaboratedFunction[k] == '^') {
            ElaboratedFunction[k-1] = Math.pow(parseFloat(ElaboratedFunction[k-1]), parseFloat(ElaboratedFunction[k+1])).toString();

            for (var i=k; i<FunctionLength; i++) {
                ElaboratedFunction[i] = ElaboratedFunction[i+2];
            }
            ElaboratedFunction.splice((FunctionLength-2), 2); // Elimino dall'array le due posizioni occupate del sengno di elevazione ^ e dall'esponente
            FunctionLength -= 2;
        }
    }

    return eval(FunctionRecomposition(ElaboratedFunction, FunctionLength)); // eval esegue operazioni matematiche sulle stringhe
}

function ReplaceX(_XAxisValue) {
    var ElaboratedFunction = MathFunction.split('');

    for (var k = 0; k < ElaboratedFunction.length; k++) {
        if (ElaboratedFunction[k] == 'x' && (ElaboratedFunction[k-1] == undefined ||
            ElaboratedFunction[k-1] == '(') ||
            ElaboratedFunction[k-1] == '/' ||
            ElaboratedFunction[k-1] == '*' ||
            ElaboratedFunction[k-1] == '-' ||
            ElaboratedFunction[k-1] == '+' ||
            //ElaboratedFunction[k-1] == '^' ||
            ElaboratedFunction[k-1] == '|' ||
            ElaboratedFunction[k-1] == 'n' ||
            ElaboratedFunction[k-1] == 'g' ||
            ElaboratedFunction[k-1] == 's' ) {
            ElaboratedFunction[k] = _XAxisValue.toString();
        } else if (ElaboratedFunction[k] == 'x' && (ElaboratedFunction[k-1] == ')' ||
            ElaboratedFunction[k-1] == 'e' ||
            IsNumeric(ElaboratedFunction[k-1]) ||
            ElaboratedFunction[k-1] == 'x')) {
            ElaboratedFunction[k]='*';
            /* Shift a destra per permettere l'inserimento del * prima della x */
            for (var i=(ElaboratedFunction.length+1); i==k; i--) {
                ElaboratedFunction[i] = ElaboratedFunction[i-1];
            }
            ElaboratedFunction[k+1] = _XAxisValue.toString();
        }
    }

    return ElaboratedFunction;
}

function IsNumeric(_Number) { return !isNaN(parseFloat(_Number)) && isFinite(_Number); }

function FunctionRecomposition(_ElaboratedFunction, _FunctionLength) {
    var RecomposedFunction = '';
    for (var i=0; i<_FunctionLength; i++) {
        RecomposedFunction += _ElaboratedFunction[i];
    }

    return RecomposedFunction;
}

function PrintOutput(_H, _AR1, _AR2) {
    var MyGraph = new Graph(MyConfig);
    var IdIntegralTop = document.getElementById('IntegralTop');
    var IdIntegralFunction = document.getElementById('IntegralFunction');
    var IdIntegralDown = document.getElementById('IntegralDown');

    var IdXAxis = document.getElementById('XAxis');
    var IdXAxisValues = document.getElementById('XAxisValues');
    var IdFunctionValues = document.getElementById('FunctionValues');
    var IdFunction = document.getElementById('Function');

    var IdResults = document.getElementById('Results');

    /* Disegno dell'integrale */
    IdIntegralTop.innerHTML = IntervalB;
    IdIntegralFunction.innerHTML = '('+MathFunction+') dx';
    IdIntegralDown.innerHTML = IntervalA;

    /* Disegno della prima tabella */
    IdResults.innerHTML = '<td>'+_H+'</td><td>'+_AR1+'</td><td>'+_AR2+'</td>';

    /* Disegno della tabella seconda tabella */
    IdXAxis.innerHTML = '<th>Variabile</th>';
    IdXAxisValues.innerHTML = '<th>Valore della variabile</th>';
    IdFunctionValues.innerHTML = '<th>Valore della funzione</th>';
    IdFunction.innerHTML = '<th>Funzione</th>';

    IdXAxis.innerHTML += '<td>a</td>';
    IdXAxisValues.innerHTML += '<td>' + XAxisValues[0] + '</td>';
    IdFunctionValues.innerHTML += '<td>' + FunctionValues[0] + '</td>';
    IdFunction.innerHTML += '<td>' + 'f(a)' + '</td>';

    for (var i = 1; i < Num; i++) {
        IdXAxis.innerHTML += '<td>X<sub>' + i +'</sub></td>';
        IdXAxisValues.innerHTML += '<td>' + XAxisValues[i] + '</td>';
        IdFunctionValues.innerHTML += '<td>' + FunctionValues[i] + '</td>';
        IdFunction.innerHTML += '<td>f(X<sub>' + i + '</sub>)</td>';
    }

    IdXAxis.innerHTML += '<td>b</td>';
    IdXAxisValues.innerHTML += '<td>' + XAxisValues[(XAxisValues.length - 1)] + '</td>';
    IdFunctionValues.innerHTML += '<td>' + FunctionValues[(FunctionValues.length - 1)] + '</td>';
    IdFunction.innerHTML += '<td>' + 'f(b)' + '</td>';
    //DrawFunctionGraph(ChartContext, Axes, MyFunction, 'rgb(11, 153, 11)', 1);
    MyGraph.DrawFunction(function(x) {
        //console.log(MyPow(x,2));
        return Test(x);
    }, 'red', 2);
}

function Test(x) {
    var MFunction = MathFunction.split('');
    var FunctionLength = MFunction.length;

    for (var k = 0; k < FunctionLength; k++) {
        if (MFunction[k] == '^') {
            MFunction[k-1] = Math.pow(x,MFunction[k+1]);
            for (var i=k; i<FunctionLength; i++) {
                MFunction[i] = MFunction[i+2];
            }
            MFunction.splice((FunctionLength-2), 2);
            FunctionLength -= 2;
        }
    }

    return MFunction;
}

function MyPow(_base, _exponent) {
    console.log(_base);
    var tmp = 1;
    for (var i = 0; i < _exponent; i++)
        tmp *= _base;

    return tmp;
}
