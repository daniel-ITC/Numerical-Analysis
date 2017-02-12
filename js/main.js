/**
 * Created by Daniel on 10/02/2017.
 */

var MathFunction;
var Num;
var IntervalA;
var IntervalB;
var H;
var XAxisValues;
var FunctionValues;

function PrintOutput(_H, _AR1, _AR2) {
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

    DrawFunctionChart();
}

function Func(x) {
    return Math.sin(x);
}

function DrawFunctionChart() {
    var Chart = document.getElementById('FunctionChart');
    if (Chart == null || !Chart.getContext)
        return;

    var ChartContext = Chart.getContext('2d'), Axes = {};
    Axes.X0 = .5 + (.5 * Chart.width);
    Axes.Y0 = .5 + (.5 * Chart.height);
    Axes.Scale = 40; // Distanza tra X = 0 e X = 1;
    Axes.DoNegativeX = true;

    DrawAxes(ChartContext, Axes);
    DrawFunctionGraph(ChartContext, Axes, Func, 'rgb(11, 153, 11)', 1);
}

function DrawAxes(_ChartContext, _Axes) {
    var X0 = _Axes.X0, Width = document.getElementById('FunctionChart').width;
    var Y0 = _Axes.Y0, Height = document.getElementById('FunctionChart').height;
    var XMin = _Axes.DoNegativeX ? 0 : X0;

    _ChartContext.beginPath();
    _ChartContext.strokeStyle = 'rgb(128, 128, 128)';
    _ChartContext.moveTo(XMin, Y0);
    _ChartContext.lineTo(Width, Y0);
    _ChartContext.moveTo(X0, 0);
    _ChartContext.lineTo(X0, Height);
    _ChartContext.stroke();
}

function DrawFunctionGraph(_ChartContext, _Axes, _MathFunction, _Color, _Thick) {
    var XX, YY, DX = 4, X0 = _Axes.X0, Y0 = _Axes.Y0, Scale = _Axes.Scale;
    var ChartMax = Math.round((document.getElementById('FunctionChart').width - X0) / DX);
    var ChartMin = _Axes.DoNegativeX ? Math.round(-X0 / DX) : 0;

    _ChartContext.beginPath();
    _ChartContext.lineWidth = _Thick;
    _ChartContext.strokeStyle = _Color;

    for (var i = ChartMin; i <= ChartMax; i++) {
        XX = DX * i;
        YY = Scale * _MathFunction(XX/Scale);
        if (i == ChartMin)
            _ChartContext.moveTo(X0 + XX, Y0 - YY);
        else
            _ChartContext.lineTo(X0 + XX, Y0 - YY);
    }
    _ChartContext.stroke();
}

function GetValues() {
    /* Prendo in input i dati */
    MathFunction = document.getElementById('InputMathFunction').value; //
    Num = parseInt(document.getElementById('InputDivisions').value); //
    IntervalA = parseInt(document.getElementById('InputIntervalBegin').value); // inizio dell'intervallo
    IntervalB = parseInt(document.getElementById('InputIntervalEnd').value); // fine dell'intervallo

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

function FunctionRecomposition(_ElaboratedFunction, _FunctionLength) {
    var RecomposedFunction = '';
    for (var i=0; i<_FunctionLength; i++) {
        RecomposedFunction += _ElaboratedFunction[i];
    }

    return RecomposedFunction;
}

function IsNumeric(_Number) { return !isNaN(parseFloat(_Number)) && isFinite(_Number); }

function MyPow(_base, _exponent) {
    var tmp = 1;
    for (var i = 0; i < _exponent; i++)
        tmp *= _base;

    return tmp;
}
