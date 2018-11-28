import React from 'react';
import ReactMarkdown from 'react-markdown';
import {connect} from 'react-redux';
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
      <Title Tag={`h${lvl}`} type={`title${lvl}`}>
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
      <div className="d-flex justify-content-center">
        <div className="Article mt-md-5 mb-md-5">
          <div className="Article__content lys-graa">
            <ReactMarkdown source={article.src} renderers={renderers} />
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
