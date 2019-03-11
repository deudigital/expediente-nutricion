<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <!--<![endif]-->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title></title>
  <style type="text/css">
.ReadMsgBody { width: 100%; background-color: #ffffff; }
.ExternalClass { width: 100%; background-color: #ffffff; }
.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
html { width: 100%; }
body { -webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0; }
table { border-spacing: 0; table-layout: fixed; margin: 0 auto; }
table table table { table-layout: auto; }
.yshortcuts a { border-bottom: none !important; }
img:hover { opacity: 0.9 !important; }
a { color: #cc1f25; text-decoration: none; }
.textbutton a { font-family: 'open sans', arial, sans-serif !important; }
.btn-link a { color: #FFFFFF !important; }
@media only screen and (max-width: 480px) {
body { width: auto !important; }
*[class="table-inner"] { width: 90% !important; text-align: center !important; }
*[class="table-full"] { width: 100% !important; text-align: center !important; }
/* image */
img[class="img1"] { width: 100% !important; height: auto !important; }
}
</style>
</head>
<body>
  <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" bgcolor="#414a51" style="background-size:cover; background-repeat:repeat-x; background-position:top;">
              <table align="center" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="600" align="center">
                    <table class="table-inner" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                      <tr>
                        <td height="50"></td>
                      </tr>
                     
                      <tr>
                        <td height="20"></td>
                      </tr>
                      <tr>
                        <td align="center">
                          <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="35" align="right" valign="bottom">
                                <table width="35" border="0" align="right" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td height="25"></td>
                                  </tr>
                                  <tr>
                                    <td height="25" bgcolor="#FFFFFF" style="border-top-left-radius:6px; font-size:0px;">&nbsp;</td>
                                  </tr>
                                </table>
                              </td>
                              <td align="center" background="https://expediente.nutricion.co.cr/mail/images/title-bg.png" style="background-image: url(images/title-bg.png); background-repeat: repeat-x; background-size: auto; background-position: bottom;">
                                <table style="border-radius:6px;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#90c445">
                                  <tr>
                                    <td height="50" align="center">
                                      <table border="0" align="center" cellpadding="0" cellspacing="0" class="table-inner">
                                        <tr>
                                          <td height="7"></td>
                                        </tr>
                                        <tr>
                                          <td align="center" style="font-family: 'Open sans', Arial, sans-serif; color:#FFFFFF; font-size:16px; font-weight: bold;">Resumen de Consulta</td>
                                        </tr>
                                        <tr>
                                          <td height="7"></td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td width="35" align="left" valign="bottom">
                                <table width="35" border="0" align="left" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td height="25"></td>
                                  </tr>
                                  <tr>
                                    <td height="25" bgcolor="#FFFFFF" style="border-top-right-radius:6px; font-size:0px;">&nbsp;</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <table class="table-inner" bgcolor="#FFFFFF" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td height="30"></td>
                      </tr>
                      <tr>
                        <td align="center">
                          <a href="#">
                            <img style="display:block; line-height:0px; font-size:0px; border:0px; width: 150px" src="{{ $logo?: 'https://expediente.nutricion.co.cr/assets/images/logo.png' }}" alt="logo" title="{{$consulta_id}}" />
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td height="25"></td>
                      </tr>
                      <tr>
                        <td bgcolor="#f3f3f3" align="center">
                          <table align="center" class="table-inner" width="90%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td height="40"></td>
                            </tr>
                            <tr>
                              <td align="center" style="font-family: 'Open sans', Arial, sans-serif; color:#7f8c8d; font-size:14px; line-height: 28px;">
							  {{ $paciente_nombre }}, a continuación, un resumen de las medidas en esta consulta:
                              </td>
                            </tr>
                          </table>
						 
						 <table align="center" class="table-inner" width="90%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td height="40"></td>
                            </tr>
                          </table>
@isset($bva)
@php
	if(count($bva)>0){
	$i	=	0;
@endphp
@foreach ($bva as $key=>$va)
@php
	if($i%2==0)	:
@endphp
						  <table align="center" bgcolor="#ffffff" width="100%" border="0" cellspacing="0" cellpadding="0">
						    <tr>
						      <td height="25"></td>
						    </tr>
						    <tr>
						      <td align="center">
						        <table border="0" align="center" cellpadding="0" cellspacing="0">
						          <tr>
						            <td width="600" align="center">
						              <table width="100%" border="0" cellpadding="0" cellspacing="0">
						                <tr>
						                  <td align="center" style="text-align:center;vertical-align:top;font-size:0;">
						                    <div style="display:inline-block;vertical-align:top;">
						                      <table border="0" align="center" cellpadding="0" cellspacing="0">
						                        <tr>
						                          <td width="300" align="center">
						                            <table bgcolor="#ffffff" style="border:1px solid #FFFFFF;border-bottom:2px solid #e6e6e6;" align="center" width="90%" border="0" cellspacing="0" cellpadding="0">
						                              <tr>
						                                <td height="45" bgcolor="#f5f5f5" align="center">
						                                  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0">
						                                    <tr>
						                                      <td align="right" width="40" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;"> <img style="width: 40px; display:block; line-height:0px; font-size:0px; border:0px;" src="https://expediente.nutricion.co.cr/mail/images/{{ $va['icono'] }}.png" alt="{{ $va['titulo'] }}" /></td>
						                                      <td align="center" style="font-family: 'Open Sans', Arial, sans-serif; font-size:18px;color:#7f8c8d;font-weight:bold;">{{ $va['titulo'] }}</td>
						                                      <td height="45" width="60" align="center" bgcolor="#828482" style="font-family: 'Open Sans', Arial, sans-serif; font-size:22px;color:#FFFFFF;font-weight: bold;padding-left: 15px;padding-right: 15px;font-style: italic;">{{ $va['value'] }}{{ $va['unidad'] }}</td>
						                                    </tr>
						                                  </table>
@php
if($key=='grasa' && isset($va['grasa_detalle']))	:
@endphp
						                                  <table border="0" align="center" cellpadding="0" cellspacing="0">
							                                  <tr >
							                                      <td align="center" height="25" width="100" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;border-top: 1px solid #000;border-bottom: 1px solid #000">Abdominal</td>
							                                      <td  align="center" height="25" width="100" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;border-bottom: 1px solid #000; border-top: 1px solid #000;border-bottom: 1px solid #000">Brazos</td>
							                                      <td align="center" height="25" width="100" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;border-top: 1px solid #000;border-bottom: 1px solid #000">Piernas</td>
							                                    </tr>
							                                    <tr>
							                                      <td align="center" width="100" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;">{{ $va['grasa_detalle']['segmentado_abdominal'] }}%</td>
							                                      <td align="center" width="100" border="0"  style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;">
							                                      			<table >
							                                      				<tr>
							                                      					<td align="center" height="20" width="50">Izq.</td>
							                                      					<td align="center" height="20" width="50">Der.</td>
							                                      				</tr>
							                                      				<tr>
							                                      					<td align="center" height="20" width="50">{{ $va['grasa_detalle']['segmentado_pierna_izquierda'] }}%</td>
							                                      					<td align="center" height="20" width="50">{{ $va['grasa_detalle']['segmentado_pierna_derecha'] }}%</td>
							                                      				</tr>
							                                      			</table>
							                                      </td>
							                                      <td align="center" width="100" cellpadding="0" cellspacing="0" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;">
							                                      			<table>
							                                      				<tr>
							                                      					<td align="center" height="20" width="50">Izq.</td>
							                                      					<td align="center" height="20" width="50">Der.</td>
							                                      				</tr>
							                                      				<tr>
							                                      					<td align="center" height="20" width="50">{{ $va['grasa_detalle']['segmentado_brazo_derecho'] }}%</td>
							                                      					<td align="center" height="20" width="50">{{ $va['grasa_detalle']['segmentado_brazo_derecho'] }}%</td>
							                                      				</tr>
							                                      			</table>
							                                      </td>
							                                  </tr>
							                              </table>
@php
endif;
if($key=='musculo' && isset($va['musculo_detalle']))	:
@endphp
														  
						                                  <table border="0" align="center" cellpadding="0" cellspacing="0">
							                                  <tr >
							                                      <td align="center" height="25" width="100" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;border-top: 1px solid #000;border-bottom: 1px solid #000">Tronco</td>
							                                      <td  align="center" height="25" width="100" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;border-bottom: 1px solid #000; border-top: 1px solid #000;border-bottom: 1px solid #000">Brazos</td>
							                                      <td align="center" height="25" width="100" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;border-top: 1px solid #000;border-bottom: 1px solid #000">Piernas</td>
							                                    </tr>
							                                    <tr>
							                                      <td align="center" width="100" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;">{{ $va['musculo_detalle']['tronco'] }}kg</td>
							                                      <td align="center" width="100" border="0"  style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;">
							                                      			<table >
							                                      				<tr>
							                                      					<td align="center" height="20" width="50">Izq.</td>
							                                      					<td align="center" height="20" width="50">Der.</td>
							                                      				</tr>
							                                      				<tr>
							                                      					<td align="center" height="20" width="50">{{ $va['musculo_detalle']['brazo_izquierdo'] }}kg</td>
							                                      					<td align="center" height="20" width="50">{{ $va['musculo_detalle']['brazo_derecho'] }}kg</td>
							                                      				</tr>
							                                      			</table>
							                                      </td>
							                                      <td align="center" width="100" cellpadding="0" cellspacing="0" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;">
							                                      			<table>
							                                      				<tr>
							                                      					<td align="center" height="20" width="50">Izq.</td>
							                                      					<td align="center" height="20" width="50">Der.</td>
							                                      				</tr>
							                                      				<tr>
							                                      					<td align="center" height="20" width="50">{{ $va['musculo_detalle']['pierna_izquierda'] }}kg</td>
							                                      					<td align="center" height="20" width="50">{{ $va['musculo_detalle']['pierna_derecha'] }}kg</td>
							                                      				</tr>
							                                      			</table>
							                                      </td>
							                                  </tr>
							                              </table>
@php
endif;
@endphp
						                                </td>
						                              </tr>
						                            </table>
						                          </td>
						                        </tr>
						                      </table>
						                    </div>
@php
	else:
@endphp
						                    <div style="display:inline-block;vertical-align:top;">
						                      <table border="0" align="center" cellpadding="0" cellspacing="0">
						                        <tr>
						                          <td width="300" align="center">
						                            <table bgcolor="#ffffff" style="border:1px solid #FFFFFF;border-bottom:2px solid #e6e6e6;" align="center" width="90%" border="0" cellspacing="0" cellpadding="0">
						                              <tr>
						                                <td height="45" bgcolor="#f5f5f5" align="center">
						                                  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0">
						                                    <tr>
						                                      <td align="right" width="40" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;"> <img style="width: 40px; display:block; line-height:0px; font-size:0px; border:0px;" src="https://expediente.nutricion.co.cr/mail/images/{{ $va['icono'] }}.png" alt="{{ $va['titulo'] }}" /></td>
						                                      <td align="center" style="font-family: 'Open Sans', Arial, sans-serif; font-size:18px;color:#7f8c8d;font-weight:bold;">{{ $va['titulo'] }}</td>
						                                      <td height="45" width="60" align="center" bgcolor="#828482" style="font-family: 'Open Sans', Arial, sans-serif; font-size:22px;color:#FFFFFF;font-weight: bold;padding-left: 15px;padding-right: 15px;font-style: italic;">{{ $va['value'] }}{{ $va['unidad'] }}</td>
						                                    </tr>
						                                  </table>
@php
if($key=='grasa' && isset($va['grasa_detalle']))	:
@endphp
						                                  <table border="0" align="center" cellpadding="0" cellspacing="0">
							                                  <tr >
							                                      <td align="center" height="25" width="100" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;border-top: 1px solid #000;border-bottom: 1px solid #000">Abdominal</td>
							                                      <td  align="center" height="25" width="100" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;border-bottom: 1px solid #000; border-top: 1px solid #000;border-bottom: 1px solid #000">Brazos</td>
							                                      <td align="center" height="25" width="100" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;border-top: 1px solid #000;border-bottom: 1px solid #000">Piernas</td>
							                                    </tr>
							                                    <tr>
							                                      <td align="center" width="100" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;">{{ $va['grasa_detalle']['segmentado_abdominal'] }}%</td>
							                                      <td align="center" width="100" border="0"  style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;">
							                                      			<table >
							                                      				<tr>
							                                      					<td align="center" height="20" width="50">Izq.</td>
							                                      					<td align="center" height="20" width="50">Der.</td>
							                                      				</tr>
							                                      				<tr>
							                                      					<td align="center" height="20" width="50">{{ $va['grasa_detalle']['segmentado_pierna_izquierda'] }}%</td>
							                                      					<td align="center" height="20" width="50">{{ $va['grasa_detalle']['segmentado_pierna_derecha'] }}%</td>
							                                      				</tr>
							                                      			</table>
							                                      </td>
							                                      <td align="center" width="100" cellpadding="0" cellspacing="0" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;">
							                                      			<table>
							                                      				<tr>
							                                      					<td align="center" height="20" width="50">Izq.</td>
							                                      					<td align="center" height="20" width="50">Der.</td>
							                                      				</tr>
							                                      				<tr>
							                                      					<td align="center" height="20" width="50">{{ $va['grasa_detalle']['segmentado_brazo_derecho'] }}%</td>
							                                      					<td align="center" height="20" width="50">{{ $va['grasa_detalle']['segmentado_brazo_derecho'] }}%</td>
							                                      				</tr>
							                                      			</table>
							                                      </td>
							                                  </tr>
							                              </table>
@php
endif;
if($key=='musculo' && isset($va['musculo_detalle']))	:
@endphp
						                                  <table border="0" align="center" cellpadding="0" cellspacing="0">
							                                  <tr >
							                                      <td align="center" height="25" width="100" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;border-top: 1px solid #000;border-bottom: 1px solid #000">Tronco</td>
							                                      <td  align="center" height="25" width="100" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;border-bottom: 1px solid #000; border-top: 1px solid #000;border-bottom: 1px solid #000">Brazos</td>
							                                      <td align="center" height="25" width="100" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;border-top: 1px solid #000;border-bottom: 1px solid #000">Piernas</td>
							                                    </tr>
							                                    <tr>
							                                      <td align="center" width="100" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;">{{ $va['musculo_detalle']['tronco'] }}kg</td>
							                                      <td align="center" width="100" border="0"  style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;">
							                                      			<table >
							                                      				<tr>
							                                      					<td align="center" height="20" width="50">Izq.</td>
							                                      					<td align="center" height="20" width="50">Der.</td>
							                                      				</tr>
							                                      				<tr>
							                                      					<td align="center" height="20" width="50">{{ $va['musculo_detalle']['brazo_izquierdo'] }}kg</td>
							                                      					<td align="center" height="20" width="50">{{ $va['musculo_detalle']['brazo_derecho'] }}kg</td>
							                                      				</tr>
							                                      			</table>
							                                      </td>
							                                      <td align="center" width="100" cellpadding="0" cellspacing="0" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px;color:#7f8c8d;font-weight:bold;">
							                                      			<table>
							                                      				<tr>
							                                      					<td align="center" height="20" width="50">Izq.</td>
							                                      					<td align="center" height="20" width="50">Der.</td>
							                                      				</tr>
							                                      				<tr>
							                                      					<td align="center" height="20" width="50">{{ $va['musculo_detalle']['pierna_izquierda'] }}kg</td>
							                                      					<td align="center" height="20" width="50">{{ $va['musculo_detalle']['pierna_derecha'] }}kg</td>
							                                      				</tr>
							                                      			</table>
							                                      </td>
							                                  </tr>
							                              </table>
@php
endif;
@endphp
						                                </td>
						                              </tr>
						                            </table>
						                          </td>
						                        </tr>
						                      </table>
						                    </div>
						                  </td>
						                </tr>
						              </table>
						            </td>
						          </tr>
						        </table>
						      </td>
						    </tr>
						  </table>
@php
	endif;
@endphp
@php
	$i++;
@endphp
@endforeach
@php
	}
@endphp
@endisset

@isset($bprescripcion)
		   					<table class="table-inner" bgcolor="#FFFFFF" width="100%" border="0" cellspacing="0" cellpadding="0">
		                      <tr>
		                        <td height="30"></td>
		                      </tr>
		                      <tr>
		                        <td bgcolor="#f3f3f3" align="center">
		                          <table align="center" class="table-inner" width="90%" border="0" cellspacing="0" cellpadding="0">
		                            <tr>
		                              <td height="40"></td>
		                            </tr>
		                            <tr>
		                              <td align="center" style="font-family: 'Open sans', Arial, sans-serif; color:#7f8c8d; font-size:14px; line-height: 28px;">
		                                Asimismo, acá tienes el total de porciones que debes comer día a día según lo indicado por la nutricionista:
		                              </td>
		                            </tr>
		                            <tr>
		                              <td height="40"></td>
		                            </tr>
		                          </table>
		                          <tr>
		                              <td height="20"></td>
		                          </tr>
		                        </td>
		                      </tr>
		                    </table>

						  <table align="center" bgcolor="#ffffff" width="100%" border="0" cellspacing="0" cellpadding="0">
						    <tr>
						      <td align="center">
						        <table border="0" align="center" cellpadding="0" cellspacing="0">
						          <tr>
						            <td width="600" align="center">
						              <table width="100%" border="0" cellpadding="0" cellspacing="0">
						                <tr>
						                  <td align="center" style="text-align:center;vertical-align:top;font-size:0;">
@php
	$i	=	0;
@endphp
@foreach ($bprescripcion as $prescripcion)
						                    <div style="display:inline-block;vertical-align:top;">
						                      <table border="0" align="center" cellpadding="0" cellspacing="0">
						                        <tr>
						                          <td width="200" align="center">
						                            <table class="table-inner" width="90%" bgcolor="#ffffff" style="border:1px solid #FFFFFF;border-bottom:2px solid #e6e6e6;" align="center" border="0" cellspacing="0" cellpadding="0">
						                              <tr>
						                                <td align="center" style="line-height: 0px;"><img style="display:block; line-height:0px; font-size:0px; border:0px; width: 100px" class="img1" src="https://expediente.nutricion.co.cr/mail/images/{{ $prescripcion->grupo_alimento_nutricionista_imagen }}" alt="{{ $prescripcion->nombre }}" /></td>
						                              </tr>
						                              <tr>
						                                <td height="15"></td>
						                              </tr>
						                              <tr>
						                                <td align="center">
						                                  <table width="90%" border="0" align="center" cellpadding="0" cellspacing="0">
						                                    <tr>
						                                      <td align="center" style="font-family: 'Open Sans', Arial, sans-serif; font-size:14px;color:#3b3b3b;font-weight: bold;">{{ $prescripcion->nombre }}</td>
						                                    </tr>
						                                    <tr>
						                                      <td height="15"></td>
						                                    </tr>
						                                    <tr>
						                                      <td align="center">
						                                        <table border="0" align="center" cellpadding="0" cellspacing="0">
						                                          <tr>
						                                            <td align="center">
						                                              <table bgcolor="#90c445" style="border-radius:5px;" align="center" border="0" cellpadding="0" cellspacing="0">
						                                                <tr>
						                                                  <td style="font-size:0px; line-height:0px;" height="5" width="5">&nbsp;</td>
						                                                </tr>
						                                              </table>
						                                            </td>
						                                            <td width="15"></td>
						                                            <td align="center">
						                                              <table bgcolor="#90c445" style="border-radius:5px;" align="center" border="0" cellpadding="0" cellspacing="0">
						                                                <tr>
						                                                  <td style="font-size:0px; line-height:0px;" height="5" width="5">&nbsp;</td>
						                                                </tr>
						                                              </table>
						                                            </td>
						                                            <td width="15"></td>
						                                            <td align="center">
						                                              <table bgcolor="#90c445" style="border-radius:5px;" align="center" border="0" cellpadding="0" cellspacing="0">
						                                                <tr>
						                                                  <td style="font-size:0px; line-height:0px;" height="5" width="5">&nbsp;</td>
						                                                </tr>
						                                              </table>
						                                            </td>
						                                          </tr>
						                                        </table>
						                                      </td>
						                                    </tr>
						                                    <tr>
						                                      <td height="10"></td>
						                                    </tr>
						                                    <tr>
						                                      <td align="center" style="font-family: 'Open Sans', Arial, sans-serif; font-size:14px;color:#7f8c8d;line-height: 28px; font-weight:normal;">{{ $prescripcion->porciones + 0 }}</td>
						                                    </tr>
						                                  </table>
						                                </td>
						                              </tr>
						                            </table>
						                          </td>
						                        </tr>
						                        <tr>
						                          <td height="25"></td>
						                        </tr>
						                      </table>
						                    </div>
@php
	$i++;
	if($i%3==0)	:
@endphp
						                  </td>
						                </tr>
						              </table>
						            </td>
						          </tr>
						        </table>
						      </td>
						    </tr>
						  </table>
						  <table align="center" bgcolor="#ffffff" width="100%" border="0" cellspacing="0" cellpadding="0">
						    <tr>
						      <td align="center">
						        <table border="0" align="center" cellpadding="0" cellspacing="0">
						          <tr>
						            <td width="600" align="center">
						              <table width="100%" border="0" cellpadding="0" cellspacing="0">
						                <tr>
						                  <td align="center" style="text-align:center;vertical-align:top;font-size:0;">
@php
	endif;	
@endphp
@endforeach
						                  </td>
						                </tr>
						              </table>
						            </td>
						          </tr>
						        </table>
						      </td>
						    </tr>
						  </table>
@endisset

@isset($bpatronmenu)
		   					<table class="table-inner" bgcolor="#FFFFFF" width="100%" border="0" cellspacing="0" cellpadding="0">
		                      <tr>
		                        <td height="30"></td>
		                      </tr>
		                      <tr>
		                        <td bgcolor="#f3f3f3" align="center">
		                          <table align="center" class="table-inner" width="90%" border="0" cellspacing="0" cellpadding="0">
		                            <tr>
		                              <td height="40"></td>
		                            </tr>
		                            <tr>
		                              <td align="center" style="font-family: 'Open sans', Arial, sans-serif; color:#7f8c8d; font-size:14px; line-height: 28px;">
		                                Además, acá tienes el detalle de como dividir estas porciones en los diferentes tiempos de comida con sus respectivos ejemplos:
		                              </td>
		                            </tr>
		                            <tr>
		                              <td height="40"></td>
		                            </tr>
		                          </table>
		                          <tr>
		                              <td height="20"></td>
		                          </tr>
		                        </td>
		                      </tr>
		                    </table>
@foreach ($bpatronmenu as $patronmenu)
@php
$porciones	=	'';
if(isset($patronmenu['menu']))
	$porciones	=	implode(', ', $patronmenu['menu'])
@endphp

@php
	if(!empty($patronmenu['ejemplo']) || $porciones)	:
@endphp
						  <table bgcolor="#ffffff" align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
						    <tr>
						      <td height="25"></td>
						    </tr>
						    <tr>
						      <td align="center">
						        <table border="0" align="center" cellpadding="0" cellspacing="0">
						          <tr>
						            <td width="600" align="center">
						              <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0">
						                <tr>
						                  <td align="center" style="text-align:center;vertical-align:top;font-size:0;">
						                    <div style="display:inline-block;vertical-align:top;">
						                      <table align="center" border="0" cellpadding="0" cellspacing="0">
						                        <tr>
						                          <td width="600" align="center">
						                            <table class="table-full" width="90%" border="0" align="center" cellpadding="0" cellspacing="0">
						                              <tr>
						                                <td align="center">
						                                  <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
						                                    <tr>
						                                      <td width="30" align="right">
						                                        <table width="30" border="0" align="right" cellpadding="0" cellspacing="0">
						                                          <tr>
						                                            <td height="25"></td>
						                                          </tr>
						                                          <tr>
						                                            <td height="25" bgcolor="#FFFFFF" style="border-top-left-radius:6px;"></td>
						                                          </tr>
						                                        </table>
						                                      </td>
						                                      <td rowspan="2" align="center" background="https://expediente.nutricion.co.cr/mail/images/title-bg.png" style="background-image: url(images/title-bg.png); background-repeat: repeat-x; background-size: auto; background-position: bottom;">
						                                        <table style="border-radius:6px;" class="table-title" width="100%" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#828482">
						                                          <tr>
						                                            <td width="600" height="35" align="center" style="padding-left: 15px;padding-right: 15px; font-family: 'Open Sans', Arial, sans-serif; font-size: 16px;color:#FFFFFF;line-height: 28px;font-weight: bold;">{{ $patronmenu['nombre'] }}</td>
						                                          </tr>
						                                        </table>
						                                      </td>
						                                      <td width="30" align="left">
						                                        <table width="30" border="0" align="left" cellpadding="0" cellspacing="0">
						                                          <tr>
						                                            <td height="25"></td>
						                                          </tr>
						                                          <tr>
						                                            <td height="25" bgcolor="#FFFFFF" style="border-top-right-radius:6px;"></td>
						                                          </tr>
						                                        </table>
						                                      </td>
						                                    </tr>
						                                  </table>
						                                </td>
						                              </tr>
						                              <tr>
						                                <td bgcolor="#FFFFFF" align="center" style="border-bottom-left-radius:6px;border-bottom-right-radius:6px;">
						                                  <table align="center" class="table-inner" width="90%" border="0" cellspacing="0" cellpadding="0">
						                                    <tr>
						                                      <td height="10"></td>
						                                    </tr>
						                                    <tr>
						                                      <td align="center" style="font-family: 'Open Sans', Arial, sans-serif; color:#414a51; font-size:16px; line-height: 28px; font-weight: bold;">{{ $porciones }}</td>
						                                    </tr>
						                                    <tr>
						                                      <td height="10"></td>
						                                    </tr>
@php
	if(!empty($patronmenu['ejemplo']))	:
@endphp

						                                    <tr>
						                                      <td align="center">
						                                        <table border="0" align="center" cellpadding="0" cellspacing="0">
						                                          <tr>
						                                            <td align="center">
						                                              <table bgcolor="#90c445" style="border-radius:5px;" align="center" border="0" cellpadding="0" cellspacing="0">
						                                                <tr>
						                                                  <td style="font-size:0px; line-height:0px;" height="5" width="5">&nbsp;</td>
						                                                </tr>
						                                              </table>
						                                            </td>
						                                            <td width="15"></td>
						                                            <td align="center">
						                                              <table bgcolor="#90c445" style="border-radius:5px;" align="center" border="0" cellpadding="0" cellspacing="0">
						                                                <tr>
						                                                  <td style="font-size:0px; line-height:0px;" height="5" width="5">&nbsp;</td>
						                                                </tr>
						                                              </table>
						                                            </td>
						                                            <td width="15"></td>
						                                            <td align="center">
						                                              <table bgcolor="#90c445" style="border-radius:5px;" align="center" border="0" cellpadding="0" cellspacing="0">
						                                                <tr>
						                                                  <td style="font-size:0px; line-height:0px;" height="5" width="5">&nbsp;</td>
						                                                </tr>
						                                              </table>
						                                            </td>
						                                          </tr>
						                                        </table>
						                                      </td>
						                                    </tr>
						                                    <tr>
						                                      <td height="15"></td>
						                                    </tr>
						                                    <tr>
						                                      <td align="center" style="font-family: 'Open sans', Arial, sans-serif; color:#7f8c8d; font-size:14px; line-height: 28px;">
						                                        {{ $patronmenu['ejemplo'] }}
						                                      </td>
						                                    </tr>
@php
	endif;	
@endphp
						                                  </table>
						                                </td>
						                              </tr>
						                            </table>
						                          </td>
						                        </tr>
						                      </table>
						                    </div>
						                  </td>
						                </tr>
						              </table>
						            </td>
						          </tr>
						        </table>
						      </td>
						    </tr>
						  </table>
@php
	endif;	
@endphp

@endforeach

@endisset

		   					<table class="table-inner" bgcolor="#FFFFFF" width="100%" border="0" cellspacing="0" cellpadding="0">
		                      <tr>
		                        <td height="30"></td>
		                      </tr>
		                      <tr>
		                        <td bgcolor="#f3f3f3" align="center">
		                          <table align="center" class="table-inner" width="90%" border="0" cellspacing="0" cellpadding="0">
		                            <tr>
		                              <td height="40"></td>
		                            </tr>
		                            <tr>
		                              <td align="center" style="font-family: 'Open sans', Arial, sans-serif; color:#7f8c8d; font-size:14px; line-height: 28px;">
		                                Finalmente, toda esta información y otras herramientas para llevar el registro de lo que comes día a día y ayudarte a cumplir tus objetivos están disponibles en el app de <strong>NutriTrack</strong>, si aún no la tienes descárgala <strong>GRATIS</strong> en las tiendas de iPhone y Android.  <br/>Te recordamos tus credenciales:
										<br/><strong>Usuario:</strong> {{ $paciente_usuario }}
										<br/><strong>Contraseña:</strong> {{ $paciente_contrasena }}
		                              </td>
		                            </tr>
		                            <tr>
		                              <td height="40"></td>
		                            </tr>
		                          </table>
		                          <tr>
		                              <td height="20"></td>
		                          </tr>
		                        </td>
		                      </tr>
								                      <tr>
								                        <td align="center">
								                          <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
								                            <tr>
								                              <td align="center" style="text-align:center;vertical-align:top;font-size:0;">
								                                <div style="display:inline-block;vertical-align:top;">
								                                  <table border="0" align="center" cellpadding="0" cellspacing="0">
								                                    <tr>
								                                      <td align="center" width="180">
								                                        <table width="85%" border="0" align="center" cellpadding="0" cellspacing="0"  class="textbutton" style="border-radius:4px;">
								                                          <tr>
								                                            <td class="btn-link" height="40" align="center" style="font-family: 'Open sans', Arial, sans-serif; color:#FFFFFF; font-weight:bold;font-size:13px;padding-left: 20px;padding-right: 20px;"><a target="_black" href="https://itunes.apple.com/us/app/nutritrack/id1302386185?l=es&mt=8"><img style="display:block; line-height:0px; font-size:0px; border:0px; width: 200px" src="https://expediente.nutricion.co.cr/mail/images/app-store.png" alt="logo" /></a></td>
								                                          </tr>
								                                        </table>
								                                      </td>
								                                    </tr>
								                                    <tr>
								                                      <td height="15"></td>
								                                    </tr>
								                                  </table>
								                                </div>
								                                <div style="display:inline-block;vertical-align:top;">
								                                  <table border="0" align="center" cellpadding="0" cellspacing="0">
								                                    <tr>
								                                      <td align="center" width="180">
								                                        <table width="85%" border="0" align="center" cellpadding="0" cellspacing="0" class="textbutton" style="border-radius:4px;">
								                                          <tr>
								                                            <td class="btn-link" height="40" align="center" style="font-family: 'Open sans', Arial,  sans-serif; font-weight:bold;color:#FFFFFF; font-size:13px;padding-left: 20px;padding-right: 20px;"><a target="_black" href="https://play.google.com/store/apps/details?id=cr.co.nutricion.nutritrack"><img style="display:block; line-height:0px; font-size:0px; border:0px; width: 200px" src="https://expediente.nutricion.co.cr/mail/images/play-store.png" alt="logo" /></a></a></td>
								                                          </tr>
								                                        </table>
								                                      </td>
								                                    </tr>
								                                  </table>
								                                </div>
								                              </td>
								                            </tr>
								                          </table>
								                        </td>
								                      </tr>
		                    </table>
                        </td>
                      </tr>
                      <tr>
                        <td height="45"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>