import React from 'react';
import ReactMarkdown from 'react-markdown';

/* Pages */
/* eslint import/no-webpack-loader-syntax: off */
import About from '!raw-loader!../components/article/pages/about.md';
import NotFound from '!raw-loader!../components/article/pages/404.md';

/* custom components */
import Title from '../components/base/Title';
import Text from '../components/base/Text';
import Button from '../components/base/Button';
import Link from '../components/general/Link.component';

const renderers = {
  heading: props => {
    const lvl = props.level;
    return (
      <Title Tag={`h${lvl}`} type={`title${lvl}`}>
        {props.children}
      </Title>
    );
  },
  paragraph: props => {
    return <Text type="body">{props.children}</Text>;
  },
  image: props => {
    return (
      <div className="p-sm-0">
        <img width="719" height="auto" alt={props.alt} src={props.src} />
      </div>
    );
  }
};

const defaultState = {
  articles: {
    '/om': {
      id: 1,
      name: 'om',
      content: <ReactMarkdown source={About} renderers={renderers} />
    },
    '/404': {
      id: 2,
      name: '404',
      content: <ReactMarkdown source={NotFound} renderers={renderers} />
    }
  },
  isLoading: false
};

const articleReducer = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default articleReducer;
