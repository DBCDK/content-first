import React from 'react';
import {connect} from 'react-redux';

import './Article.css';

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
      <div className="container d-inline-flex justify-content-center">
        <div className="Article mt-5">
          <div className="Article__content p-4 lys-graa">{article.content}</div>
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
