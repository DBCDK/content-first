import React from 'react';
import {some} from 'lodash';
import TruncateMarkup from 'react-truncate-markup';

import Text from '../../base/Text';
import Button from '../../base/Button';
import T from '../../base/T';
import Icon from '../../base/Icon';

import BookCover from '../../general/BookCover/BookCover.component';
import Link from '../../general/Link.component';

import withWork from '../../hoc/Work/withWork.hoc';

import './CompareBooks.css';

const Card = ({work, children, main, styles}) => {
  const mainClass = main ? 'card_main' : '';
  return (
    <div className={`card ${mainClass}`} style={styles}>
      <BookCover pid={work.book.pid} />
      <TruncateMarkup lines={2}>{children}</TruncateMarkup>
    </div>
  );
};

const Info = ({work, main}) => {
  const mainClass = main ? 'info_main' : '';
  const title = main
    ? T({component: 'work', name: 'infoCommon'})
    : T({component: 'work', name: 'onlyCompared', vars: [work.book.title]});
  return (
    <div className={`info ${mainClass}`}>
      <div className="info_color" />
      <Text type="small">{title}</Text>
    </div>
  );
};
export class CompareBooks extends React.Component {
  render() {
    const {main, works, intersectTags, sortTagsByAppeal} = this.props;

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
      <div className="compare-books">
        <div className="cards">
          {works.map((work, i) => {
            const isMain = work.book.pid === main;
            return (
              <Card
                key={`card-${work.book.pid}`}
                work={work}
                main={isMain}
                styles={{order: isMain ? 99 : i}}
              >
                <span className="cards_title">
                  <Text type={'body'} variant={'weight-semibold'}>
                    {work.book.title}
                  </Text>
                </span>
              </Card>
            );
          })}
          <div className="card_vs" style={{order: 98}}>
            <Text type="small">
              <T component="work" name="compare" />
            </Text>
            <Icon name="compare_arrows" />
          </div>
        </div>
        <div className="compare">
          <Text className="compare_title" type="body" variant="weight-bold">
            <T component="work" name="appealsTitle" />
          </Text>
          <div className="compare_informations">
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

          <div className="compare_appeals">
            {comparedWorkAppel.length > 0 ? (
              comparedWorkAppel.map(g => {
                return (
                  <div key={g.title}>
                    <Text
                      type="small"
                      variant="weight-bold"
                      className="compare_appeals-title"
                    >
                      {g.title}
                    </Text>
                    {g.data.map(t => {
                      const matchClass = some(intersectedTags, ['id', t.id])
                        ? 'compare_match'
                        : '';

                      return (
                        <Link
                          className="compare_tag"
                          key={t.id}
                          href="/find"
                          params={{tags: t.id}}
                        >
                          <Button
                            key={t.title}
                            type="tertiary"
                            size="small"
                            className={`compare_tag ${matchClass}`}
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
              <Text type="body" className="compare_no-tags">
                <T component="work" name="noAppeals" />
              </Text>
            )}
          </div>
          {/* DISABLE FOR NOW - until we have more valid data */}
          {/* <Text className="compare_title" type="body" variant="weight-bold">
            <T component="work" name="loansTitle" />
          </Text>
          <div className="compare_loans">
            <div className="cards">
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
              <div className="card_loan" style={{order: 98}}>
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
          <div className="compare_loans_indicator">
            <Text type="small">
              <T component="work" name="aboutLoans" />
            </Text>
          </div> */}
        </div>
      </div>
    );
  }
}
export default withWork(CompareBooks, {
  includeTags: true
});
