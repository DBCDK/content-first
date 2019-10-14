import React from 'react';
import {connect} from 'react-redux';
import {some} from 'lodash';
import TruncateMarkup from 'react-truncate-markup';

import Text from '../../base/Text';
import Button from '../../base/Button';
import T from '../../base/T';
import Icon from '../../base/Icon';

import BookCover from '../../general/BookCover/BookCover.component';
import Link from '../../general/Link.component';

import withWork from '../../hoc/Work/withWork.hoc';

import {WORK_RECOMMEND_REQUEST} from '../../../redux/recommend';

import './CompareBooks.css';

const Card = ({work, children, main, styles}) => {
  const mainClass = main ? 'Card_main' : '';
  return (
    <div className={`Card ${mainClass}`} style={styles}>
      <BookCover pid={work.book.pid} />
      <TruncateMarkup lines={2}>{children}</TruncateMarkup>
    </div>
  );
};

const Info = ({work, main}) => {
  const mainClass = main ? 'Info_main' : '';
  const title = main
    ? T({component: 'work', name: 'infoCommon'})
    : T({component: 'work', name: 'onlyCompared', vars: [work.book.title]});
  return (
    <div className={`Info ${mainClass}`}>
      <div className="Info_color" />
      <Text type="small">{title}</Text>
    </div>
  );
};
export class CompareBooks extends React.Component {
  componentDidMount() {
    const {fetchRecommendations, pids, recommendations} = this.props;
    if (pids) {
      pids.forEach(pid => {
        if (!recommendations[pid]) {
          fetchRecommendations([pid]);
        }
      });
    }
  }

  render() {
    const {main, works, details, intersectTags, sortTagsByAppeal} = this.props;

    if (!works) {
      return null;
    }

    const comparedWork = works.filter(work => {
      return work.book.pid !== main;
    })[0];

    // The compared works tags, sorted into Appeal categories
    const comparedWorkAppel = sortTagsByAppeal(comparedWork);

    // Array of tags which the Compared and Main Work has in common
    const intersectedTags = intersectTags();

    return (
      <div className="CompareBooks">
        <div className="Cards">
          {works.map((work, i) => {
            const isMain = work.book.pid === main;
            return (
              <Card
                key={`card-${work.book.pid}`}
                work={work}
                main={isMain}
                styles={{order: isMain ? 99 : i}}
              >
                <span className="Cards_title">
                  <Text type={'body'} variant={'weight-semibold'}>
                    {work.book.title}
                  </Text>
                </span>
              </Card>
            );
          })}
          <div className="Card_vs" style={{order: 98}}>
            <Text type="small">
              <T component="work" name="compare" />
            </Text>
            <Icon name="compare_arrows" />
          </div>
        </div>
        <div className="Compare">
          <Text className="Compare_title" type="body" variant="weight-bold">
            <T component="work" name="appealsTitle" />
          </Text>
          <div className="Compare_informations">
            {works.map(work => {
              return (
                <Info
                  key={`info-${work.book.pid}`}
                  work={work}
                  main={work.book.pid === main}
                />
              );
            })}
          </div>

          <div className="Compare_appeals">
            {comparedWorkAppel.length > 0 ? (
              comparedWorkAppel.map(g => {
                return (
                  <div key={g.title}>
                    <Text
                      type="small"
                      variant="weight-bold"
                      className="Compare_appeals-title"
                    >
                      {g.title}
                    </Text>
                    {g.data.map(t => {
                      const matchClass = some(intersectedTags, ['id', t.id])
                        ? 'Compare_match'
                        : '';

                      return (
                        <Link
                          className="Compare_tag"
                          key={t.id}
                          href="/find"
                          params={{tags: t.id}}
                        >
                          <Button
                            key={t.title}
                            type="tertiary"
                            size="small"
                            className={`Compare_Tag ${matchClass}`}
                            dataCy={'tag-' + t.title}
                          >
                            {t.title}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                );
              })
            ) : (
              <Text type="body" className="Compare_noTags">
                <T component="work" name="noAppeals" />
              </Text>
            )}
          </div>
          <Text className="Compare_title" type="body" variant="weight-bold">
            <T component="work" name="loansTitle" />
          </Text>
          <div className="Compare_loans">
            <div className="Cards">
              {works.map((work, i) => {
                const isMain = work.book.pid === main;

                return (
                  <Card
                    key={`card-${work.book.pid}`}
                    work={work}
                    main={isMain}
                    styles={{order: isMain ? 99 : i}}
                  >
                    <span>
                      <Text type={'small'} variant={null}>
                        <T
                          component="work"
                          name="loans"
                          renderAsHtml={true}
                          vars={[JSON.stringify(details[work.book.pid].loans)]}
                        />
                      </Text>
                    </span>
                  </Card>
                );
              })}
              <div className="Card_loan" style={{order: 98}}>
                <Text type="small">
                  <T
                    component="work"
                    name="loansCommon"
                    renderAsHtml={true}
                    vars={[
                      JSON.stringify(
                        details[comparedWork.book.pid]['common-loans']
                      )
                    ]}
                  />
                </Text>
              </div>
            </div>
          </div>
          <div className="Compare_loans_indicator">
            <Text type="small">
              <T component="work" name="aboutLoans" />
            </Text>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    recommendations: state.recommendReducer.workRecommendations,
    details:
      state.recommendReducer.workRecommendations[
        JSON.stringify([ownProps.main])
      ].details
  };
};
const mapDispatchToProps = dispatch => ({
  fetchRecommendations: (likes, dislikes = []) => {
    dispatch({
      type: WORK_RECOMMEND_REQUEST,
      fetchWorks: false,
      likes,
      dislikes,
      limit: 50
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withWork(CompareBooks, {
    includeTags: true
  })
);
