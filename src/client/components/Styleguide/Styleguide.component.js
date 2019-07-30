import React from 'react';
import Button from '../base/Button';
import Title from '../base/Title';
import Text from '../base/Text';
import Divider from '../base/Divider';
import ContextMenu, {ContextMenuAction} from '../base/ContextMenu';
import Toolbar from '../base/Toolbar';

import Panel from './Components/Panel/Panel.component';
import Color from './Components/Color/Color.component';
import Font from './Components/Font/Font.component';
import './Styleguide.css';

export default () => (
  <div className="container">
    <Panel />

    <main className="Styleguide">
      <section className="section-1" id="section-1">
        <h1 className="section-title">Colors</h1>
        <p>The websites full color palette</p>
        <div className="wrap">
          <Color title="petroleum" hex="#00414b" />
          <Color title="elm" hex="#1d768a" />
          <Color title="fersken" hex="#f37362" />
          <Color title="lys fersken" hex="#f38f81" />
          <Color title="pomegranate" hex="#f2432c" />
          <Color title="due" hex="#74a9ff" />
          <Color title="malibu" hex="#74a9ff" />
          <Color title="french pass" hex="#bdd5fd" />
          <Color title="korn" hex="#edb347" />
          <Color title="pistache" hex="#a8c7b0" />
          <Color title="sea mist" hex="#c9ddcf" />
          <Color title="grey nurse" hex="#dee7e0" />
          <Color title="de york" hex="#81c793" />
          <Color title="lys graa" hex="#f8f8f8" />
          <Color title="concrete" hex="#f3f3f3" />
          <Color title="porcelain" hex="#e9eaeb" />
          <Color title="alto" hex="#d8d8d8" />
          <Color title="silver-chalice" hex="#a7a7a7" />
          <Color title="kobber" hex="#b17642" />
          <Color title="mine shaft" hex="#333333" />
          <Color title="white" hex="#ffffff" />
        </div>
      </section>
      <section id="section-2">
        <h1 className="section-title">Fonts & Weights</h1>
        <p>The fonts and the different font weights </p>
        <div className="wrap">
          <Font title="Montserrat (400)" styles={{fontWeight: 400}} />
          <Font title="Montserrat (600)" styles={{fontWeight: 600}} />
          <Font title="Montserrat (700)" styles={{fontWeight: 700}} />
          <Font title="Montserrat (900)" styles={{fontWeight: 900}} />
        </div>
      </section>
      <section className="section-3" id="section-3">
        <h1 className="section-title">Titles and Texts</h1>
        <div className="wrap">
          <Title type="title1" variant="color-petroleum">
            Titel type 1
          </Title>
          <Title type="title2">Titel type 2</Title>
          <Title type="title3">Titel type 3</Title>
          <Title type="title4">Titel type 4</Title>
          <Title type="title5">Titel type 5</Title>

          <br />

          <Text type="large">
            <strong>Large text -</strong> Officia ipsum fugit iure eaque
            quisquam error tempore earum enim illum, delectus officiis incidunt
            corrupti aliquid nam quas perspiciatis eveniet doloremque quod
            labore? Doloremque, ipsum?
          </Text>
          <Text type="body">
            <strong>Body text -</strong> Aliquid aliquam magnam ducimus
            similique obcaecati, unde exercitationem laborum incidunt, quas in
            ipsum inventore nostrum? Blanditiis optio cumque earum iste odio!
            Alias sint accusamus repudiandae.
          </Text>
          <Text type="small">
            <strong>Small text -</strong> Aperiam repellat dignissimos fugiat
            possimus esse, suscipit neque nisi libero alias obcaecati ipsam,
            porro illo corrupti nostrum reprehenderit unde, illum in laudantium
            impedit. Modi, veniam.
          </Text>
          <Text type="micro">
            <strong>Micro text -</strong> Cum asperiores temporibus itaque
            consequatur quod inventore, quia quis explicabo dicta esse minus
            voluptatem reiciendis eveniet animi, necessitatibus illum dolorem
            doloremque repellat placeat, dolores eaque.
          </Text>
        </div>
      </section>
      <section id="section-4">
        <h1 className="section-title">Section 4</h1>
        <p>
          Aliquid aliquam magnam ducimus similique obcaecati, unde
          exercitationem laborum incidunt, quas in ipsum inventore nostrum?
          Blanditiis optio cumque earum iste odio! Alias sint accusamus
          repudiandae.
        </p>
      </section>
      <section id="section-5">
        <h1 className="section-title">Section 5</h1>
        <p>
          Officia ipsum fugit iure eaque quisquam error tempore earum enim
          illum, delectus officiis incidunt corrupti aliquid nam quas
          perspiciatis eveniet doloremque quod labore? Doloremque, ipsum?
        </p>
      </section>
      <section id="section-6">
        <h1 className="section-title">Section 6</h1>
        <p>
          Aperiam repellat dignissimos fugiat possimus esse, suscipit neque nisi
          libero alias obcaecati ipsam, porro illo corrupti nostrum
          reprehenderit unde, illum in laudantium impedit. Modi, veniam.
        </p>
      </section>
      <section id="section-7">
        <h1 className="section-title">Section 7</h1>
        <p>
          Cum asperiores temporibus itaque consequatur quod inventore, quia quis
          explicabo dicta esse minus voluptatem reiciendis eveniet animi,
          necessitatibus illum dolorem doloremque repellat placeat, dolores
          eaque.
        </p>
      </section>
      <section id="section-8">
        <h1 className="section-title">Section 8</h1>
        <p>
          Optio qui, omnis itaque rerum iusto molestiae necessitatibus deleniti
          quod tenetur id perspiciatis voluptatum dolorum quisquam eius ipsum
          non architecto labore! Distinctio, tenetur. Officiis, necessitatibus?
        </p>
      </section>
      <section id="section-9">
        <h1 className="section-title">Section 9</h1>
        <p>
          Rem iste iure blanditiis excepturi esse nisi corrupti sequi, illo,
          laborum quo quis quaerat assumenda perspiciatis quod fuga vel
          laudantium doloribus architecto tempora omnis earum!
        </p>
      </section>
    </main>
  </div>
);
