import React from 'react';
import Button from '../base/Button';
import Heading from '../base/Heading';
import ContextMenu, {ContextMenuAction} from '../base/ContextMenu';

export default () => (
  <div className="tl mt4">
    <div className="buttons flex">
      <div>
        <Button>Primary button</Button>
      </div>
      <div className="ml2">
        <Button type="secondary">Secondary button</Button>
      </div>
      <div className="ml2">
        <Button type="tertiary">Tertiary button</Button>
      </div>
      <div className="ml2">
        <Button type="term" size="medium">
          Term button (Medium)
        </Button>
      </div>
      <div className="ml2">
        <Button size="small">Small button</Button>
      </div>
    </div>
    <div className="headings">
      <Heading tag="h1" type="lead">
        H1 lead
      </Heading>
      <Heading tag="h1" type="section">
        H1 section heading
      </Heading>
    </div>
    <div className="dropdowns flex justify-content-center">
      <ContextMenu>
        <ContextMenuAction title="hest1" />
        <ContextMenuAction title="hest2" />
      </ContextMenu>
      <ContextMenu title="Redigér liste" className="ml-4">
        <ContextMenuAction title="Redigér tekst og billede" icon="edit" />
        <ContextMenuAction title="Skift rækkefølge" icon="swap_vert" />
        <ContextMenuAction title="Redigér indstillinger" icon="settings" />
      </ContextMenu>
    </div>
  </div>
);
