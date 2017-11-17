<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDatabaseInsertData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('hcp_patologias')->insert([
            ['nombre' => 'Estreñimiento'],
            ['nombre' => 'Colitis'],
            ['nombre' => 'Reflujo'],
            ['nombre' => 'Gastritis'],
            ['nombre' => 'Celiaquia'],
            ['nombre' => 'Hernia hiatal'],
            ['nombre' => 'Obesidad'],
            ['nombre' => 'Hipertensión'],
            ['nombre' => 'Hipertiroidismo'],
            ['nombre' => 'Diabetes'],
            ['nombre' => 'Dislipidemias'],
            ['nombre' => 'Hipotiroidismo'],
            ['nombre' => 'Cancer'],
            ['nombre' => 'Migraña'],
            ['nombre' => 'Ovario Poliquístico'],
            ['nombre' => 'Enfermedades del Corazón']
        ]);
        DB::table('alergias')->insert([
            ['nombre' => 'Lacteos'],
            ['nombre' => 'Gluten'],
            ['nombre' => 'Huevo'],
            ['nombre' => 'Mariscos'],
            ['nombre' => 'Frutos Secos'],
            ['nombre' => 'Frutas'],
            ['nombre' => 'Vegetales'],
            ['nombre' => 'Legumbres'],
            ['nombre' => 'Cereales'],
            ['nombre' => 'Carnes']
        ]);
        DB::table('hcf_patologias')->insert([
            ['nombre' => 'Enfermedades Endocrinológicas'],
            ['nombre' => 'Enfermedades del Tacto'],
            ['nombre' => 'Enfermedades del Sistema'],
            ['nombre' => 'Enfermedades Mebólicas'],
            ['nombre' => 'Enfermedades del Sistema Nervioso'],
            ['nombre' => 'Cancer']
        ]);
        DB::table('ejercicios')->insert([
            ['nombre' => 'Natación', 'mets' => 1.00]
        ]);
        DB::table('servicios')->insert([
            ['nombre' => 'Expediente'],
            ['nombre' => 'App'],
            ['nombre' => 'Sitio Web'],
            ['nombre' => 'Publicidad'],
            ['nombre' => 'Factura Digital'],
            ['nombre' => 'Agenda electrónica']
        ]);
        DB::table('indice_glicemicos')->insert([
            ['nombre' => 'Alto'],
            ['nombre' => 'Medio'],
            ['nombre' => 'Bajo'],

        ]);
		DB::table('categoria_alimentos')->insert([
			['nombre' =>  'Lácteos'],
			['nombre' =>  'Vegetales'],
			['nombre' =>  'Frutas'],
			['nombre' =>  'Harinas'],
			['nombre' =>  'Licores'],
			['nombre' =>  'Carnes'],
			['nombre' =>  'Grasas'],
			['nombre' =>  'Azúcares'],
			['nombre' =>  'Postres'],
			['nombre' =>  'Alimentos Compuestos'],
			['nombre' =>  'Comidas Rápidas'],
			['nombre' =>  'Bebidas y Suplementos'],
			['nombre' =>  'Alimentos Libres'],
		]);
        DB::table('grupo_alimentos')->insert([            
            ['nombre' => 'Leche'],
            ['nombre' => 'Vegetales'],
            ['nombre' => 'Frutas'],
            ['nombre' => 'Harinas'],
            ['nombre' => 'Carne'],
            ['nombre' => 'Azucares'],
            ['nombre' => 'Grasas'],
            ['nombre' => 'Agua'],
        ]);
        /*DB::table('grupo_alimento_nutricionistas')->insert([            
            ['nombre' => '']
        ]);*/
        DB::table('tiempo_comidas')->insert([
            ['nombre' => 'Desayuno'],
            ['nombre' => 'Media Mañana'],
            ['nombre' => 'Almuerzo'],
            ['nombre' => 'Media Tarde'],
            ['nombre' => 'Cena'],
            ['nombre' => 'Colacion Nocturna']
        ]);
		DB::table('cat_valor_dieteticas')->insert([            
            ['descripcion' => 'Desayuno'],
            ['descripcion' => 'Media Mañana'],
            ['descripcion' => 'Almuerzo'],
            ['descripcion' => 'Media tarde'],
            ['descripcion' => 'Cena'],
            ['descripcion' => 'Colación nocturna'],
            ['descripcion' => 'Agua'],
            ['descripcion' => 'Gaseosas'],
            ['descripcion' => 'Jugos empacados'],
            ['descripcion' => 'Comidas rápidas'],
            ['descripcion' => 'Alimentos empacados'],
            ['descripcion' => 'Embutidos'],
        ]);
        DB::table('personas')->insert([
			['cedula' =>  '401830874', 'nombre' =>  'Tatiana Soto Vargas', 'genero' =>  'F', 'fecha_nac' =>  NULL, 'telefono' =>  '', 'celular' =>  '61667659', 'email' =>  'Dra.tatiana.soto@gmail.com', 'provincia' =>  '', 'canton' =>  '', 'distrito' =>  '', 'detalles_direccion' =>  ''],
			['cedula' =>  '111350967', 'nombre' =>  'Nancy Murillo CedeÃ±o', 'genero' =>  'F', 'fecha_nac' =>  NULL, 'telefono' =>  '', 'celular' =>  '88266473', 'email' =>  'nancymurillo4@hotmail.com', 'provincia' =>  '', 'canton' =>  '', 'distrito' =>  '', 'detalles_direccion' =>  ''],
			['cedula' =>  '112640680', 'nombre' =>  'Betty ChacÃ³n Ruiz', 'genero' =>  'F', 'fecha_nac' =>  NULL, 'telefono' =>  '', 'celular' =>  '83381112', 'email' =>  'bionutricr@gmail.com', 'provincia' =>  '', 'canton' =>  '', 'distrito' =>  '', 'detalles_direccion' =>  ''],
			['cedula' =>  '', 'nombre' =>  'Laura Mata Corella', 'genero' =>  'F', 'fecha_nac' =>  NULL, 'telefono' =>  '', 'celular' =>  '83788027', 'email' =>  'lauramata_c@hotmail.com', 'provincia' =>  '', 'canton' =>  '', 'distrito' =>  '', 'detalles_direccion' =>  ''],
			['cedula' =>  '83993408', 'nombre' =>  'Melania Coto', 'genero' =>  'F', 'fecha_nac' =>  NULL, 'telefono' =>  '', 'celular' =>  '83993408', 'email' =>  'melacoto@hotmail.com', 'provincia' =>  '', 'canton' =>  '', 'distrito' =>  '', 'detalles_direccion' =>  ''],
			['cedula' =>  '202550143', 'nombre' =>  'Oscar Rojas', 'genero' =>  'M', 'fecha_nac' =>  '1997-10-18', 'telefono' =>  '2442-6644', 'celular' =>  '8231-6546', 'email' =>  'oscar@deudigital.com', 'provincia' =>  'Alajuela', 'canton' =>  'Alajuela', 'distrito' =>  'Alajuela', 'detalles_direccion' =>  '50m este de Pinturas Sur AgonÃ­a'],
			['cedula' =>  '602580325', 'nombre' =>  'Veronica Vargas', 'genero' =>  'F', 'fecha_nac' =>  '1995-10-19', 'telefono' =>  '2235-8901', 'celular' =>  '6512-9820', 'email' =>  'veronica@deudigital.com', 'provincia' =>  'Heredia', 'canton' =>  'Flores', 'distrito' =>  'San Joaquin', 'detalles_direccion' =>  '100 sur y 50 este de la Iglesia'],
			['cedula' =>  '1-1366-1365', 'nombre' =>  'Mario Ramirez', 'genero' =>  'M', 'fecha_nac' =>  '1977-10-10', 'telefono' =>  '2222-2524', 'celular' =>  '8357-8510', 'email' =>  'mario@deudigital.com', 'provincia' =>  'San JosÃ©', 'canton' =>  'San JosÃ©', 'distrito' =>  'Uruca', 'detalles_direccion' =>  '300m este de la corte'],
		]);
		DB::table('alimentos')->insert([
			['nombre' =>  'Helados Light', 'medida_porcion' =>  '½ taza', 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 2, 'categoria_alimento_id' => 1],
			['nombre' =>  'Leche agria descremada', 'medida_porcion' =>  '1 taza', 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 3, 'categoria_alimento_id' => 1],
			['nombre' =>  'Acelga', 'medida_porcion' =>  '1 taza', 'gluten' =>  '0', 'fibra' =>  '1', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 3, 'categoria_alimento_id' => 2],
			['nombre' =>  'Albahaca', 'medida_porcion' =>  '1 taza', 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 3, 'categoria_alimento_id' => 2],
			['nombre' =>  'Agua de pipa', 'medida_porcion' =>  '½ taza', 'gluten' =>  '0', 'fibra' =>  '1', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 2, 'categoria_alimento_id' => 3],
			['nombre' =>  'Albaricoque', 'medida_porcion' =>  '1 unid.', 'gluten' =>  '0', 'fibra' =>  '1', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 2, 'categoria_alimento_id' => 3],
			['nombre' =>  'Afrecho', 'medida_porcion' =>  '3 cdas', 'gluten' =>  '1', 'fibra' =>  '1', 'sodio' =>  '0', 'antioxidantes' =>  '1', 'indice_glicemico_id' => 3, 'categoria_alimento_id' => 4],
			['nombre' =>  'Almidón de maiz', 'medida_porcion' =>  '2 cdas', 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 2, 'categoria_alimento_id' => 4],
			['nombre' =>  'Absinthe /absinta', 'medida_porcion' =>  '1 oz', 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 1, 'categoria_alimento_id' => 5],
			['nombre' =>  'Aquardiente', 'medida_porcion' =>  '1 oz', 'gluten' =>  '1', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 1, 'categoria_alimento_id' => 5],
			['nombre' =>  'Almejas', 'medida_porcion' =>  '1 oz', 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 2, 'categoria_alimento_id' => 6],
			['nombre' =>  'Atún escurrido en agua', 'medida_porcion' =>  '2 cdas', 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '1', 'antioxidantes' =>  '1', 'indice_glicemico_id' => 1, 'categoria_alimento_id' => 6],
			['nombre' =>  'Aceite vegetal (canola,oliva, girasol,soya, maíz)', 'medida_porcion' =>  '1 cda', 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 2, 'categoria_alimento_id' => 7],
			['nombre' =>  'Aceituna negra', 'medida_porcion' =>  '6 unids', 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '1', 'antioxidantes' =>  '1', 'indice_glicemico_id' => 2, 'categoria_alimento_id' => 7],
			['nombre' =>  'Manjar', 'medida_porcion' =>  '1 cdta', 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 1, 'categoria_alimento_id' => 8],
			['nombre' =>  'Melaza', 'medida_porcion' =>  '1 cdta', 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 1, 'categoria_alimento_id' => 8],
			['nombre' =>  'Arroz con leche', 'medida_porcion' =>  '1 taza', 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 1, 'categoria_alimento_id' => 9],
			['nombre' =>  'Brownies', 'medida_porcion' =>  '1 cuadrado del tamaño de la palma de\r\nla mano:', 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 1, 'categoria_alimento_id' => 9],
			['nombre' =>  'Arroz cantonés', 'medida_porcion' =>  '1 taza', 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '1', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 2, 'categoria_alimento_id' => 10],
			['nombre' =>  'Arroz combinado (con pollo, atún, carne, camarones*, etc)', 'medida_porcion' =>  '1 taza', 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 1, 'categoria_alimento_id' => 10],
			['nombre' =>  'Bagel de queso crema con salmón', 'medida_porcion' =>  '1 sandwich', 'gluten' =>  '1', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 1, 'categoria_alimento_id' => 11],
			['nombre' =>  'Biscuit de salchicha de desayuno', 'medida_porcion' =>  '1 sandwich', 'gluten' =>  '1', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 1, 'categoria_alimento_id' => 11],
			['nombre' =>  'Aloe Beta', 'medida_porcion' =>  '1 Porción', 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 1, 'categoria_alimento_id' => 12],
			['nombre' =>  'Bebidas hidratantes', 'medida_porcion' =>  '1 Porción', 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 1, 'categoria_alimento_id' => 12],
			['nombre' =>  'Aceite en aerosol', 'medida_porcion' =>  NULL, 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 1, 'categoria_alimento_id' => 13],
			['nombre' =>  'Agua gasificada sin azúcar', 'medida_porcion' =>  NULL, 'gluten' =>  '0', 'fibra' =>  '0', 'sodio' =>  '0', 'antioxidantes' =>  '0', 'indice_glicemico_id' => 1, 'categoria_alimento_id' => 13],
		]);
		DB::table('alimento_grupos')->insert([
			['alimento_id' => 1, 'grupo_alimento_id' => 1, 'porcion' =>  1.00],
			['alimento_id' => 2, 'grupo_alimento_id' => 1, 'porcion' =>  1.00],
			['alimento_id' => 3, 'grupo_alimento_id' => 2, 'porcion' =>  1.00],
			['alimento_id' => 4, 'grupo_alimento_id' => 2, 'porcion' =>  1.00],
			['alimento_id' => 5, 'grupo_alimento_id' => 3, 'porcion' =>  1.00],
			['alimento_id' => 6, 'grupo_alimento_id' => 3, 'porcion' =>  1.00],
			['alimento_id' => 7, 'grupo_alimento_id' => 4, 'porcion' =>  1.00],
			['alimento_id' => 8, 'grupo_alimento_id' => 4, 'porcion' =>  1.00],
			['alimento_id' => 9, 'grupo_alimento_id' => 4, 'porcion' =>  1.00],
			['alimento_id' => 10, 'grupo_alimento_id' => 4, 'porcion' =>  1.00],
			['alimento_id' => 11, 'grupo_alimento_id' => 5, 'porcion' =>  1.00],
			['alimento_id' => 12, 'grupo_alimento_id' => 5, 'porcion' =>  1.00],
			['alimento_id' => 13, 'grupo_alimento_id' => 7, 'porcion' =>  1.00],
			['alimento_id' => 14, 'grupo_alimento_id' => 7, 'porcion' =>  1.00],
			['alimento_id' => 15, 'grupo_alimento_id' => 6, 'porcion' =>  1.00],
			['alimento_id' => 16, 'grupo_alimento_id' => 6, 'porcion' =>  1.00],
			['alimento_id' => 17, 'grupo_alimento_id' => 1, 'porcion' =>  1.00],
			['alimento_id' => 17, 'grupo_alimento_id' => 4, 'porcion' =>  2.00],
			['alimento_id' => 17, 'grupo_alimento_id' => 6, 'porcion' =>  3.00],
			['alimento_id' => 17, 'grupo_alimento_id' => 7, 'porcion' =>  2.00],
			['alimento_id' => 18, 'grupo_alimento_id' => 4, 'porcion' =>  2.00],
			['alimento_id' => 18, 'grupo_alimento_id' => 7, 'porcion' =>  2.00],
			['alimento_id' => 18, 'grupo_alimento_id' => 6, 'porcion' =>  2.00],
			['alimento_id' => 19, 'grupo_alimento_id' => 4, 'porcion' =>  2.00],
			['alimento_id' => 19, 'grupo_alimento_id' => 7, 'porcion' =>  2.00],
			['alimento_id' => 19, 'grupo_alimento_id' => 5, 'porcion' =>  1.00],
			['alimento_id' => 20, 'grupo_alimento_id' => 4, 'porcion' =>  4.00],
			['alimento_id' => 20, 'grupo_alimento_id' => 7, 'porcion' =>  2.00],
			['alimento_id' => 20, 'grupo_alimento_id' => 5, 'porcion' =>  2.00],
			['alimento_id' => 21, 'grupo_alimento_id' => 4, 'porcion' =>  2.00],
			['alimento_id' => 21, 'grupo_alimento_id' => 5, 'porcion' =>  3.00],
			['alimento_id' => 21, 'grupo_alimento_id' => 7, 'porcion' =>  4.00],
			['alimento_id' => 22, 'grupo_alimento_id' => 4, 'porcion' =>  2.00],
			['alimento_id' => 22, 'grupo_alimento_id' => 5, 'porcion' =>  3.00],
			['alimento_id' => 23, 'grupo_alimento_id' => 3, 'porcion' =>  2.00],
			['alimento_id' => 23, 'grupo_alimento_id' => 7, 'porcion' =>  1.00],
			['alimento_id' => 22, 'grupo_alimento_id' => 7, 'porcion' =>  4.00],
			['alimento_id' => 24, 'grupo_alimento_id' => 4, 'porcion' =>  1.00],
		]);
		DB::table('nutricionistas')->insert([
			['persona_id' => 1, 'usuario' =>  'Dra.tatiana.soto@gmail.com', 'contrasena' =>  '123123123', 'activo' =>  '1'],
			['persona_id' => 2, 'usuario' =>  'nancymurillo4@hotmail.com', 'contrasena' =>  '123123123', 'activo' =>  '1'],
			['persona_id' => 3, 'usuario' =>  'bionutricr@gmail.com', 'contrasena' =>  '123123123', 'activo' =>  '1'],
			['persona_id' => 4, 'usuario' =>  'lauramata_c@hotmail.com', 'contrasena' =>  '123123123', 'activo' =>  '1'],
			['persona_id' => 5, 'usuario' =>  'melacoto@hotmail.com\r\n', 'contrasena' =>  '123123123', 'activo' =>  '1'],
        ]);
        DB::table('pacientes')->insert([
            ['persona_id' => 6, 'notas_patologias' => 'Nunc efficitur eros ut lacus dictum tempor.', 'otras_patologias' => 'Mauris dapibus consequat ligula in viverra.', 'notas_alergias' => 'Phasellus ac risus ut nunc elementum sollicitudin sed et nunc.', 'notas_medicamentos' => 'Phasellus sit amet consequat ex, ut sollicitudin quam.', 'notas_otros' => 'Nullam a elit vel leo elementum laoreet. Nam condimentum congue mi ac mollis.', 'nutricionista_id' => 1, 'responsable_id' => NULL, 'usuario' => 'oscarrojas', 'contrasena' => '12345678' ],
            ['persona_id' => 7, 'notas_patologias' => 'Nulla facilisi. Etiam eu nisl eu elit ornare ornare vitae id est. ', 'otras_patologias' => 'Mauris bibendum tincidunt diam vitae vestibulum.', 'notas_alergias' => 'Phasellus sed urna eros. Nulla volutpat, metus vitae consectetur imperdiet', 'notas_medicamentos' => 'Cras sagittis finibus libero eu tristique.', 'notas_otros' => 'Donec ut interdum diam. Proin euismod, turpis nec pulvinar tincidunt,', 'nutricionista_id' => 2, 'responsable_id' => NULL, 'usuario' => 'veronicavargas', 'contrasena' => '56781234' ],
            ['persona_id' => 8, 'notas_patologias' => 'Aenean tincidunt cursus nibh in mattis. Fusce et fermentum odio. ', 'otras_patologias' => 'Pellentesque lacinia mi id mauris mattis,', 'notas_alergias' => 'Morbi congue blandit aliquam. Fusce eleifend erat efficitur erat aliquam facilisis.', 'notas_medicamentos' => 'Aenean scelerisque molestie sapien vel tincidunt. Quisque sollicitudin urna ac erat aliquet, sed consequat nulla volutpat.', 'notas_otros' => 'Fusce consequat diam vitae quam imperdiet, vitae hendrerit tellus tincidunt. Interdum et malesuada fames ac ante ipsum primis in faucibus. ', 'nutricionista_id' => 3, 'responsable_id' => NULL, 'usuario' => 'marioramirez', 'contrasena' => '15263748' ],
        ]);
        DB::table('consultas')->insert([
            ['fecha' => DB::raw('now()'), 'notas' => 'In sem arcu, hendrerit nec elit faucibus, malesuada euismod metus.', 'paciente_id' => 6 ],
            ['fecha' => DB::raw('now()'), 'notas' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ', 'paciente_id' => 7 ],
            ['fecha' => DB::raw('now()'), 'notas' => 'Phasellus in nisi urna. Vivamus vel sem quis ipsum iaculis aliquet.', 'paciente_id' => 8 ],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
