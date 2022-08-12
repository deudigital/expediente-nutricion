<div style="text-align:center;margin-bottom:20px">
<img src="{{ $logo }}" width="180" title="Consulta:' . $consulta-> id . '"/>
</div>

<p>{{ $paciente_nombre }}, a continuaci&oacute;n, un resumen de las medidas en esta consulta:</p>

{{ $valoracion_antropometrica }}

<p>Asimismo, ac&aacute; tienes el total de porciones que debes comer d&iacute;a a d&iacute;a seg&uacute;n lo indicado por la nutricionista:</p>

{{	$porciones }}

<p>Adem&aacute;s, ac&aacute; tienes el detalle de como dividir estas porciones en los diferentes tiempos de comida con sus respectivos ejemplos:</p>

{{ $patron_menu }}

<p>Finalmente, toda esta informaci&oacute;n y otras herramientas para llevar el registro de lo que comes d&iacute;a a d&iacute;a y ayudarte a cumplir tus objetivos est&aacute;n disponibles en el app de <strong>NutriTrack</strong>, si a&uacute;n no la tienes desc&aacute;rgala <strong>GRATIS</strong> en las tiendas de iPhone y Android</p>

$contentLeft	=	'
$contentRight	=	'

$html	.=	$this->htmlTwoColumns($contentLeft, $contentRight);

<!--[if (gte mso 9)|(IE)]>
<table width="600" align="center" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td>
<![endif]-->
<table class="container" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px;">
    <tr>
        <td style="vertical-align: top; font-size: 0;">
            <!--[if (gte mso 9)|(IE)]>
            <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td>
            <![endif]-->
            <div style="width: 300px; display: inline-block; vertical-align: top;">
                <table width="100%">
                    <tr>
                        <td style="font-size: 14px;">
							<div style="text-align:center">
								<a href="https://itunes.apple.com/us/app/nutritrack/id1302386185?l=es&mt=8"><img src="https://expediente.nutricion.co.cr/mail/images/appstore.png" width="180" /></a>
							</div>
						</td>
                    </tr>
                </table>
            </div>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            <td>
            <![endif]-->
            <div style="width: 300px; display: inline-block; vertical-align: top;">
                <table width="100%">
                    <tr>
                        <td style="font-size: 14px;">
							<div style="text-align:center">
								<a href="https://play.google.com/store/apps/details?id=cr.co.nutricion.nutritrack"><img src="https://expediente.nutricion.co.cr/mail/images/googleplay.png" width="180" /></a>
							</div>
						</td>
                    </tr>
                </table>
            </div>
            <!--[if (gte mso 9)|(IE)]>
                    </td>
                </tr>
            </table>
            <![endif]-->
        </td>
    </tr>
</table>
<!--[if (gte mso 9)|(IE)]>
        </td>
    </tr>
</table>
<![endif]-->

<p>Te recordamos tus credenciales:</p>
<p>Usuario: {{ $paciente_usuario }}</p>
<p>Contrase&ntilde;a: {{ $paciente_contrasena }}</p>