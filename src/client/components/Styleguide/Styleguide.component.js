import React from 'react';
import Button from '../base/Button';
import Title from '../base/Title';
import Text from '../base/Text';
import ContextMenu, {ContextMenuAction} from '../base/ContextMenu';

export default () => (
  <div className="container">
    <div className="row justify-content-md-center">
      <div className="col-8 tl mt4">
        <Title type="title4">Titles</Title>
      </div>
      <div className="col-8 tl mt2">
        <Title Tag="h1" type="title1">
          This is a Title1
        </Title>
        <Title Tag="h2" type="title2">
          This is a Title2
        </Title>
        <Title Tag="h3" type="title3">
          This is a Title3
        </Title>
        <Title Tag="h4" type="title4">
          This is a Title4
        </Title>
        <Title Tag="h5" type="title5">
          This is a Title5
        </Title>
      </div>
      <div className="col-8 tl mt4">
        <Title type="title4">Text</Title>
      </div>
      <div className="col-8 tl mt2">
        <Text type="large" className="mb0">
          Large
        </Text>
        <Text type="large">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non
          lacus at nunc scelerisque viverra eget eget ante. Nunc gravida dui non
          magna sagittis rutrum. Suspendisse consectetur suscipit risus varius
          hendrerit.
        </Text>
        <Text type="body" className="mb0">
          Body
        </Text>
        <Text type="body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non
          lacus at nunc scelerisque viverra eget eget ante. Nunc gravida dui non
          magna sagittis rutrum. Suspendisse consectetur suscipit risus varius
          hendrerit.
        </Text>
        <Text type="small" className="mb0">
          Small
        </Text>
        <Text type="small">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non
          lacus at nunc scelerisque viverra eget eget ante. Nunc gravida dui non
          magna sagittis rutrum. Suspendisse consectetur suscipit risus varius
          hendrerit.
        </Text>
        <Text type="micro" className="mb0">
          Micro
        </Text>
        <Text type="micro">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non
          lacus at nunc scelerisque viverra eget eget ante. Nunc gravida dui non
          magna sagittis rutrum. Suspendisse consectetur suscipit risus varius
          hendrerit.
        </Text>
      </div>
      <div className="col-8 tl mt4">
        <Title type="title4">Buttons</Title>
      </div>
      <div className="col-8 tl mt2">
        <div>
          <Button type="primary">Primary button</Button>
        </div>
        <div className="mt1">
          <Button type="secondary">Secondary button</Button>
        </div>
        <div className="mt1">
          <Button type="tertiary">Tertiary button</Button>
        </div>
        <div className="mt1">
          <Button type="quaternary">Quaternary button</Button>
        </div>
        <div className="mt1">
          <Button type="quinary">Quinary button</Button>
        </div>
        <div className="mt1">
          <Button type="term">Term button</Button>
        </div>
        <div className="mt1">
          <Button size="medium">Medium button</Button>
        </div>
        <div className="mt1">
          <Button size="small">Small button</Button>
        </div>
      </div>
      <div className="col-8 tl mt4">
        <Title type="title4">Dropdown</Title>
      </div>
      <div className="col-8 tl mt2">
        <div className="mt1 d-inline-block">
          <ContextMenu title="Redigér liste" className="">
            <ContextMenuAction title="Redigér tekst og billede" icon="edit" />
            <ContextMenuAction title="Skift rækkefølge" icon="swap_vert" />
            <ContextMenuAction title="Redigér indstillinger" icon="settings" />
          </ContextMenu>
        </div>
      </div>
      <div className="col-8 tl mt4" />
    </div>
  </div>
);
