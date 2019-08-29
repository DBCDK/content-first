import React from 'react';
import {connect} from 'react-redux';
import {some} from 'lodash';

import Text from '../../base/Text';
import Button from '../../base/Button';

import BookCover from '../../general/BookCover/BookCover.component';
import Link from '../../general/Link.component';

import withWork from '../../hoc/Work/withWork.hoc';

import './CompareBooks.css';

const Card = ({work, main, styles}) => {
  const mainClass = main ? 'Card_main' : '';
  return (
    <div className={`Card ${mainClass}`} style={styles}>
      <BookCover book={work.book} />
      <Text type="body" variant="weight-bold">
        {work.book.title}
      </Text>
    </div>
  );
};

const Info = ({work, main}) => {
  const mainClass = main ? 'Info_main' : '';
  const title = main ? 'Fælles læseoplevelse' : 'Kun bogen ' + work.book.title;
  return (
    <div className={`Info ${mainClass}`}>
      <div className="Info_color" />
      <Text type="small">{title}</Text>
    </div>
  );
};
export class CompareBooks extends React.Component {
  render() {
    const {main, pids, works, intersectTags, sortTagsByAppeal} = this.props;

    if (!works) {
      return null;
    }

    const comparedWork = works.filter(work => {
      return work.book.pid !== main;
    })[0];

    console.log('comparedWork', comparedWork);

    const comparedWorkAppel = sortTagsByAppeal(comparedWork);
    console.log('comparedWorkAppel', comparedWorkAppel);

    const intersectedTags = intersectTags();
    console.log('intersectedTags', intersectedTags);

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
              />
            );
          })}
          <div className="Card_vs" style={{order: 98}}>
            {'vs.'}
          </div>
        </div>
        <div className="Compare">
          <Text className="Compare_title" type="body" variant="weight-bold">
            {'Læseoplevelse'}
          </Text>
          <div className="Compare_informations">
            {works.map((work, i) => {
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
            {comparedWorkAppel.map(g => {
              return (
                <React.Fragment key={g.title}>
                  <Text
                    type="small"
                    variant="weight-bold"
                    className="Compare_appeals-title"
                  >
                    {g.title}
                  </Text>
                  {g.data.map(t => {
                    console.log('some', some(intersectedTags, ['id', t.id]));

                    const matchClass = some(intersectedTags, ['id', t.id])
                      ? 'Compare_match'
                      : '';

                    return (
                      <Link key={t.id} href="/find" params={{tags: t.id}}>
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
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({});
const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withWork(CompareBooks, {
    includeTags: true
  })
);
