// worldCupCrests.ts
// Maps ESPN soccer team IDs to their official Wikipedia high-quality federation crests
// This prevents issues with API name mismatches and avoids generic circular flags.

export const WORLD_CUP_CRESTS: Record<string, string> = {
    "624": "https://upload.wikimedia.org/wikipedia/en/2/2d/Algerian_NT_%28logo%29.png", // Algeria
    "202": "https://upload.wikimedia.org/wikipedia/en/thumb/c/c1/Argentina_national_football_team_logo.svg/330px-Argentina_national_football_team_logo.svg.png", // Argentina
    "628": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Football_Australia_logo.svg/330px-Football_Australia_logo.svg.png", // Australia
    "474": "https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/Austria_national_football_team_crest.svg/330px-Austria_national_football_team_crest.svg.png", // Austria
    "459": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/Royal_Belgian_FA_logo_2019.svg/330px-Royal_Belgian_FA_logo_2019.svg.png", // Belgium
    "205": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Brazilian_Football_Confederation_logo.svg/330px-Brazilian_Football_Confederation_logo.svg.png", // Brazil
    "206": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Canada_Soccer_logo.svg/330px-Canada_Soccer_logo.svg.png", // Canada
    "2597": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Cape_Verde.svg/330px-Flag_of_Cape_Verde.svg.png", // Cape Verde
    "208": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/FCF-Logo-2023.svg/330px-FCF-Logo-2023.svg.png", // Colombia
    "477": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Flag_of_Croatia.svg/330px-Flag_of_Croatia.svg.png", // Croatia
    "11678": "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Curacao_Football_Federation.svg/330px-Curacao_Football_Federation.svg.png", // Curacao
    "209": "https://upload.wikimedia.org/wikipedia/en/b/ba/Ecuador_national_football_team.png", // Ecuador
    "2620": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/Egyptian_Football_Association_logo.svg/330px-Egyptian_Football_Association_logo.svg.png", // Egypt
    "448": "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/England_national_football_team_crest.svg/330px-England_national_football_team_crest.svg.png", // England
    "478": "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/France_national_football_team_seal.svg/330px-France_national_football_team_seal.svg.png", // France
    "481": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/DFBEagle.svg/330px-DFBEagle.svg.png", // Germany
    "4469": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Ghana_Football_Association_logo.png/330px-Ghana_Football_Association_logo.png", // Ghana
    "2654": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Flag_of_Haiti.svg/330px-Flag_of_Haiti.svg.png", // Haiti
    "469": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Flag_of_Iran.svg/330px-Flag_of_Iran.svg.png", // Iran
    "4789": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Cote_Divoire_Enblem.png/330px-Cote_Divoire_Enblem.png", // Ivory Coast
    "627": "https://upload.wikimedia.org/wikipedia/en/thumb/8/84/Japan_national_football_team_crest.svg/330px-Japan_national_football_team_crest.svg.png", // Japan
    "2917": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Jordan_national_football_team_logo_2024.svg/330px-Jordan_national_football_team_logo_2024.svg.png", // Jordan
    "203": "https://upload.wikimedia.org/wikipedia/en/thumb/3/3f/Mexico_national_football_team_crest.svg/330px-Mexico_national_football_team_crest.svg.png", // Mexico
    "2869": "https://upload.wikimedia.org/wikipedia/en/a/ad/Morocco_NT_logo.png", // Morocco
    "449": "https://upload.wikimedia.org/wikipedia/en/thumb/7/78/Netherlands_national_football_team_logo.svg/330px-Netherlands_national_football_team_logo.svg.png", // Netherlands
    "2666": "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/New_Zealand_Football_logo.svg/330px-New_Zealand_Football_logo.svg.png", // New Zealand
    "464": "https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Norway_national_football_team_logo.svg/330px-Norway_national_football_team_logo.svg.png", // Norway
    "2659": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Flag_of_Panama.svg/330px-Flag_of_Panama.svg.png", // Panama
    "210": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Asociaci%C3%B3n_Paraguaya_de_F%C3%BAtbol_logo.svg/330px-Asociaci%C3%B3n_Paraguaya_de_F%C3%BAtbol_logo.svg.png", // Paraguay
    "482": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Portugal_National_Team_logo.png/330px-Portugal_National_Team_logo.png", // Portugal
    "4398": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Qatar_Football_Association_logo.svg/330px-Qatar_Football_Association_logo.svg.png", // Qatar
    "655": "https://upload.wikimedia.org/wikipedia/en/thumb/e/ee/Saudi_Arabia_national_football_team_logo.svg/330px-Saudi_Arabia_national_football_team_logo.svg.png", // Saudi Arabia
    "580": "https://upload.wikimedia.org/wikipedia/en/thumb/5/50/Scotland_national_football_team_logo_2014.svg/330px-Scotland_national_football_team_logo_2014.svg.png", // Scotland
    "654": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Flag_of_Senegal.svg/330px-Flag_of_Senegal.svg.png", // Senegal
    "467": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/South_Africa_national_soccer_team_logo.svg/330px-South_Africa_national_soccer_team_logo.svg.png", // South Africa
    "451": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/330px-Flag_of_South_Korea.svg.png", // South Korea
    "164": "https://upload.wikimedia.org/wikipedia/en/thumb/3/39/Spain_national_football_team_crest.svg/330px-Spain_national_football_team_crest.svg.png", // Spain
    "475": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Flag_of_Switzerland_%28Pantone%29.svg/330px-Flag_of_Switzerland_%28Pantone%29.svg.png", // Switzerland
    "659": "https://upload.wikimedia.org/wikipedia/en/c/c4/Tunisia_national_football_team_logo.png", // Tunisia
    "660": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Crest_of_the_United_States_Soccer_Federation.svg/330px-Crest_of_the_United_States_Soccer_Federation.svg.png", // United States
    "212": "https://upload.wikimedia.org/wikipedia/en/thumb/e/ee/Uruguayan_Football_Association_logo.svg/330px-Uruguayan_Football_Association_logo.svg.png", // Uruguay
    "2570": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Uzbekistan.svg/330px-Flag_of_Uzbekistan.svg.png", // Uzbekistan
};
