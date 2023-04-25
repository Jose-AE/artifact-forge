const DOMAIN_ARTIFACTS = [
  ["gladiators_finale", "wanderers_troupe"],
  ["thundering_fury", "thundersoother"],
  ["viridescent_venerer", "maiden_beloved"],
  ["archaic_petra", "retracing_bolide"],
  ["crimson_witch_of_flames", "lavawalker"],
  ["bloodstained_chivalry", "noblesse_oblige"],
  ["blizzard_strayer", "heart_of_depth"],
  ["tenacity_of_the_millelith", "pale_flame"],
  ["shimenawas_reminiscence", "emblem_of_severed_fate"],
  ["husk_of_opulent_dreams", "ocean_hued_clam"],
  ["vermillion_hereafter", "echoes_of_an_offering"],
  ["deepwood_memories", "gilded_dreams"],
  ["desert_pavilion_chronicle", "flower_of_paradise_lost"],
  ["vourukashas_glow", "nymphs_dream"],
];

domain = 13;

domain = domain >= 0 && domain <= DOMAIN_ARTIFACTS.length ? domain : 0; //make sure domain is valid, else default to 0

console.log(domain);
