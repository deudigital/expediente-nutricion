import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-factura',
  templateUrl: './config-factura.component.html',
  styleUrls: ['./config-factura.component.css']
})
export class ConfigFacturaComponent implements OnInit {

	areaCodes = [
	{
		'country'	: 	'Afghanistan',
		'code'		:	'93'
	},
	{
		'country'	: 	'Albania',
		'code'		:	'355'
	},
	{
		'country'	: 	'Algeria',
		'code'		:	'213'
	},
	{
		'country'	: 	'American Samoa',
		'code'		:	'1-684'
	},
	{
		'country'	: 	'Andorra',
		'code'		:	'376'
	},
	{
		'country'	: 	'Angola',
		'code'		:	'244'
	},
	{
		'country'	: 	'Anguilla',
		'code'		:	'1-264'
	},
	{
		'country'	: 	'Anguilla',
		'code'		:	'1-264'
	},
	{
		'country'	: 	'Antarctica',
		'code'		:	'672'
	},
	{
		'country'	: 	'Antigua and Barbuda',
		'code'		:	'1-268'
	},
	{
		'country'	: 	'Argentina',
		'code'		:	'54'
	},
	{
		'country'	: 	'Armenia',
		'code'		:	'374'
	},
	{
		'country'	: 	'Aruba',
		'code'		:	'297'
	},
	{
		'country'	: 	'Australia',
		'code'		:	'61'
	},
	{
		'country'	: 	'Austria',
		'code'		:	'43'
	},
	{
		'country'	: 	'Azerbaijan',
		'code'		:	'994'
	},
	{
		'country'	: 	'Bahamas',
		'code'		:	'1-242'
	},
	{
		'country'	: 	'Bahrain',
		'code'		:	'973'
	},
	{
		'country'	: 	'Bangladesh',
		'code'		:	'880'
	},
	{
		'country'	: 	'Barbados',
		'code'		:	'1-246'
	},
	{
		'country'	: 	'Belarus',
		'code'		:	'375'
	},
	{
		'country'	: 	'Belgium',
		'code'		:	'1-242'
	},
	{
		'country'	: 	'Belize',
		'code'		:	'501'
	},
	{
		'country'	: 	'Benin',
		'code'		:	'229'
	},
	{
		'country'	: 	'Bermuda',
		'code'		:	'1-441'
	},
	{
		'country'	: 	'Bhutan',
		'code'		:	'975'
	},
	{
		'country'	: 	'Bolivia',
		'code'		:	'591'
	},
	{
		'country'	: 	'Bosnia and Herzegovina',
		'code'		:	'387'
	},
	{
		'country'	: 	'Botswana',
		'code'		:	'267'
	},
	{
		'country'	: 	'Brazil',
		'code'		:	'55'
	},
	{
		'country'	: 	'British Indian Ocean Territory',
		'code'		:	'246'
	},
	{
		'country'	: 	'British Virgin Islands',
		'code'		:	'1-284'
	},
	{
		'country'	: 	'Brunei',
		'code'		:	'673'
	},
	{
		'country'	: 	'Bulgaria',
		'code'		:	'359'
	},
	{
		'country'	: 	'Burkina Faso',
		'code'		:	'226'
	},
	{
		'country'	: 	'Burundi',
		'code'		:	'257'
	},
	{
		'country'	: 	'Cambodia',
		'code'		:	'855'
	},
	{
		'country'	: 	'Cameroon',
		'code'		:	'237'
	},
	{
		'country'	: 	'Canada',
		'code'		:	'1'
	},
	{
		'country'	: 	'Cape Verde',
		'code'		:	'238'
	},
	{
		'country'	: 	'Cayman Islands',
		'code'		:	'1-345'
	},
	{
		'country'	: 	'Central African Republic',
		'code'		:	'236'
	},
	{
		'country'	: 	'Chad',
		'code'		:	'235'
	},
	{
		'country'	: 	'Chile',
		'code'		:	'56'
	},
	{
		'country'	: 	'China',
		'code'		:	'86'
	},
	{
		'country'	: 	'Christmas Island',
		'code'		:	'61'
	},
	{
		'country'	: 	'Cocos Islands',
		'code'		:	'61'
	},
	{
		'country'	: 	'Colombia',
		'code'		:	'57'
	},
	{
		'country'	: 	'Comoros',
		'code'		:	'269'
	},
	{
		'country'	: 	'Cook Islands',
		'code'		:	'682'
	},
	{
		'country'	: 	'Costa Rica',
		'code'		:	'506'
	},
	{
		'country'	: 	'Croatia',
		'code'		:	'385'
	},
	{
		'country'	: 	'Cuba',
		'code'		:	'53'
	},
	{
		'country'	: 	'Curacao',
		'code'		:	'599'
	},
	{
		'country'	: 	'Cyprus',
		'code'		:	'357'
	},
	{
		'country'	: 	'Czech Republic',
		'code'		:	'420'
	},
	{
		'country'	: 	'Democratic Republic of the Congo',
		'code'		:	'243'
	},
	{
		'country'	: 	'Denmark',
		'code'		:	'45'
	},
	{
		'country'	: 	'Djibouti',
		'code'		:	'253'
	},
	{
		'country'	: 	'Dominica',
		'code'		:	'1-767'
	},
	{
		'country'	: 	'Dominican Republic',
		'code'		:	'1-809'
	},
	{
		'country'	: 	'East Timor',
		'code'		:	'670'
	},
	{
		'country'	: 	'Ecuador',
		'code'		:	'593'
	},
	{
		'country'	: 	'Egypt',
		'code'		:	'20'
	},
	{
		'country'	: 	'El Salvador',
		'code'		:	'503'
	},
	{
		'country'	: 	'Equatorial Guinea',
		'code'		:	'240'
	},
	{
		'country'	: 	'Eritrea',
		'code'		:	'291'
	},
	{
		'country'	: 	'Estonia',
		'code'		:	'372'
	},
	{
		'country'	: 	'Ethiopia',
		'code'		:	'251'
	},
	{
		'country'	: 	'Falkland Islands',
		'code'		:	'500'
	},
	{
		'country'	: 	'Faroe Islands',
		'code'		:	'298'
	},
	{
		'country'	: 	'Fiji',
		'code'		:	'679'
	},
	{
		'country'	: 	'Finland',
		'code'		:	'358'
	},
	{
		'country'	: 	'France',
		'code'		:	'33'
	},
	{
		'country'	: 	'French Polynesia',
		'code'		:	'689'
	},
	{
		'country'	: 	'Gabon',
		'code'		:	'241'
	},
	{
		'country'	: 	'Gambia',
		'code'		:	'220'
	},
	{
		'country'	: 	'Georgia',
		'code'		:	'995'
	},
	{
		'country'	: 	'Germany',
		'code'		:	'49'
	},
	{
		'country'	: 	'Ghana',
		'code'		:	'233'
	},
	{
		'country'	: 	'Gibraltar',
		'code'		:	'350'
	},
	{
		'country'	: 	'Greece',
		'code'		:	'30'
	},
	{
		'country'	: 	'Greenland',
		'code'		:	'299'
	},
	{
		'country'	: 	'Grenada',
		'code'		:	'1-473'
	},
	{
		'country'	: 	'Guam',
		'code'		:	'1-671'
	},
	{
		'country'	: 	'Guatemala',
		'code'		:	'502'
	},
	{
		'country'	: 	'Guernsey',
		'code'		:	'44-1481'
	},
	{
		'country'	: 	'Guinea',
		'code'		:	'224'
	},
	{
		'country'	: 	'Guinea-Bissau',
		'code'		:	'245'
	},
	{
		'country'	: 	'Guyana',
		'code'		:	'592'
	},
	{
		'country'	: 	'Haiti',
		'code'		:	'509'
	},
	{
		'country'	: 	'Honduras',
		'code'		:	'504'
	},
	{
		'country'	: 	'Hong Kong',
		'code'		:	'852'
	},
	{
		'country'	: 	'Hungary',
		'code'		:	'36'
	},
	{
		'country'	: 	'Iceland',
		'code'		:	'354'
	},
	{
		'country'	: 	'India',
		'code'		:	'91'
	},
	{
		'country'	: 	'Indonesia',
		'code'		:	'62'
	},
	{
		'country'	: 	'Iran',
		'code'		:	'98'
	},
	{
		'country'	: 	'Iraq',
		'code'		:	'964'
	},
	{
		'country'	: 	'Ireland',
		'code'		:	'353'
	},
	{
		'country'	: 	'Isle of Man',
		'code'		:	'44-1624'
	},
	{
		'country'	: 	'Israel',
		'code'		:	'972'
	},
	{
		'country'	: 	'Italy',
		'code'		:	'39'
	},
	{
		'country'	: 	'Ivory Coast',
		'code'		:	'225'
	},
	{
		'country'	: 	'Jamaica',
		'code'		:	'1-876'
	},
	{
		'country'	: 	'Japan',
		'code'		:	'81'
	},
	{
		'country'	: 	'Jersey',
		'code'		:	'44-1534'
	},
	{
		'country'	: 	'Jordan',
		'code'		:	'962'
	},
	{
		'country'	: 	'Kazakhstan',
		'code'		:	'7'
	},
	{
		'country'	: 	'Kenya',
		'code'		:	'254'
	},
	{
		'country'	: 	'Kiribati',
		'code'		:	'686'
	},
	{
		'country'	: 	'Kosovo',
		'code'		:	'383'
	},
	{
		'country'	: 	'Kuwait',
		'code'		:	'965'
	},
	{
		'country'	: 	'Kyrgyzstan',
		'code'		:	'996'
	},
	{
		'country'	: 	'Laos',
		'code'		:	'856'
	},
	{
		'country'	: 	'Latvia',
		'code'		:	'371'
	},
	{
		'country'	: 	'Lebanon',
		'code'		:	'961'
	},
	{
		'country'	: 	'Lesotho',
		'code'		:	'266'
	},
	{
		'country'	: 	'Liberia',
		'code'		:	'231'
	},
	{
		'country'	: 	'Libya',
		'code'		:	'218'
	},
	{
		'country'	: 	'Liechtenstein',
		'code'		:	'423'
	},
	{
		'country'	: 	'Lithuania',
		'code'		:	'370'
	},
	{
		'country'	: 	'Luxembourg',
		'code'		:	'352'
	},
	{
		'country'	: 	'Macau',
		'code'		:	'853'
	},
	{
		'country'	: 	'Macedonia',
		'code'		:	'389'
	},
	{
		'country'	: 	'Madagascar',
		'code'		:	'261'
	},
	{
		'country'	: 	'Malawi',
		'code'		:	'265'
	},
	{
		'country'	: 	'Malaysia',
		'code'		:	'60'
	},
	{
		'country'	: 	'Maldives',
		'code'		:	'960'
	},
	{
		'country'	: 	'Mali',
		'code'		:	'223'
	},
	{
		'country'	: 	'Malta',
		'code'		:	'356'
	},
	{
		'country'	: 	'Marshall Islands',
		'code'		:	'692'
	},
	{
		'country'	: 	'Mauritania',
		'code'		:	'222'
	},
	{
		'country'	: 	'Mauritius',
		'code'		:	'230'
	},
	{
		'country'	: 	'Mayotte',
		'code'		:	'262'
	},
	{
		'country'	: 	'Mexico',
		'code'		:	'52'
	},
	{
		'country'	: 	'Micronesia',
		'code'		:	'691'
	},
	{
		'country'	: 	'Moldova',
		'code'		:	'373'
	},
	{
		'country'	: 	'Monaco',
		'code'		:	'377'
	},
	{
		'country'	: 	'Mongolia',
		'code'		:	'976'
	},
	{
		'country'	: 	'Montenegro',
		'code'		:	'382'
	},
	{
		'country'	: 	'Montserrat',
		'code'		:	'1-664'
	},
	{
		'country'	: 	'Morocco',
		'code'		:	'212'
	},
	{
		'country'	: 	'Mozambique',
		'code'		:	'258'
	},
	{
		'country'	: 	'Myanmar',
		'code'		:	'95'
	},
	{
		'country'	: 	'Namibia',
		'code'		:	'264'
	},
	{
		'country'	: 	'Nauru',
		'code'		:	'674'
	},
	{
		'country'	: 	'Nepal',
		'code'		:	'977'
	},
	{
		'country'	: 	'Netherlands',
		'code'		:	'31'
	},
	{
		'country'	: 	'Netherlands Antilles',
		'code'		:	'599'
	},
	{
		'country'	: 	'New Caledonia',
		'code'		:	'687'
	},
	{
		'country'	: 	'New Zealand',
		'code'		:	'64'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Niger',
		'code'		:	'227'
	},
	{
		'country'	: 	'Nigeria',
		'code'		:	'234'
	},
	{
		'country'	: 	'Niue',
		'code'		:	'683'
	},
	{
		'country'	: 	'North Korea',
		'code'		:	'850'
	},
	{
		'country'	: 	'Northern Mariana Islands',
		'code'		:	'1-670'
	},
	{
		'country'	: 	'Norway',
		'code'		:	'47'
	},
	{
		'country'	: 	'Oman',
		'code'		:	'968'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	},
	{
		'country'	: 	'Nicaragua',
		'code'		:	'505'
	}]

  constructor() { }

  ngOnInit() {
  }

}
