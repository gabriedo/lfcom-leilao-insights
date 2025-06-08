import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PropertyFiltersProps {
  filters: {
    city: string;
    state: string;
    propertyType: string;
    modality: string;
    priceMin: number;
    priceMax: number;
    bedrooms: number;
    parking: number;
    acceptsFinancing: boolean | null;
    acceptsFGTS: boolean | null;
    minDiscount: number;
    areaMin: number;
    sortBy: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      city: string;
      state: string;
      propertyType: string;
      modality: string;
      priceMin: number;
      priceMax: number;
      bedrooms: number;
      parking: number;
      acceptsFinancing: boolean | null;
      acceptsFGTS: boolean | null;
      minDiscount: number;
      areaMin: number;
      sortBy: string;
    }>
  >;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
};

const cities = [
  "santa fe do araguaia",
  "palmas",
  "dianopolis",
  "porto nacional",
  "miracema do tocantins",
  "aurora do tocantins",
  "gurupi",
  "colmeia",
  "augustinopolis",
  "araguatins",
  "araguaina",
  "votuporanga",
  "alvorada",
  "votorantim",
  "vinhedo",
  "vargem grande paulista",
  "cotia",
  "valparaiso",
  "valinhos",
  "sao jose do rio preto",
  "urania",
  "tupa",
  "tremembe",
  "teodoro sampaio",
  "taubate",
  "tatui",
  "assis",
  "jaboticabal",
  "regente feijo",
  "taboao da serra",
  "sao paulo",
  "suzano",
  "sumare",
  "sorocaba",
  "",
  "sertaozinho",
  "serrana",
  "serra negra",
  "sao vicente",
  "sao roque",
  "sao pedro",
  "bauru",
  "batatais",
  "barueri",
  "barretos",
  "barra bonita",
  "bariri",
  "penapolis",
  "atibaia",
  "araras",
  "araraquara",
  "avare",
  "aracatuba",
  "andradina",
  "amparo",
  "americana",
  "garca",
  "presidente prudente",
  "altinopolis",
  "agudos",
  "cerqueira cesar",
  "aguas de lindoia",
  "aguai",
  "jose bonifacio",
  "umbauba",
  "cristinapolis",
  "tomar do geru",
  "tobias barreto",
  "sao cristovao",
  "propria",
  "porto da folha",
  "poco verde",
  "frei paulo",
  "araua",
  "pedrinhas",
  "nossa senhora do socorro",
  "nossa senhora das dores",
  "altos verdes",
  "nossa senhora da gloria",
  "neopolis",
  "poco redondo",
  "lagarto",
  "japaratuba",
  "itaporanga d'ajuda",
  "itabaianinha",
  "itabaiana",
  "estancia",
  "carira",
  "capela",
  "caninde de sao francisco",
  "campo do brito",
  "barra dos coqueiros",
  "aracaju",
  "aquidaba",
  "taio",
  "guaramirim",
  "sao jose",
  "pinhalzinho",
  "videira",
  "jaguaruna",
  "sao joao batista",
  "barreiros",
  "sao francisco do sul",
  "santo amaro da imperatriz",
  "rio do sul",
  "palhoca",
  "trombudo central",
  "tubarao",
  "urussanga",
  "laguna",
  "otacilio costa",
  "lages",
  "joinville",
  "joacaba",
  "jaragua do sul",
  "xaxim",
  "itapoa",
  "itajai",
  "indaial",
  "imbituba",
  "icara",
  "timbo",
  "sao jose do cedro",
  "gaspar",
  "florianopolis",
  "curitibanos",
  "forquilhinha",
  "criciuma",
  "correia pinto",
  "concordia",
  "chapeco",
  "capinzal",
  "canelinha",
  "camboriu",
  "cacador",
  "brusque",
  "braco do norte",
  "blumenau",
  "biguacu",
  "barra velha",
  "ascurra",
  "ararangua",
  "araquari",
  "presidente getulio",
  "viamao",
  "vila block",
  "venancio aires",
  "uruguaiana",
  "tupancireta",
  "tres passos",
  "tres coroas",
  "tramandai",
  "taquara",
  "tapes",
  "sapucaia do sul",
  "sapiranga",
  "sao sebastiao do cai",
  "sao paulo das missoes",
  "sao leopoldo",
  "sananduva",
  "sao gabriel",
  "sao borja",
  "santo augusto",
  "casca",
  "santo antonio do palma",
  "santo antonio da patrulha",
  "santo angelo",
  "santa rosa",
  "santa vitoria do palmar",
  "santa maria",
  "santa maria do herval",
  "santa cruz do sul",
  "sant' ana do livramento",
  "salto do jacui",
  "cerro largo",
  "rolante",
  "sao luiz gonzaga",
  "rio grande",
  "porto alegre",
  "porto colonia",
  "pelotas",
  "pesqueiro",
  "passo fundo",
  "parobe",
  "osorio",
  "novo hamburgo",
  "nova santa rita",
  "canoas",
  "nova bassano",
  "nonoai",
  "montenegro",
  "butia",
  "lavras do sul",
  "lajeado",
  "lagoa vermelha",
  "jaguari",
  "ivoti",
  "itaqui",
  "guaiba",
  "gravatai",
  "marau",
  "feliz",
  "farroupilha",
  "estrela",
  "esteio",
  "estancia velha",
  "erechim",
  "encantado",
  "eldorado do sul",
  "dom pedrito",
  "cruz alta",
  "chiapetta",
  "charqueadas",
  "pedro osorio",
  "caxias do sul",
  "carazinho",
  "capao do leao",
  "camaqua",
  "cachoeirinha",
  "cachoeira do sul",
  "cacapava do sul",
  "bento goncalves",
  "bage",
  "arroio do tigre",
  "alegrete",
  "agudo",
  "tapejara",
  "sao luiz",
  "boa vista",
  "rolim de moura",
  "presidente medici",
  "porto velho",
  "ouro preto do oeste",
  "nova brasilandia d'oeste",
  "machadinho d'oeste",
  "ji",
  "jaru",
  "guajara",
  "cacoal",
  "candeias do jamari",
  "cerejeiras",
  "vera cruz",
  "triunfo potiguar",
  "touros",
  "tenente laurentino cruz",
  "tangara",
  "sitio novo",
  "serra caiada",
  "sao rafael",
  "sao jose de mipibu",
  "sao joao do sabugi",
  "sao goncalo do amarante",
  "extremoz",
  "acari",
  "santo antonio",
  "santana do serido",
  "parelhas",
  "sao paulo do potengi",
  "pendencias",
  "rio do fogo",
  "pedro avelino",
  "parnamirim",
  "parazinho",
  "nisia floresta",
  "natal",
  "mossoro",
  "messias targino",
  "maxaranguape",
  "macaiba",
  "currais novos",
  "joao camara",
  "janduis",
  "jacana",
  "itaja",
  "ipanguacu",
  "governador dix",
  "goianinha",
  "florania",
  "felipe guerra",
  "cerro cora",
  "ceara",
  "mangabeira",
  "acu",
  "carnaubais",
  "caraubas",
  "canguaretama",
  "campo redondo",
  "santa cruz",
  "caico",
  "bom jesus",
  "areia branca",
  "volta redonda",
  "vassouras",
  "valenca",
  "tres rios",
  "teresopolis",
  "tangua",
  "sumidouro",
  "seropedica",
  "saquarema",
  "sao pedro da aldeia",
  "sao jose do vale do rio preto",
  "sao joao de meriti",
  "rio de janeiro",
  "sao goncalo",
  "sao joao da barra",
  "ibipeba",
  "niteroi",
  "sao francisco de itabapoana",
  "sao fidelis",
  "nova iguacu",
  "rio claro",
  "riograndina",
  "rio das ostras",
  "rio bonito",
  "resende",
  "queimados",
  "porto real",
  "porciuncula",
  "pinheiral",
  "petropolis",
  "paracambi",
  "nova friburgo",
  "nilopolis",
  "miracema",
  "mesquita",
  "marica",
  "mangaratiba",
  "mage",
  "macae",
  "japeri",
  "itaperuna",
  "itaguai",
  "itaborai",
  "abarracamento",
  "iguaba grande",
  "guapimirim",
  "duque de caxias",
  "duas barras",
  "casimiro de abreu",
  "campos dos goytacazes",
  "carmo",
  "campos eliseos",
  "cachoeiras de macacu",
  "cabo frio",
  "belford roxo",
  "barra mansa",
  "barra do pirai",
  "arraial do cabo",
  "armacao dos buzios",
  "araruama",
  "angra dos reis",
  "xambre",
  "pato branco",
  "umuarama",
  "assis chateaubriand",
  "toledo",
  "sao jose dos pinhais",
  "terra boa",
  "cruzeiro do oeste",
  "paranavai",
  "londrina",
  "cornelio procopio",
  "sarandi",
  "loanda",
  "sao pedro do ivai",
  "sao miguel do iguacu",
  "pinhais",
  "altonia",
  "colorado",
  "santo antonio da platina",
  "cascavel",
  "santa isabel do ivai",
  "pitanga",
  "santa fe",
  "arapongas",
  "rolandia",
  "rio negro",
  "quedas do iguacu",
  "campina grande do sul",
  "porecatu",
  "ponta grossa",
  "pontal do parana",
  "planalto",
  "piraquara",
  "tomazina",
  "perola",
  "perola independente",
  "perola d'oeste",
  "paranagua",
  "paraiso do norte",
  "palmeira",
  "maringa",
  "apucarana",
  "cidade gaucha",
  "nova esperanca",
  "morretes",
  "goioere",
  "marilandia do sul",
  "matinhos",
  "marmeleiro",
  "nova londrina",
  "marialva",
  "fazenda rio grande",
  "mandaguacu",
  "centenario do sul",
  "ibipora",
  "laranjeiras do sul",
  "jaguapita",
  "jacarezinho",
  "ivaipora",
  "irati",
  "nova aurora",
  "ipora",
  "icaraima",
  "guaratuba",
  "guarapuava",
  "francisco beltrao",
  "foz do iguacu",
  "florestopolis",
  "curiuva",
  "teixeira soares",
  "curitiba",
  "paranacity",
  "colombo",
  "cianorte",
  "castro",
  "campo mourao",
  "campo largo",
  "parana d'oeste",
  "cambe",
  "bela vista do paraiso",
  "araucaria",
  "peabiru",
  "andira",
  "almirante tamandare",
  "valenca do piaui",
  "uniao",
  "teresina",
  "sao raimundo nonato",
  "regeneracao",
  "piripiri",
  "piracuruca",
  "picos",
  "parnaiba",
  "barro duro",
  "monsenhor gil",
  "demerval lobao",
  "lagoa do piaui",
  "lagoa alegre",
  "jose de freitas",
  "francisco santos",
  "floriano",
  "altos",
  "cocal",
  "castelo do piaui",
  "canto do buriti",
  "campo maior",
  "jaicos",
  "brejo do piaui",
  "buriti dos lopes",
  "batalha",
  "barras",
  "ribeiro goncalves",
  "angical do piaui",
  "amarante",
  "alagoinha do piaui",
  "vitoria de santo antao",
  "vicencia",
  "vertentes",
  "toritama",
  "timbauba",
  "terra nova",
  "surubim",
  "sirinhaem",
  "sertania",
  "serra talhada",
  "sao lourenco da mata",
  "sao jose do belmonte",
  "sao jose da coroa grande",
  "sao bento do una",
  "santa maria da boa vista",
  "santa cruz do capibaribe",
  "bezerros",
  "santa cruz da baixa verde",
  "sanharo",
  "salgueiro",
  "recife",
  "petrolina",
  "pesqueira",
  "paulista",
  "paudalho",
  "ouricuri",
  "olinda",
  "limoeiro",
  "lajedo",
  "carpina",
  "lagoa do carro",
  "jurema",
  "jupi",
  "jatauba",
  "jatiuca",
  "jaboatao dos guararapes",
  "jaboatao",
  "itapissuma",
  "igarassu",
  "itambe",
  "ipojuca",
  "tuparetama",
  "ilha de itamaraca",
  "gravata",
  "goiana",
  "gloria do goita",
  "garanhuns",
  "feira nova",
  "custodia",
  "cupira",
  "condado",
  "cha grande",
  "cha de alegria",
  "catende",
  "caruaru",
  "casinhas",
  "carnaiba",
  "camocim de sao felix",
  "camaragibe",
  "cabo de santo agostinho",
  "brejo da madre de deus",
  "bonito",
  "bom conselho",
  "belo jardim",
  "arcoverde",
  "araripina",
  "alianca",
  "alagoinha",
  "agrestina",
  "afogados da ingazeira",
  "abreu e lima",
  "sume",
  "sousa",
  "soledade",
  "sape",
  "sao joao do rio do peixe",
  "sao joao do cariri",
  "sao bento",
  "santa rita",
  "rio tinto",
  "catole do rocha",
  "remigio",
  "pocinhos",
  "caapora",
  "pedras de fogo",
  "patos",
  "cuite",
  "monteiro",
  "mamanguape",
  "lucena",
  "campina grande",
  "juripiranga",
  "joao pessoa",
  "acau",
  "jerico",
  "inga",
  "serra branca",
  "gurinhem",
  "guarabira",
  "esperanca",
  "cubati",
  "cruz do espirito santo",
  "alhandra",
  "malta",
  "cajazeiras",
  "cabedelo",
  "brejo do cruz",
  "belem do brejo do cruz",
  "bayeux",
  "barra de santa rosa",
  "bananeiras",
  "araruna",
  "aracagi",
  "paragominas",
  "xinguara",
  "vigia",
  "uruara",
  "tucurui",
  "braganca",
  "tome",
  "curuca",
  "tailandia",
  "sao miguel do guama",
  "sao francisco do para",
  "castanhal",
  "sao domingos do capim",
  "santo antonio do taua",
  "santarem",
  "santa maria do para",
  "santa isabel do para",
  "benevides",
  "redencao",
  "parauapebas",
  "salinopolis",
  "ourilandia do norte",
  "ourem",
  "oriximina",
  "novo repartimento",
  "moju",
  "marituba",
  "maraba",
  "mae do rio",
  "jacunda",
  "itaituba",
  "ipixuna do para",
  "goianesia do para",
  "eldorado dos carajas",
  "dom eliseu",
  "curionopolis",
  "concordia do para",
  "capitao poco",
  "canaa dos carajas",
  "breves",
  "breu branco",
  "belem",
  "ananindeua",
  "baiao",
  "aurora do para",
  "augusto correa",
  "altamira",
  "vila rica",
  "varzea grande",
  "cuiaba",
  "tapurah",
  "sinop",
  "sao jose dos quatro marcos",
  "sapezal",
  "santo antonio do leverger",
  "rondonopolis",
  "ribeirao cascalheira",
  "primavera do leste",
  "porto esperidiao",
  "pocone",
  "pedra preta",
  "paranatinga",
  "novo sao joaquim",
  "nortelandia",
  "juina",
  "rosario oeste",
  "jaciara",
  "diamantino",
  "guaranta do norte",
  "canarana",
  "campo verde",
  "barra do garcas",
  "barra do bugres",
  "arenapolis",
  "alto araguaia",
  "tres lagoas",
  "sao gabriel do oeste",
  "rio brilhante",
  "ponta pora",
  "pedro gomes",
  "ivinhema",
  "nova andradina",
  "navirai",
  "nioaque",
  "jardim",
  "dourados",
  "coxim",
  "campo grande",
  "camapua",
  "caarapo",
  "brasilandia",
  "aparecida do taboado",
  "anastacio",
  "amambai",
  "visconde do rio branco",
  "vicosa",
  "vespasiano",
  "varzea da palma",
  "varginha",
  "uberlandia",
  "rio pardo de minas",
  "uberaba",
  "uba",
  "turmalina",
  "tupaciguara",
  "tres pontas",
  "tres coracoes",
  "sao joao del rei",
  "timoteo",
  "teofilo otoni",
  "tarumirim",
  "sao lourenco",
  "sete lagoas",
  "ibirite",
  "para de minas",
  "alpinopolis",
  "igarape",
  "sao joao nepomuceno",
  "inhapim",
  "itapagipe",
  "sao francisco",
  "entre rios de minas",
  "ipatinga",
  "santa vitoria",
  "santa luzia",
  "nova ponte",
  "salinas",
  "sacramento",
  "sabara",
  "ribeirao das neves",
  "itabira",
  "bonfinopolis de minas",
  "nova lima",
  "matozinhos",
  "presidente olegario",
  "pouso alegre",
  "ponte nova",
  "pocos de caldas",
  "guarani",
  "pirapora",
  "brasopolis",
  "sao francisco do humaita",
  "nova serrana",
  "pedro leopoldo",
  "eugenopolis",
  "patos de minas",
  "passos",
  "paraguacu",
  "ouro fino",
  "nepomuceno",
  "nanuque",
  "muzambinho",
  "mutum",
  "muriae",
  "montes claros",
  "monte carmelo",
  "mantena",
  "matias barbosa",
  "mateus leme",
  "luz",
  "machado",
  "lavras",
  "lambari",
  "lagoa santa",
  "juiz de fora",
  "juatuba",
  "joao pinheiro",
  "joao monlevade",
  "januaria",
  "manga",
  "jaiba",
  "jaboticatubas",
  "iturama",
  "ituiutaba",
  "itauna",
  "pratapolis",
  "itanhandu",
  "ipanema",
  "ibia",
  "governador valadares",
  "frutal",
  "formiga",
  "extrema",
  "esmeraldas",
  "eloi mendes",
  "dores do indaia",
  "divinopolis",
  "divino",
  "coronel fabriciano",
  "coromandel",
  "contagem",
  "betim",
  "conselheiro lafaiete",
  "conceicao do rio verde",
  "conceicao das alagoas",
  "carmo do rio claro",
  "claudio",
  "canapolis",
  "cataguases",
  "caratinga",
  "carangola",
  "careacu",
  "santa margarida",
  "capelinha",
  "campo belo",
  "campestre",
  "cambuquira",
  "paraopeba",
  "brumadinho",
  "bom despacho",
  "barao de cocais",
  "bocaiuva",
  "boa esperanca",
  "belo horizonte",
  "barbacena",
  "bambui",
  "leopoldina",
  "araxa",
  "araguari",
  "aracuai",
  "andradas",
  "almenara",
  "alfenas",
  "alem paraiba",
  "aimores",
  "abre campo",
  "viana",
  "timon",
  "timbiras",
  "sucupira do norte",
  "senador alexandre costa",
  "governador eugenio barros",
  "sao luis",
  "sao jose de ribamar",
  "sao joao dos patos",
  "santa luzia do parua",
  "santa helena",
  "raposa",
  "presidente juscelino",
  "presidente dutra",
  "pinheiro",
  "paraibano",
  "paco do lumiar",
  "mirinzal",
  "matoes",
  "mata roma",
  "maracacume",
  "itinga do maranhao",
  "itapecuru mirim",
  "imperatriz",
  "icatu",
  "grajau",
  "governador archer",
  "fortuna",
  "cururupu",
  "coroata",
  "chapadinha",
  "cidelandia",
  "centro novo do maranhao",
  "buriticupu",
  "brejo",
  "bom jardim",
  "barra do corda",
  "balsas",
  "bacabal",
  "axixa",
  "acailandia",
  "valparaiso de goias",
  "cidade ocidental",
  "turvania",
  "trindade",
  "goias",
  "terezopolis de goias",
  "simolandia",
  "senador canedo",
  "goiania",
  "uruacu",
  "sao luiz do norte",
  "santo antonio do descoberto",
  "santo antonio de goias",
  "aguas lindas de goias",
  "planaltina",
  "santo antonio da barra",
  "santo antonio do rio verde",
  "bom jesus de goias",
  "mineiros",
  "rio verde",
  "novo planalto",
  "paranaiguara",
  "palmeiras de goias",
  "padre bernardo",
  "novo gama",
  "nova veneza",
  "niquelandia",
  "neropolis",
  "nazario",
  "mundo novo",
  "mozarlandia",
  "morrinhos",
  "montes claros de goias",
  "monte alegre de goias",
  "campos belos",
  "luziania",
  "jaragua",
  "jatai",
  "itumbiara",
  "cacu",
  "itaruma",
  "itapirapua",
  "itapaci",
  "ipameri",
  "inhumas",
  "indiara",
  "inaciolandia",
  "iaciara",
  "hidrolandia",
  "guapo",
  "goiatuba",
  "goianira",
  "anapolis",
  "vila borba",
  "goianesia",
  "goianapolis",
  "formosa",
  "flores de goias",
  "crixas",
  "cristalina",
  "cocalzinho de goias",
  "catalao",
  "campinorte",
  "caldas novas",
  "buriti de goias",
  "buriti alegre",
  "bonfinopolis",
  "brazabrantes",
  "aparecida de goiania",
  "aragoiania",
  "piranhas",
  "aparecida",
  "alexania",
  "campo alegre",
  "agua limpa",
  "adelandia",
  "abadiania",
  "vitoria",
  "vila velha",
  "serra",
  "sao mateus",
  "sao gabriel da palha",
  "nova venecia",
  "linhares",
  "itapemirim",
  "guarapari",
  "guacui",
  "colatina",
  "cariacica",
  "cachoeiro de itapemirim",
  "aracruz",
  "anchieta",
  "brasilia",
  "taguatinga",
  "sobradinho",
  "ceilandia",
  "gama",
  "sobral",
  "senador pompeu",
  "sao luis do curu",
  "russas",
  "quixeramobim",
  "quixada",
  "pindoretama",
  "penaforte",
  "pedra branca",
  "paraipaba",
  "paracuru",
  "maracanau",
  "palmacia",
  "pacatuba",
  "pacajus",
  "horizonte",
  "maranguape",
  "juazeiro do norte",
  "itaitinga",
  "caucaia",
  "ipu",
  "iguatu",
  "fortaleza",
  "eusebio",
  "crato",
  "crateus",
  "coreau",
  "carnaubal",
  "caririacu",
  "caninde",
  "camocim",
  "brejo santo",
  "barreira",
  "aquiraz",
  "vitoria da conquista",
  "teixeira de freitas",
  "simoes filho",
  "serrinha",
  "serra preta",
  "senhor do bonfim",
  "sao goncalo dos campos",
  "santo estevao",
  "itaberaba",
  "santa rita de cassia",
  "santo amaro",
  "santa maria da vitoria",
  "santa brigida",
  "salvador",
  "piata",
  "rio real",
  "ribeira do pombal",
  "cipo",
  "remanso",
  "porto seguro",
  "pocoes",
  "paulo afonso",
  "paripiranga",
  "brumado",
  "maiquinique",
  "macarani",
  "luis eduardo magalhaes",
  "lauro de freitas",
  "camacari",
  "feira de santana",
  "juazeiro",
  "jequie",
  "jaguaquara",
  "jacobina",
  "coribe",
  "itarantim",
  "itagiba",
  "itabuna",
  "irece",
  "inhambupe",
  "ilheus",
  "ibotirama",
  "iacu",
  "guanambi",
  "itororo",
  "firmino alves",
  "eunapolis",
  "esplanada",
  "entre rios",
  "dias d'avila",
  "conceicao do jacuipe",
  "catu",
  "casa nova",
  "candeias",
  "caetite",
  "bom jesus da lapa",
  "barreiras",
  "amelia rodrigues",
  "alagoinhas",
  "santana",
  "macapa",
  "tefe",
  "rio preto da eva",
  "parintins",
  "nova olinda do norte",
  "manaus",
  "itacoatiara",
  "iranduba",
  "humaita",
  "junqueiro",
  "coari",
  "fonte boa",
  "teotonio vilela",
  "borba",
  "satuba",
  "santana do ipanema",
  "santa luzia do norte",
  "rio largo",
  "porto real do colegio",
  "porto calvo",
  "pilar",
  "penedo",
  "palmeira dos indios",
  "marechal deodoro",
  "major isidoro",
  "maceio",
  "girau do ponciano",
  "flexeiras",
  "sao miguel dos campos",
  "agua branca",
  "arapiraca",
  "sena madureira",
  "rio branco",
  "porto acre",
  "cruzeiro do sul",
];

export default function PropertyFilters({
  filters,
  setFilters,
}: PropertyFiltersProps) {
  const propertyTypes = [
    "Apartamento",
    "Casa",
    "Terreno",
    "Comercial",
    "Rural",
    "Galpão",
  ];
  const modalities = [
    "Leilão SFI",
    "Licitação Aberta",
    "Venda Online",
    "Venda Direta Online",
  ];
  const bedroomOptions = [0, 1, 2, 3, 4, 5];
  const parkingOptions = [0, 1, 2, 3, 4];
  const states = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  // Em um cenário real, as cidades seriam carregadas dinamicamente com base no estado selecionado

  const handlePriceChange = (value: number[]) => {
    setFilters({
      ...filters,
      priceMin: value[0],
      priceMax: value[1] || 1000000,
    });
  };

  const handleAreaChange = (value: number[]) => {
    setFilters({
      ...filters,
      areaMin: value[0],
    });
  };

  const handleDiscountChange = (value: number[]) => {
    setFilters({
      ...filters,
      minDiscount: value[0],
    });
  };

  const handleClearFilters = () => {
    setFilters({
      city: "",
      state: "",
      propertyType: "",
      modality: "",
      priceMin: 0,
      priceMax: 1000000,
      bedrooms: 0,
      parking: 0,
      acceptsFinancing: null,
      acceptsFGTS: null,
      minDiscount: 0,
      areaMin: 0,
      sortBy: "",
    });
  };

  return (
    <Card className="w-full border-muted shadow-sm">
      <CardContent className="p-6">
        <Accordion
          type="single"
          collapsible
          defaultValue="basic-filters"
          className="w-full"
        >
          <AccordionItem value="basic-filters">
            <AccordionTrigger className="text-lg font-semibold">
              Filtros básicos
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Select
                    value={filters.state}
                    onValueChange={(value) =>
                      setFilters({ ...filters, state: value, city: "" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-states">
                        Todos os estados
                      </SelectItem>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Select
                    value={filters.city}
                    onValueChange={(value) =>
                      setFilters({ ...filters, city: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as cidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-cities">
                        Todas as cidades
                      </SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Imóvel</Label>
                  <Select
                    value={filters.propertyType}
                    onValueChange={(value) =>
                      setFilters({ ...filters, propertyType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-types">Todos os tipos</SelectItem>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modality">Modalidade</Label>
                  <Select
                    value={filters.modality}
                    onValueChange={(value) =>
                      setFilters({ ...filters, modality: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as modalidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-modalities">
                        Todas as modalidades
                      </SelectItem>
                      {modalities.map((modality) => (
                        <SelectItem key={modality} value={modality}>
                          {modality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="advanced-filters">
            <AccordionTrigger className="text-lg font-semibold">
              Filtros avançados
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <div className="space-y-2">
                  <Label>Preço</Label>
                  <div className="pt-4 px-2">
                    <Slider
                      defaultValue={[filters.priceMin, filters.priceMax]}
                      max={1000000}
                      step={10000}
                      onValueChange={handlePriceChange}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{formatCurrency(filters.priceMin)}</span>
                      <span>{formatCurrency(filters.priceMax)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Área Total (m²)</Label>
                  <div className="pt-4 px-2">
                    <Slider
                      defaultValue={[filters.areaMin]}
                      max={500}
                      step={10}
                      onValueChange={handleAreaChange}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>A partir de {filters.areaMin} m²</span>
                      <span>500+ m²</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Desconto Mínimo</Label>
                  <div className="pt-4 px-2">
                    <Slider
                      defaultValue={[filters.minDiscount]}
                      max={50}
                      step={5}
                      onValueChange={handleDiscountChange}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>A partir de {filters.minDiscount}%</span>
                      <span>50%+</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Quartos</Label>
                    <Select
                      value={filters.bedrooms.toString()}
                      onValueChange={(value) =>
                        setFilters({ ...filters, bedrooms: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Qualquer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Qualquer</SelectItem>
                        {bedroomOptions.map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num === 0 ? "Studio" : num === 5 ? "5+" : num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parking">Vagas de Garagem</Label>
                    <Select
                      value={filters.parking.toString()}
                      onValueChange={(value) =>
                        setFilters({ ...filters, parking: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Qualquer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Qualquer</SelectItem>
                        {parkingOptions.map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num === 0 ? "Sem vaga" : num === 4 ? "4+" : num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="aceita-financiamento"
                      checked={filters.acceptsFinancing === true}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          acceptsFinancing: checked ? true : null,
                        })
                      }
                    />
                    <Label htmlFor="aceita-financiamento">
                      Aceita Financiamento
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="aceita-fgts"
                      checked={filters.acceptsFGTS === true}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          acceptsFGTS: checked ? true : null,
                        })
                      }
                    />
                    <Label htmlFor="aceita-fgts">Aceita FGTS</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortBy">Ordenar por</Label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      setFilters({ ...filters, sortBy: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-asc">Menor Preço</SelectItem>
                      <SelectItem value="price-desc">Maior Preço</SelectItem>
                      <SelectItem value="discount-desc">
                        Maior Desconto
                      </SelectItem>
                      <SelectItem value="end-date-asc">
                        Finaliza Primeiro
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClearFilters}>
            Limpar filtros
          </Button>
          <Button>Aplicar filtros</Button>
        </div>
      </CardContent>
    </Card>
  );
}
