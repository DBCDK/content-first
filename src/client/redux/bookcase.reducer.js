/* eslint-disable */

const defaultState = {
  profiles: [
    {
      id: '1',
      name: 'Nynne Bjerre',
      image: 'img/bookcase/NB.jpg'
    },
    {
      id: '2',
      name: 'Cecilie Frøkjær',
      image: 'img/bookcase/CF.jpg'
    },
    {
      id: '3',
      name: 'Helene Jeppesen',
      image: 'img/bookcase/HJ.jpg'
    }
  ],
  lists: [
    {
      owner: '1',
      description:
        'Nynne Bjerre Christensen er kendt fra sin mangeårige rolle som vært i Deadline på DR2. I dag er Nynne selvstændig og arbejder bl.a. som radiovært på P1 og som moderator ved store konferencer rundt om i landet. Nynne er en “mejetærsker” når det kommer til læsning. Hun læser hurtigt og meget. Både skøn- og faglitteratur fylder de mange reoler, hjemmet er fuld af.',
      descriptionImage: false,
      bookcase: 'img/bookcase/NB-bogreol.jpg',
      list: [
        {
          book: {
            pid: '870970-basis:51238362',
            titel: 'Vi ses deroppe',
            creator: 'Pierre Lemaitre (f. 1951)',
            description:
              'Alfred og Édouard har overlevet 1. verdenskrig, men absolut ikke uden mén. Édouard har mistet sit underansigt, sin stemme og sin fremtid. Alfred sin forlovede, sit job og sin stolthed. Tilværelsen synes mere og mere dyster, indtil Édouard får ideen til et helt fantastisk svindelnummer, et fupnummer, som vil ændre alt'
          },
          position: {x: 35.5, y: 12},
          description:
            '”Romanen beskriver slagmarken helt eminent”, fortæller Nynne og fortsætter med at ridse handlingen op. Romanen foregår under 1. Verdenskrig og i årene efter i Paris. Vi følger i to parallelle spor to unge krigsvetaraners liv. Lemaitre ”skriver røven ud af bukserne” og beskriver Paris, slagmarken, ødelæggelserne m.v. meget malende. En roman der viser, hvad krig gør ved unge mænd.'
        },
        {
          book: {
            pid: '870970-basis:26430585',
            titel: 'Idioten',
            creator: 'F. M. Dostojevskij',
            description:
              'Skildring fra Skt. Petersborg af epileptikeren fyrst Mysjkin, der har Kristi egenskaber, godhed og renhed, som ideal. Han vælger mellem to kvinder, og da hans udkårne myrdes, bliver han sindssyg'
          },
          position: {x: 39, y: 12},
          description:
            'Nynne læser meget varieret og står ikke af vejen for hverken tunge eller lange bøger. ”Idioten” har et stort persongalleri og kræver lidt længere læsestræk. Den fortæller om borgerskabet i Rusland i anden halvdel af 1800tallet. Det er et sofistikeret borgerskab med et højt intellektuelt niveau. Romanen er en god påmindelse om Ruslands rige kulturarv og står i kontrast til det Rusland vi ser i dag.'
        },
        {
          book: {
            pid: '870970-basis:51642899',
            titel: 'Alt det lys vi ikke ser',
            creator: 'Anthony Doerr',
            description:
              'Roman om den tyske soldat Werner, som er ekspert i at opspore radiotransmission, den blinde franske pige Marie-Laure, og eftersøgningen af en uvurderlig juvel under 2. verdenskrig'
          },
          position: {x: 33.5, y: 12},
          description:
            '”Den er bare fed, læs den!” siger Nynne og fortsætter med at fortælle hvordan 2. Verdenskrig altid er et godt bagtæppe for en roman. Romanen er malerisk og velskrevet. Den giver en beskrivelse af, hvordan det er at være blind.'
        },
        {
          book: {
            pid: '870970-basis:24077861',
            titel: 'Buddenbrook s',
            creator: 'Thomas Mann',
            description: ''
          },
          position: {x: 31, y: 12},
          description:
            'En slægtsfabel. En roman om et familiedynasti af købmænd, som langsomt går undergangen i møde. På Thomas Manns tid tog faldet 30-40 år, hvorimod det i dag kan ske fra den ene dag til den anden. Romanen kredser om spørgsmålet ”hvordan er man et ordentligt menneske, en samfundsstøtte?”.'
        }
      ]
    },
    {
      owner: '2',
      description:
        'Journalist og TV-/radiovært, aktuel med podcasten ”Cecilie og forfatterne”, hvor hun hver uge taler med 2 aktuelle forfattere. Cecilie har været læser lige fra 1. Klasse, hvor hun stavede sig gennem Pelle Haleløs.',
      descriptionImage: true,
      bookcase: 'img/bookcase/CF-bogreol.jpg',
      list: [
        {
          book: {
            pid: '870970-basis:29157049',
            titel: 'På myrens fodsti',
            creator: 'Johannes Møllehave',
            description:
              'Små erindringsglimt om præsten og humoristen Johannes Møllehaves (f. 1937) familiemedlemmer og barndomskammerater'
          },
          position: {x: 80, y: 8},
          description:
            'Johannes Møllehaves barndomserindringer har Cecilie læst mange gange og hun beskriver læseoplevelsen som ”et dejligt varmt sjal”. Hun fremhæver forfatterens lune og menneskekærlige blik. Bogen indeholder en række gode, underholdende fortællinger og skrivestilen giver læseren lyst til at tage del i forfatterens erindringer.'
        },
        {
          book: {
            pid: '870970-basis:52075467',
            titel: 'Open',
            creator: 'Andre Agassi',
            description:
              'Om Andre Agassis (f. 1970) liv og karriere som tennisspiller'
          },
          position: {x: 14, y: 50},
          description:
            'Cecilie fremhæver ”Open” som den bedste selvbiografi hun nogensinde har læst, hvilket er grunden til at hun ofte har foræret den væk som gave. Det er en bog med en voldsom dramaturgi – et menneske spændt ud mellem had og kærlighed til den ting, han beskæftiger sig med – tennissporten. Agassi formår at se sig selv udefra og er meget reflekteret. Det er overraskende at komme bag facaden på en højt profileret tennisspiller og se, hvordan livet udenfor banen udfolder sig.'
        },
        {
          book: {
            pid: '870970-basis:51283376',
            titel: 'Der bor Hollywoodstjerner på vejen',
            creator: 'Maria Gerhardt (f. 1978)',
            description:
              'Maria er dj, succesfuld og forelsket i Rosa. Efter 15 år får hun hende, men samtidig opdager Maria at hun har kræft, Maria Gerhardt (f. 1978) også kendt under navnet Djuna Barnes'
          },
          position: {x: 15, y: 10},
          description:
            '”En rigtig fin bog” skrevet med nøgternhed og fandenivoldskhed af en kvinden på randen af livet. Handlingen flyder let og det er som at være der selv. Det er tydeligt at Maria Gerhardt havde en poetisk åre, der giver et dejligt sprog.'
        }
      ]
    },
    {
      owner: '3',
      description:
        'Helene Jeppesen er Danmarks mest fulgte booktuber. Hun læser bredt – både klassikere og helt ny skønlitteratur. Reolen bærer præg af hendes store interesse og kærlighed til det engelske sprog.',
      descriptionImage: false,
      bookcase: 'img/bookcase/HJ-bogreol.jpg',
      list: [
        {
          book: {
            pid: '870970-basis:51704185',
            titel: "Butcher's Crossing",
            creator: 'john Williams (f. 1922)',
            description:
              'Fire mænd drager i 1873 til Colorado på den ultimative bisonjagt. Endeløse nedslagtninger har tyndet ud i flokkene, men drømmen om at finde frem til kæmpeflokken lever i bedste velgående og får mændene til at tåle rejsens brutale udfordringer'
          },
          position: {x: 4.5, y: 29},
          description:
            'Romanen er skrevet af forfatteren til ”Stoner” og har mange af de samme kvaliteter. Her foregår handlingen blot i naturen, i det vilde vesten, hvor en gruppe mænd tager på Bisonjagt.'
        },
        {
          book: {
            pid: '870970-basis:51233646',
            titel: 'Livet',
            creator: 'Alice Munro',
            description: ''
          },
          position: {x: 20.3, y: 29},
          description:
            'Alice Munro skriver om mennesker og livet, og hun gør det, så man på få sider kommer helt ind under huden på hendes personer. Hendes noveller er så mættede af indhold, at de føles som hele romaner. Personerne lever fra første færd og bliver hos en længe efter. Samlingen består af ti regulære, fiktive noveller og afsluttes med en finale bestående af fire stykker, som Munro selv betegner som selvbiografiske “in feeling, though not, sometimes, entirely so in facts.” Ifølge Munros indledning til novellerne i denne sidste sektion er de“the first and last – and the closest – things I have to say about my own life.”'
        },
        {
          book: {
            pid: '870970-basis:24807150',
            titel: 'Den lille ven',
            creator: 'Donna Tartt',
            description: ''
          },
          position: {x: 94, y: 68},
          description:
            '10 år brugte Tartt på at skrive denne murstensroman, og det mærkes tydeligt. Hun har skabt et fuldkomment univers befolket af et stort persongalleri, som man – quade mange sider – lærer bedre at kende end mange af ens bekendte fra det virkelige liv. Hovedpersonen er en ensom 12-årig pige, som beslutter sig for at opklare mordet på sin storebror. Et mord, der har sat hele familien i stå, og er skyld i den tryggede stemning pigen vokser op i. Deter en stor roman og en stor læseoplevelse.'
        }
      ]
    }
  ]
};

/* eslint-enable */

export const ON_BOOK_REQUEST_TEST = 'ON_BOOK_REQUEST_TEST';

const bookcaseReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_BOOK_REQUEST_TEST: {
      return Object.assign({}, {state});
    }

    default:
      return state;
  }
};

export default bookcaseReducer;
