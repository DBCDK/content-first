/* eslint-disable no-undefined */
import React from 'react';
import renderer from 'react-test-renderer';
import FullTextReview from '../FullTextReview.component';

jest.mock('../../../general/Link.component', () => 'Link');

const sampleReviews = [
  {
    review: {
      reviewer: {
        firstname: 'Lone',
        surname: 'Krøgh'
      },
      creationDate: '2005-03-02',
      review: {
        review:
          'Siden vinteren 2003 har DR1 i flere omgange sendt Hjerterum, en række meget sete programmer om ' +
          'boligindretning, hvor konceptet er, at to mennesker - ofte med meget forskellig smag - skal flytte ' +
          'sammen, og hvor en indretningsarkitekt med det bedste fra deres respektive indbo så indretter deres ' +
          'nye fælles hjem. Det er der kommet mange flotte, spændende og anderledes løsninger ud af, og i denne ' +
          'bog viser Vibeke Brinck, hvordan hun gjorde i fem konkrete tilfælde. Fælles for alle fem hjem er det ' +
          'personlige og individuelle frem for det meget strømlinede og arkitekttegnede. Der er dansk-svensk ' +
          'minimalisme, farvecollage på Nørrebro, stuelejlighed på Østerbro, taglejlighed i Århus og rækkehus ' +
          'på Amager. Der er inspirerende før-og-efter fotos, og der er masser af tips og ideer at hente til ' +
          'fornyelse eller opfriskning af de hjemlige stuer - både hvis det drejer sig om små effektfulde ' +
          'detaljer eller større projekter. Desuden er kapitler om farver, lys, møblering og materialer. ' +
          'Bogen lægger sig tæt op af udsendelserne, og er meget anvendelig til de mange lånere, der til ' +
          'stadighed efterspørger nyt om bogligindretning. En pendant til denne bog er Liselotte Risells ' +
          'bedste indretningsideer fra TV 2-succesen Helt solgt! (2003)'
      }
    },
    book: {
      creator: 'Fridjof Friddo',
      title: 'Den bedste indretning'
    }
  },
  {
    review: {
      reviewer: {
        firstname: 'Lone',
        surname: 'Krøgh'
      },
      creationDate: '2017-03-06',
      review: {
        review:
          'En på alle måder stor roman af Hanne Marie Svendsen. I Sydvestgrønland lå der fra 985 til ' +
          '1400-tallet en vidtstrakt nordisk bebyggelse med omkring 3.000 indbyggere, eget bispesæde og et ' +
          'munke- og et nonnekloster. Her lader Svendsen sin veloplagte, spændende og meget underholdende ' +
          'roman foregå. Den unge forældreløse Unn og hendes fostersøster Ingebjørg er under oplæring i ' +
          'nonneklosteret. Ingebjørg indordner sig, mens den mere rastløse Unn stiller en række nærmest ' +
          'kætterske spørgsmål til religionen og tilværelsen. Med Unn som hovedperson ledes man gennem ' +
          'romanens mange handlinger, og man møder en vrimmel af bipersoner. Der er lidenskabelige opgør, ' +
          'magtkampe og fejder, og middelalderens splittelse mellem hedensk overtro og religiøse skikke ' +
          'udspiller sig i et på én gang magisk og realistisk univers. Sprogligt er Unn fra Stjernestene ' +
          'holdt i sin egen tone og den beskriver den grønlandske natur flot og billedskabende. Lidenskab, ' +
          'tro og begærlighed er gennemgående temaer i den eventyrlige roman, som vil appellere til en stor ' +
          'læserkreds; dels læsere af historiske romaner i almindelighed, læsere af romaner med stærke ' +
          'kvindelige personligheder som f.eks. Dinas bog og sikkert også læsere af Ib Michael. Dystert ' +
          'grå-grønt-brunligt omslag'
      },
      note: 'Materialevurdering oprindeligt udarbejdet til udgave fra 2003'
    },
    book: {
      creator: 'Kastup Larsen',
      title: 'Nordisk halløj'
    }
  },
  {
    review: {
      reviewer: {
        firstname: 'Jacob Holm',
        surname: 'Krogsøe'
      },
      creationDate: '2017-08-11',
      review: {
        'Kort om bogen':
          '49-årige David har en stor stilling på en avis. En dag bryder David sammen og må ' +
          'genfinde sig selv i et lille sommerhus. Et hverdagsrealistisk drama om stress og kærlighed, der med ' +
          'fordel kan formidles til mandlige læsere',
        Beskrivelse:
          'David Bramsen er 49 år, han er single, far til en dreng og er aldrig kommet sig over ' +
          'bruddet med sønnens mor. David, der er uddannet journalist, har en fin stilling på avisen Bladet. ' +
          'Til et møde besvimer David. Mange år med alt for meget arbejde og rod i følelseslivet rammer David ' +
          'som en hammer. Han får orlov fra Bladet og lejer et lille sommerhus ved Roskilde Fjord. Her forsøger ' +
          'David at få fodfæste, at finde frem til sig selv. David er bogens jegfortæller',
        Vurdering:
          'David er som hovedperson realistisk og levende. Der er ikke nogen nemme løsninger, men ' +
          'en hård kamp for at genfinde sig selv efter de mange år han har levet i et følelsesmæssigt vakuum. ' +
          'Sproget er enkelt, uden de store armbevægelser, og det passer fint til Davids udvikling, hvor det ' +
          'handler om at stå af ræset og trække vejret dybt ind. Michael Robak bruger sin erfaring fra ' +
          'journalistbranchen til at give den del af romanen en vigtig troværdighed',
        'Andre bøger om samme emne':
          'Novellesamlingen Ikke altid sådan her er spækket med sammenbrud og ' +
          'livskriser. Robak har tidligere skrevet Hele byen ved det der er fyldt med kærlighed og livskriser'
      }
    },
    book: {
      creator: '',
      title: 'A'
    }
  },
  {
    review: {
      reviewer: {
        firstname: 'Per',
        surname: 'Månson'
      },
      creationDate: '2017-03-06',
      review: {
        'Anvendelse/målgruppe/niveau':
          'Rasmussens nyeste rammer lige ind i den fornyede interesse for ' +
          '2. verdenskrig og den danske modstandsbevægelse. Omslaget signalerer ikke umiddelbart dette, ' +
          'men det sort/hvide fotografi af Sven er dog tidstypisk',
        Beskrivelse:
          'Rasmussen har skrevet en del siden debuten i 1972. Denne gang er der tale om en ' +
          'biografisk roman om den legendariske BOPA-modstandsmand Søren Lauritzen, der havde dæknavnet ' +
          'Lille Sven. Baseret på dokumenter fra familien og samtaler med tidligere modstandsfolk tegner ' +
          'han et billede af en idealistisk og ambitiøs ung mand, og lader historien fortælle gennem en ' +
          'næsten jævnaldrendes tilbageblik på tiden. Det giver en usædvanlig besættelsesroman om både den ' +
          'stille hverdag og de mange aktioner, Sven nåede at deltage i, inden det gik galt lige før ' +
          'befrielsen. Det er en meget velskrevet bog, der flot formidler tid og følelser og desuden er ' +
          'en litterær nydelse',
        Sammenligning:
          'Der er kommet en del romaner om modstandsbevægelsen, senest Flammen og Citronen, ' +
          '2008, der slet ikke kvalitetsmæssig kan sammenlignes med Lille Sven',
        'Samlet konklusion':
          'En intenst fortalt historie om en idealistisk ung mand i modstandsbevægelsen ' +
          'med bred læserappel'
      },
      note: 'Materialevurdering oprindeligt udarbejdet til udgave fra 2009'
    },
    book: {
      creator: 'Arne Arno',
      title: 'Modstanden'
    }
  }
];

describe('FullTextReview', () => {
  it('render function', () => {
    sampleReviews.map(review => {
      const tree = renderer
        .create(<FullTextReview review={review.review} book={review.book} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
