
//1. labels는 사용자로부터 정의역의 범위를 입력받아서 그리기

$.fn.shift = function(){
    var btn = $(this);
    btn.addClass("shift");					
    var span = btn.children("span");
    if (span.length>1) {
        var title = btn.attr("title");
        span.eq(0).attr("title", (title !== undefined)?title:"" );
        title = span.eq(1).attr("title");
        btn.attr("title", (title !== undefined)?title:"" );
    }
}

$.fn.unshift = function(){
    var btn = $(this);
    btn.removeClass("shift");
    var span = btn.children("span");
    if (span.length>1) {
        var title = span.eq(0).attr("title");
        btn.attr("title", (title !== undefined)?title:"" );						
    }
}



$.fn.selectRange = function(start, end) {

    return this.each(function() {

     if(this.setSelectionRange) {

         this.focus();

         this.setSelectionRange(start, end);

     } else if(this.createTextRange) {

         var range = this.createTextRange();

         range.collapse(true);

         range.moveEnd('character', end);

         range.moveStart('character', start);

         range.select();

     }

 });

};
    
$.fn.getCursorPosition = function() {
    var input = this.get(0);
    if (!input) return; // No (input) element found
    if (document.selection) {
        // IE
        input.focus();
    }
    return 'selectionStart' in input ? input.selectionStart:'' || Math.abs(document.selection.createRange().moveStart('character', -input.value.length));
};

window.onload = function()
{
    $("#Slider").slider({});

    

    var ctx = document.getElementById("myChart");
    var data = {
        labels: [],
        datasets: [{
            label: "f(x)=0",
            function: function(x) { return 0 },
            borderColor: "rgba(75, 192, 192, 1)",
            data: [],
            fill: false
        },
        {
            label: "g(x)=0",
            function: function(x) { return 0 },
            borderColor: "rgba(153, 102, 255, 1)",
            data: [],
            fill: false
        }]
    };
    
    Chart.plugins.register({
        beforeInit: function(Chart) {
            var data = Chart.config.data;

            var divs = $("#chartContrl").children("div");
            if(divs.eq(1).hasClass('choiceControl'))
            {
                //slider모드의 경우
                var sliderValue = $('#Slider').attr('value');
                var min = sliderValue.split(',')[0]*1;
                var max = sliderValue.split(',')[1]*1;

                var i = 0;
                while(min <= max)
                {
                    data.labels[i] = min;
                    i++;
                    min += 0.5;
                }

            }
            else
            {
                var min = $('#xMinInput').val()*1;
                var max = $('#xMaxInput').val()*1;

                var i = 0;
                while(min <= max)
                {
                    data.labels[i] = min;
                    i++;
                    min += 0.5;
                }
            }
            for (var i = 0; i < data.datasets.length; i++) {
                for (var j = 0; j < data.labels.length; j++) {
                    var fct = data.datasets[i].function,
                        x = data.labels[j],
                        y = fct(x);
                    data.datasets[i].data.push(y);
                }
            }
        }
    });

    window.myLineChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            scales: [{
                yAxes: [{
                    gridLines:{
                        zeroLineColor:'#f00'
                    },
                    ticks: {
                        beginAtZero:true
                    }
                }],
                xAxes: [{
                    type: 'time',
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 20
                    }
                }]
            }]
        }
    });
}

 $(document).ready(function () {
    var parser = math.parser();
    var fx = '0';
    var gx = '0';
    var bufValue = '0';
    var displayValue = '0';

    var remakeChart = function(){

        window.myLineChart.destroy();
        $('#myChart').remove(); // this is my <canvas> element
        $('#chartReport').append('<canvas id="myChart"><canvas>');
        
    
        var ctx = document.getElementById("myChart");
        var data = {
            labels: [],
            datasets: [{
                label: fx=='0'? 'f(x)=0':fx,
                function: function(x) {
                    if(fx != '0')
                        return parser.eval("f("+ x.toString() + ")")
                    else return 0; },
                borderColor: "rgba(75, 192, 192, 1)",
                data: [],
                fill: false
            },
            {
                label: gx=='0'? 'g(x)=0':gx,
                function: function(x) { 
                    if(gx != '0')
                        return parser.eval("g("+ x.toString() + ")");
                    else return 0; },
                borderColor: "rgba(153, 102, 255, 1)",
                data: [],
                fill: false
            }]
        };


        window.myLineChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                showXLabels: 10,
                scales: [{
                    yAxes: [{
                        gridLines:{
                            zeroLineColor:'#f00'
                        },
                        ticks: {
                            beginAtZero:true
                        }
                    }],
                    xAxes: [{
                        gridLines:{
                            zeroLineColor:'#f00'
                        }
                    }]
                }]
            }
        });
    
    }
    
    $('.btn').each(function(index, key){       
        $(this).click(function(e){
            
            displayValue = $('#input').val();

            if($(this).attr('id') == 'enter')
            {
            
                try
                {
                    bufValue = displayValue;
                    displayValue = parser.eval(displayValue).toString();
                    var tokens = displayValue.split(' ');
                    if(tokens[0] == 'function')
                    {
                        displayValue = tokens[0];
                        if(bufValue[0] == 'f')
                        {
                            fx = bufValue;
                        }
                        else if(bufValue[0] == 'g')
                        {
                            gx = bufValue;
                        }

                        remakeChart();
                        
                    }
                    else
                    {
                        var option = $("<option>"+bufValue+"</option>");
                        
                        $('#resultRecord').append(option);
                    }
                    $('#display').val(displayValue);                         
                    
                    $('#input').attr('value','');
                    $("#resultRecord").val("계산 기록");
                }
                catch (e)
                {
                    displayValue = '0';
                    if(displayValue != 'function')
                    {
                        $('#display').attr('value',e);
                    }
                }               
            }
            else
            {
                if($(this).attr('id') == 'AC')
                {
                    $('#input').attr('value','');
                    $('#display').val('');
                    $("#resultRecord").val("계산 기록");
                }
                else if($(this).attr('id') == 'DEL')
                    {
                        var textdelete = $('#input').val();
                        var nowcur = $('#input').getCursorPosition();
                        
                        if(nowcur<2)
                            {
                                $('#input').attr("value",textdelete.substring(nowcur));
                            }
                        else
                            {
                                $('#input').attr("value",textdelete.substring(0,nowcur-1) + textdelete.substring(nowcur));
                            }
                        displayValue = $('#input').val();
                    }
                else if($(this).attr('id') == "ans")
                    {
                        displayValue += $('#display').val();
                        $('#input').attr("value",displayValue);
                        $('#input').selectRange(displayValue.length,displayValue.length);
                        $('#display').val('0');
                    }
                else if($(this).attr('id') == "shift")
                    {
                        var tmp = $("#rightscreen");
                        var divs = tmp.children("div");
                        var btns = divs.children(".btn");
                        if (tmp.hasClass("shift")) {
                            for (var i=btns.length-1;i>=0;i--)
                                $(btns[i]).unshift();
                            tmp.removeClass("shift");
                        }
                        else {
                            for (var i=btns.length-1;i>=0;i--)
                                $(btns[i]).shift();
                            tmp.addClass("shift");
                        }
                    }
                
                else if($(this).attr('id') == "벡터")
                    {
                        displayValue = $("#input").val() + "[ , , ]";
                        $("#input").attr("value",displayValue);
                    }
                else if($(this).attr('id') == "행렬")
                    {
                        var btnmatrix = $("#행렬");
    
                        var left = btnmatrix.offset().left;
                        var top = btnmatrix.offset().top;

                        var matrixhelper = $("#matrixhelper");
                        if (!matrixhelper.hasClass("loaded")) {
                            matrixhelper.addClass("loaded");
                            
                            matrixhelper.mouseup(function(){

                                displayValue =$("#input").val() + matrixhelper.data("input");
                                $("#input").attr("value",displayValue);
                                
                                matrixhelper.hide();
                            });

                            matrixhelper.mousemove(function(e){
                                
                                matrixhelper.find("span").removeClass("hover");
                                var x = (e.pageX - btnmatrix.offset().left)/24;
                                var y = (e.pageY - btnmatrix.offset().top)/24;
                                if (x<1)x=1;
                                if (y<1)y=1;
                                if (x>5)x=5;
                                if (y>5)y=5;

                                var divs = matrixhelper.find("div");
                                for (var i=0;i<y;i++) {
                                    var div = divs.eq(i);
                                    var spans = div.find("span");
                                    for (var j=0;j<x;j++) {
                                        spans.eq(j).addClass("hover");
                                    }
                                }

                                var matrix = "";
                                if (x==1) {
                                    for (var i=0;i<y;i++)
                                        matrix+="0, ";

                                    matrix = "("+matrix.slice(0,-2)+")";
                                } else {
                                    for (var j=0;j<y;j++) {
                                        var row = "";
                                        for (var i=0;i<x;i++)
                                            row+="0, ";

                                        matrix += "["+row.slice(0,-2)+"],";
                                    }
                                    matrix = "["+matrix.slice(0,-1)+"]";
                                }
                                matrixhelper.data("input", matrix);
                            });
                        }

                        matrixhelper.css({"left":(left+"px"), "top":(top+"px")});
                        matrixhelper.show();
                        
                    }
                
                else if($(this).attr('id') == "BtnLeft")
                    {
                        
                    }
                else if($(this).attr('id') == "sliderToText" || $(this).attr('id') == "textToSlider")
                {
                    var divs = $("#chartContrl").children("div");

                    if(divs.eq(0).hasClass('choiceControl'))
                    {
                        divs.eq(0).removeClass('choiceControl')
                        divs.eq(1).addClass('choiceControl');
                    }
                    else
                    {
                        divs.eq(0).addClass('choiceControl')
                        divs.eq(1).removeClass('choiceControl');
                    }
                    remakeChart();
                }
                else
                {           
                    var textdelete = $('#input').val();
                    var nowcur = $('#input').getCursorPosition();

                    if($(this).attr("title") !== undefined)
                    {
                        var spans = $(this).children("span");
                        var inputValue = $(this).hasClass("shift") ? spans.eq(1).attr("id"):spans.eq(0).attr("id");
                        if($('#input').val() === undefined)
                            $('#input').attr('value' ,inputValue);
                        else
                            $('#input').attr("value",textdelete.substring(0,nowcur)+ inputValue + textdelete.substring(nowcur));
                    }
                    else
                    {
                        if($('#input').val() === undefined)
                            $('#input').attr("value",$(this).attr('id'));
                        else
                            $('#input').attr("value",textdelete.substring(0,nowcur)+ $(this).attr('id') + textdelete.substring(nowcur));
                    }
                    displayValue = $('#input').val();
                }


            }
            

            if($(this).attr('id') == 'BtnLeft') //커서 옮기기 버튼 구현!
            {
                var input = $('#input');
                var nowcur = input.getCursorPosition();
                    
                if($('#BtnLeft').text() == "▶")
                {
                    if(nowcur < input.val().length)
                        input.selectRange(nowcur+1 , nowcur+1);
                    else
                        input.selectRange(nowcur,nowcur);
                }
                else if($('#BtnLeft').text() == "◀")
                {
                    if(nowcur > 0)
                        input.selectRange(nowcur-1 , nowcur-1);
                    else
                        input.selectRange(nowcur,nowcur);
                }
            }
            else if($(this).attr('id') == 'DEL')
            {
                var nowcur = $('#input').getCursorPosition();
                if(nowcur == 0)
                    $('#input').selectRange(0,0);
                else
                $('#input').selectRange(nowcur-1,nowcur-1);
            }
            else if($(this).attr('id') == "벡터")
            {
                var lastpos = $('#input').val().length;
                $('#input').selectRange(lastpos - 5,lastpos - 5);
            }
            else if($(this).attr('id') == "행렬")
            {
                var lastpos = $('#input').val().length;
                $('#input').selectRange(lastpos - 5,lastpos - 5);
            }
            else if($(this).attr('title') !== undefined)
            {
                var nowcur = $('#input').getCursorPosition();
                var spans = $(this).children("span");
                var inputValue = $(this).hasClass("shift") ? spans.eq(1).attr("id"):spans.eq(0).attr("id");

                $('#input').selectRange(nowcur + inputValue.length , nowcur + inputValue.length);
            }
            else
            {
                var nowcur = $('#input').getCursorPosition();
                $('#input').selectRange(nowcur+$(this).attr('id').length , nowcur+$(this).attr('id').length);
            }
            
            displayValue = '0';
            
            e.preventDefault();
        })
    })
    
    $('#BtnLeft').mousemove(function (event){
        var btnleft = $("#BtnLeft");
        if ((event.pageX-btnleft.offset().left)>btnleft.width()/2)
        {
        btnleft.text("▶");
        } 
        else
        {
        btnleft.text("◀");
        }
        
        btnleft.mouseout(function(){
            btnleft.text("커서");
        })
    })

    $('#resultRecord').change(function (){

        displayValue = $(this).val();
        if(displayValue != "계산 기록")
        {
            $('#input').attr("value",displayValue);
            $('#input').selectRange(displayValue.length,displayValue.length);
        }
    })

    $("#Slider").change(function (){
        remakeChart();
    })

 })


