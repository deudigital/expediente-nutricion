
<html>
<head>
    <meta charset="utf-8">
    <script type="text/javascript" src="qrcode.js"></script>
    <script type="text/javascript" src="jquery.min.js"></script>
    
    <style type="text/css"> 
    .invoice-box {
        max-width: 800px;
        margin: auto;
        padding: 30px;
        border: 1px solid #eee;
        box-shadow: 0 0 10px rgba(0, 0, 0, .15);
        font-size: 16px;
        line-height: 24px;
        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
        color: #555;
    }
    
    .invoice-box table {
        width: 100%;
        line-height: inherit;
        text-align: left;
    }
    
     .heading td, .item td{
        padding: 5px;
        vertical-align: top;
    }
    
    .invoice-box table tr td:nth-child(2) {
        text-align: right;
    }

    .exception{text-align: left!important}
    

    
    .invoice-box table tr.top table td.title {
        font-size: 45px;
        line-height: 45px;
        color: #333;
    }
    
   
    
    .invoice-box table tr.heading td {
        background: #eee;
        border-bottom: 1px solid #ddd;
        font-weight: bold;
    }
    
    .invoice-box table tr.details td {
        padding-bottom: 20px;
    }
    
    .invoice-box table tr.item td{
        border-bottom: 1px solid #eee;
    }
    
    .invoice-box table tr.item.last td {
        border-bottom: none;
    }
    
    .invoice-box table tr.total td:nth-child(2) {
        border-top: 2px solid #eee;
        font-weight: bold;
    }

    .totalFactura{font-size: 20px}
    
    @media only screen and (max-width: 600px) {
        .invoice-box table tr.top table td {
            width: 100%;
            display: block;
            text-align: center;
        }
        
        .invoice-box table tr.information table td {
            width: 100%;
            display: block;
            text-align: center;
        }
    }
    
    /** RTL **/
    .rtl {
        direction: rtl;
        font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
    }
    
    .rtl table {
        text-align: left;
    }
    
    .rtl table tr td:nth-child(2) {
        text-align: left;
    }
    </style>
</head>

<body>    
    <div class="invoice-box">
        <div style="float:left">
            <img src="{{$imagen}}" style="width:20%; max-width:300px;">
            <img src="http://chart.googleapis.com/chart?chs=100x100&cht=qr&chl={{$code}}">
        </div>
        <div style="float:right; margin-top: -2%; margin-bottom: -18%; margin-left: -18%;">
            <span style="float: right;">Fecha: {{$fecha}}</span>
            <br>
            <span style="float: right;">Factura #: {{$factura_numero}}</span>
            <br>
            <span style="float: right;">Método de Pago: {{$factura['medio_nombre']}}</span>
            <br>
            <span style="float: right;">Condición de Venta: Contado</span>
        </div> 
        <div style="float:left; margin-top:15.1%;">
            <span style="font-size: 16px;"><b>Emisor</b></span>
            <br>
            <span style="font-size: 12px;">{{$nutricionista['nombre']}}</span>
            <br>
            <span style="font-size: 12px;">Cédula: {{$nutricionista['cedula']}}</span>
            <br>
            <span style="font-size: 12px;">{{$nutricionista['detalles_direccion']}}</span>
            <br>
            <span style="font-size: 12px;">{{$nutricionista_ubicacion['nombre_barrio']}}, {{$nutricionista_ubicacion['nombre_distrito']}}, {{$nutricionista_ubicacion['nombre_canton']}}, {{$nutricionista_ubicacion['nombre_provincia']}}</span>
            <br>
            <span style="font-size: 12px;">Teléfono: {{$nutricionista['telefono']}}</span>
            <br>
            <span style="font-size: 12px;">E-mail: {{$nutricionista['email']}}</span>
        </div>      
        <div style="float:right; margin-top:15%; text-align: right">
            <span style="font-size: 16px;"><b>Cliente</b></span>
            <br>
            <span style="font-size: 12px;">{{$client['nombre']}}</span>
            <br>
            <span style="font-size: 12px;">Cédula: {{$client['cedula']}}</span>
            <br>
            <span style="font-size: 12px;">
                {{$client['detalles_direccion']}}                     
            </span>
            <br>
            <span style="font-size: 12px;">{{$client_ubicacion['nombre_barrio']}}, {{$client_ubicacion['nombre_distrito']}}, {{$client_ubicacion['nombre_canton']}}, {{$client_ubicacion['nombre_provincia']}}</span>
            <br>
            <span style="font-size: 12px;">Teléfono: {{$client['telefono']}}</span>
            <br>
            <span style="font-size: 12px;">E-mail: {{$client['email']}}</span>
        </div>   
        <div style="margin-top:40%">
            <div style="display: table; width: 100%; table-layout: fixed; border-spacing: 10px;margin-left:-5%;margin-right:5%;">
                <div style="display: table-cell;background-color: #eee; padding-left:8%; width:10%">
                    <span style="font-size: 12px;"><b>Cantidad</b></span>
                </div>
                <div style="display: table-cell;background-color: #eee; padding-left:5%; width:20%">
                    <span style="font-size: 12px;"><b>Unidad de Medida</b></span>
                </div>
                <div style="display: table-cell;background-color: #eee; padding-left:5%">
                    <span style="font-size: 12px;"><b>Descripción</b></span>
                </div>
                <div style="display: table-cell;background-color: #eee; padding-left:5%">
                    <span style="font-size: 12px;"><b>Precio Unitario</b></span>
                </div>
                <div style="display: table-cell;background-color: #eee; padding-left:5%">
                    <span style="font-size: 12px;"><b>Descuento</b></span>
                </div>
                <div style="display: table-cell;background-color: #eee; padding-left:5%">
                    <span style="font-size: 12px;"><b>Impuesto</b></span>
                </div>
                <div style="display: table-cell;background-color: #eee; padding-left:5%">
                    <span style="font-size: 12px;"><b>SubTotal</b></span>
                </div>
            </div>  
            @foreach ($productos as $producto)
                <div style="display: table; width: 100%; table-layout: fixed; border-spacing: 10px;border-bottom: 0.5px solid #eee;">
                    <div style="display: table-cell; padding-left:8%; width:10%;">
                        <span style="font-size: 12px;">{{$producto["cantidad"]}}</span>
                    </div>
                    <div style="display: table-cell; padding-left:5%; width:20%">
                        <span style="font-size: 12px;">{{$producto["unidad_nombre"]}}</span>
                    </div>
                    <div style="display: table-cell; padding-left:5%">
                        <span style="font-size: 12px;">{{$producto["descripcion"]}}</span>
                    </div>
                    <div style="display: table-cell; padding-left:5%">
                        <span style="font-size: 12px;">¢ {{$producto["precio"]}}</span>
                    </div>
                    <div style="display: table-cell; padding-left:5%">
                        <span style="font-size: 12px;">¢ {{$producto["descuento"]}}</span>
                    </div>
                    <div style="display: table-cell; padding-left:5%">
                        <span style="font-size: 12px;">¢ {{$producto["impuesto"]}}</span>
                    </div>
                    <div style="display: table-cell; padding-left:5%">
                        <span style="font-size: 12px;">¢ {{$producto["subtotal"]}}</span>
                    </div>
                </div>
            @endforeach              
        </div>
        <div style="float:right; margin-top:5%;text-align: right">
            <span style="font-size: 12px;"><b>Subtotal Neto:</b> ¢ {{$factura["subtotal"]}}</span>
            <br>
            <span style="font-size: 12px;"><b>Descuento Total:</b> ¢ {{$factura["descuento"]}}</span>
            <br>
            <span style="font-size: 12px;"><b>Imp. de Ventas (13%):</b> ¢ {{$factura["ive"]}}</span>
            <br>
            <br>
            <span style="font-size: 18px;"><b>Total Factura:</b> ¢ {{$factura["total"]}}</span>
        </div>  
        <div style="float:left;text-align: left">
            <span style="font-size: 16px;">Notas</span>
            <br>
            <span style="font-size: 12px;">{{$factura["notas"]}}</span>
        </div>
        <div style="float: right"> 
            <div id="qrcode" style="display:block;text-align: right;"></div>
        </div>
        <div style="display: table; width: 100%; table-layout: fixed; border-spacing: 10px;padding-top: 25%; text-align:center;">        
            <hr style="margin-top:-6%">
            <p style="text-align: center">Emitida conforme lo establecido en la resolución de Facturación Electrónica, N° GT-R-48-2016 siete de octubre de dos mil dieciséis de la Dirección General de Tributación</p>            
        </div>    
    </div>
    <script type="text/javascript">    
        new QRCode("qrcode", {
            text: "http://jindo.dev.naver.com/collie",
            width: 128,
            height: 128,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    </script>
</body>
</html>
