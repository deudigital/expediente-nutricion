<?php

use Illuminate\Database\Seeder;
use App\User;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
		App\User::create([
			'name'		=>	'Danilo Mata',
			'email'		=>	'danilo@deudigital.com',
			'password'	=>	bcrypt('deudigit')
		]);
    }
}
