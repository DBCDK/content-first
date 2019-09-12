import React from 'react';
import {toast} from 'react-toastify';

import Icon from '../base/Icon';
import Button from '../base/Button';
import Title from '../base/Title';
import Text from '../base/Text';

import Link from '../general/Link.component';

import Input from '../base/Input';
import Textarea from '../base/Textarea';
import Checkbox from '../base/Checkbox';
import Radio from '../base/Radio';
import Switch from '../base/Switch';

import ContextMenu, {ContextMenuAction} from '../base/ContextMenu';
import RemindsOf from '../base/RemindsOf';
import Share from '../base/Share';

import Banner from '../base/Banner';
import Tabs from '../base/Tabs';

import ToastMessage from '../base/ToastMessage';
import Divider from '../base/Divider';

import Expand from '../base/Expand';

import Panel from './Components/Panel/Panel.component';
import Color from './Components/Color/Color.component';
import Font from './Components/Font/Font.component';
import './Styleguide.css';

/**
    Create a new section by copy the codeblock and paste it to the bottom of the <main>
    Remember to give your section an id (SECTION_NUMBER)

    The section should automaticaly be added to the Panel menu

    Code block:

    <section id="section-SECTION_NUMBER">
      <h1 className="section-title">
        Title ...
      </h1>
      <p>
        Description ...
      </p>
      <div className="wrap">
        content in a white card ...
      </div>
    </section>
*/

export default class Styleguide extends React.Component {
  constructor() {
    super();
    this.state = {input: '', checkbox: false, radio: false};
  }
  render() {
    const {input, checkbox, radio} = this.state;

    return (
      <div className="Styleguide-container container">
        <Panel />
        <main className="Styleguide">
          <section id="section-0">
            <h1 className="section-title">About</h1>
            <p>
              This is a styleguide showing some of the dynamic base components
              for læsekompas.dk. <br /> Base components is simple dynamic and
              easy reusable components.
              <br /> <br />
              This guide should be updated continuously
            </p>
          </section>
          <section className="section-1" id="section-1">
            <h1 className="section-title">Colors</h1>
            <p>The websites full color palette</p>
            <div className="wrap">
              <Color title="petroleum" hex="#00414b" />
              <Color title="elm" hex="#1d768a" />
              <Color title="due" hex="#74a9ff" />
              <Color title="malibu" hex="#74a9ff" />
              <Color title="french pass" hex="#bdd5fd" />
              <Color title="pomegranate" hex="#f2432c" />
              <Color title="fersken" hex="#f37362" />
              <Color title="lys fersken" hex="#f38f81" />
              <Color title="kobber" hex="#b17642" />
              <Color title="korn" hex="#edb347" />
              <Color title="de york" hex="#81c793" />
              <Color title="pistache" hex="#a8c7b0" />
              <Color title="sea mist" hex="#c9ddcf" />
              <Color title="grey nurse" hex="#dee7e0" />
              <Color title="mine shaft" hex="#333333" />
              <Color title="silver-chalice" hex="#a7a7a7" />
              <Color title="alto" hex="#d8d8d8" />
              <Color title="porcelain" hex="#e9eaeb" />
              <Color title="concrete" hex="#f3f3f3" />
              <Color title="lys graa" hex="#f8f8f8" />
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
                quisquam error tempore earum enim illum, delectus officiis
                incidunt corrupti aliquid nam quas perspiciatis eveniet
                doloremque quod labore? Doloremque, ipsum?
              </Text>
              <Text type="body">
                <strong>Body text -</strong> Aliquid aliquam magnam ducimus
                similique obcaecati, unde exercitationem laborum incidunt, quas
                in ipsum inventore nostrum? Blanditiis optio cumque earum iste
                odio! Alias sint accusamus repudiandae.
              </Text>
              <Text type="small">
                <strong>Small text -</strong> Aperiam repellat dignissimos
                fugiat possimus esse, suscipit neque nisi libero alias obcaecati
                ipsam, porro illo corrupti nostrum reprehenderit unde, illum in
                laudantium impedit. Modi, veniam.
              </Text>
              <Text type="micro">
                <strong>Micro text -</strong> Cum asperiores temporibus itaque
                consequatur quod inventore, quia quis explicabo dicta esse minus
                voluptatem reiciendis eveniet animi, necessitatibus illum
                dolorem doloremque repellat placeat, dolores eaque.
              </Text>
            </div>
          </section>
          <section className="section-4" id="section-4">
            <h1 className="section-title">Buttons</h1>
            <p>Buttons in normal and deactive state</p>
            <div className="wrap">
              <Button type="primary">primary </Button>
              <Button type="secondary">secondary</Button>
              <Button type="tertiary">tertiary </Button>
              <Button type="quaternary">quaternary </Button>
              <Button type="quinary">quinary </Button>
              <Button type="term">term </Button>
              <Button type="tag">tag </Button>

              <br />
              <br />
              <Button type="link">link</Button>
              <Button type="link2">link2</Button>

              <br />
              <br />
              <Button size="large" type="term">
                large
              </Button>
              <Button size="medium" type="term">
                medium
              </Button>
              <Button size="small" type="term">
                small
              </Button>

              <br />
              <br />
              <Button type="secondary" disabled>
                Disabled
              </Button>

              <br />
              <br />
              <Button type="primary" iconLeft="thumb_up">
                Icon Left
              </Button>
              <Button type="quaternary" iconRight="thumb_down">
                Icon Right
              </Button>
              <Button
                type="tertiary"
                iconLeft="thumb_up"
                iconRight="thumb_down"
              >
                Icon Left & Right
              </Button>
            </div>
          </section>

          <section id="section-5">
            <h1 className="section-title">Advanced Buttons</h1>
            <p>Buttons with a functional twist</p>
            <div className="wrap">
              <div className="flex-between">
                <RemindsOf />
                <Share
                  href={'laesekompas.dk'}
                  title={'Share button with hover title'}
                >
                  Share button
                </Share>
                <div className="d-inline-block">
                  <ContextMenu title="Menu" className="">
                    <ContextMenuAction title="Rediger" icon="edit" />
                    <ContextMenuAction title="Sorter" icon="swap_vert" />
                    <ContextMenuAction title="Indstillinger" icon="settings" />
                  </ContextMenu>
                </div>
              </div>
            </div>
          </section>

          <section className="section-6" id="section-6">
            <h1 className="section-title">Forms</h1>
            <p>Form elements</p>
            <div className="wrap">
              <Input
                placeholder="Inputfield ..."
                onChange={e => this.setState({input: e.target.value})}
                value={input}
              />
              <br />
              <Textarea placeholder="Textarea ..." />
              <br />

              <div className="flex-between">
                <Checkbox
                  onChange={() => this.setState({checkbox: !checkbox})}
                  checked={checkbox}
                >
                  Checkbox
                </Checkbox>
                <Radio
                  group="styleguide"
                  onChange={() => this.setState({radio: !radio})}
                  checked={radio}
                >
                  Radio
                </Radio>

                <Switch>Switch</Switch>
              </div>
            </div>
          </section>

          <section id="section-7">
            <h1 className="section-title">Banner</h1>
            <p>
              Cum asperiores temporibus itaque consequatur quod inventore, quia
              quis explicabo dicta esse minus voluptatem reiciendis eveniet
              animi, necessitatibus illum dolorem doloremque repellat placeat,
              dolores eaque.
            </p>

            <div className="wrap">
              <Banner title="Default Banner with title" />
              <br />
              <br />
              <Banner title="Colorful Banner" color="#f2432c" />
              <br />
              <br />
              <Banner title="Banner with custom content" color="#74a9ff">
                <ContextMenu title="" className="float-right">
                  <ContextMenuAction title="Favorite" icon="star" />
                  <ContextMenuAction title="Edit" icon="edit" />
                  <ContextMenuAction title="Delete" icon="delete" />
                </ContextMenu>
                <div className="d-flex flex-column">
                  <Title type="title5"> This is very ...</Title>
                  <Text>Cool??</Text>
                </div>
              </Banner>
            </div>
          </section>
          <section className="section-8" id="section-8">
            <h1 className="section-title">Tabs</h1>
            <p>
              Optio qui, omnis itaque rerum iusto molestiae necessitatibus
              deleniti quod tenetur id perspiciatis voluptatum dolorum quisquam
              eius ipsum non architecto labore! Distinctio, tenetur. Officiis,
              necessitatibus?
            </p>
            <div className="wrap">
              <Tabs pages={['Tab1', 'Tab2', 'Tab3']}>
                <div className="tabs tabs-page-1">
                  <Text>Page 1 content ...</Text>
                </div>
                <div className="tabs tabs-page-2">
                  <Text>Page 2 content ...</Text>
                </div>
                <div className="tabs tabs-page-3">
                  <Text>Page 3 content ...</Text>
                </div>
              </Tabs>
            </div>
          </section>
          <section className="section-9" id="section-9">
            <h1 className="section-title">Divider</h1>
            <p>Horizontal and Vertical dividers in different thickness</p>

            <div className="wrap">
              <Divider type="horizontal" variant="thick" />
              <Divider type="horizontal" variant="thin" />

              <div className="d-flex">
                <Divider type="vertical" variant="thick" />
                <Divider type="vertical" variant="thin" />
              </div>
            </div>
          </section>

          <section className="section-10" id="section-10">
            <h1 className="section-title">Toast</h1>
            <p>
              Highly customizable messages, combining different colors, icons,
              text and action links.
            </p>

            <div className="wrap">
              <div className="flex-between">
                <button
                  className="bring-me-a-toast elm"
                  onClick={() => {
                    toast(<ToastMessage lines={['Just a simple message']} />);
                  }}
                >
                  <Icon name="message" />
                </button>

                <button
                  className="bring-me-a-toast korn"
                  onClick={() => {
                    toast(
                      <ToastMessage
                        lines={['message', 'in', 'multiple lines']}
                      />
                    );
                  }}
                >
                  <Icon name="message" />
                </button>

                <button
                  className="bring-me-a-toast de-york"
                  onClick={() => {
                    toast(
                      <ToastMessage
                        type="success"
                        icon="thumb_up"
                        lines={['successfully message + icon']}
                      />
                    );
                  }}
                >
                  <Icon name="message" />
                </button>

                <button
                  className="bring-me-a-toast fersken"
                  onClick={() => {
                    toast(
                      <ToastMessage
                        type="danger"
                        icon="pan_tool"
                        lines={['Danger message + icon']}
                      />
                    );
                  }}
                >
                  <Icon name="message" />
                </button>

                <button
                  className="bring-me-a-toast due"
                  onClick={() => {
                    toast(
                      <ToastMessage
                        type="info"
                        icon="info"
                        lines={[
                          'Info message with action link',
                          <Link key="href" href={'/find?tags=5634'}>
                            Try visit me
                          </Link>
                        ]}
                      />,
                      {pauseOnHover: true}
                    );
                  }}
                >
                  <Icon name="message" />
                </button>
              </div>
            </div>
          </section>

          <section id="section-11">
            <h1 className="section-title">{'Expand'}</h1>
            <p>
              {
                'Overlay to axpand content. Must be implemented in a relative positioned element'
              }
            </p>
            <div className="wrap">
              <div
                className="position-relative"
                style={{height: 200, backgroundColor: 'var(--korn)'}}
              >
                <Expand title="watch more" />
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }
}
