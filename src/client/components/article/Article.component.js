import React from 'react';
import {get} from 'lodash';
import ReactMarkdown from 'react-markdown';
import {connect} from 'react-redux';
import Head from '../base/Head';
import Banner from '../base/Banner';
import Title from '../base/Title';
import Text from '../base/Text';
import './Article.css';

const renderers = {
  heading: props => {
    let lvl = props.level + 1;
    if (lvl > 3) {
      lvl = 5;
    }
    return (
      <Title Tag={`h${lvl}`} type={`title${lvl}`} className="mb-2 mt-3">
        {props.children}
      </Title>
    );
  },
  paragraph: props => {
    return <Text type="body">{props.children}</Text>;
  }
};

export class Article extends React.Component {
  fetchArticle() {
    const path = this.props.path;
    let article = this.props.articles[path];
    if (!article) {
      article = this.props.articles['/404'];
    }

    return article;
  }

  render() {
    const article = this.fetchArticle();
    return (
      <div>
        <Head
          title={article.meta.title}
          canonical={article.meta.canonical}
          noIndex={article.meta.noIndex}
          og={{
            'og:title': get(article, 'meta.og.title'),
            'og:description': get(article, 'meta.og.description'),
            'og:url': get(article, 'meta.og.url'),
            'og:type': get(article, 'meta.og.type'),
            image: {
              'og:image': get(article, 'meta.og.image.url'),
              'og:image:width': get(article, 'meta.og.image.width'),
              'og:image:height': get(article, 'meta.og.image.height')
            }
          }}
        />
        {article.title && (
          <Banner className="Article__banner" title={article.title} />
        )}
        <div className="d-flex justify-content-center">
          <div className="Article mt-3 mb-3 mt-sm-5 mb-sm-5">
            <div className="Article__content">
              <ReactMarkdown source={article.src} renderers={renderers} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    articles: state.articleReducer.articles,
    articlesIsLoading: state.articleReducer.isLoading
  };
};

export default connect(mapStateToProps)(Article);
