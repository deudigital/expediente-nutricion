<div style="text-align:center;margin-bottom:20px">
<img src="{{ $logo }}" width="180" />
</div>

<p>{{ $nombre_persona }}, </p>

<p>Ha recibido la Factura Electr&oacute;nica : 
N&deg; {{ $numeracion }} de la cuenta de {{ $nombre_nutricionista }}.  
Puede verla y descargarla del siguiente enlace:</p>

<p><a href="{{ $pdf }}">click aqui para ver la factura</a></p>
