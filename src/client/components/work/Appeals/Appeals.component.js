import React from 'react';
import {some} from 'lodash';
import Text from '../../base/Text';
import T from '../../base/T';
import Button from '../../base/Button';
import Link from '../../general/Link.component';
import {HISTORY_REPLACE} from '../../../redux/middleware';
import './Appeals.css';

export default ({appeals, book}) => {
  if (!appeals || !book) {
    return null;
  }

  const priorityTagsArr = book.tags.filter(e => e.score > 1);

  return (
    <div className="Appeals">
      {appeals.length > 0 ? (
        <div className="tabs-info">
          <div className="tabs-info-color" />
          <Text type="small">
            <T component="general" name="particularlyProminent" />
          </Text>
        </div>
      ) : (
        <Text type="body" className="Compare_noTags">
          <T component="work" name="noAppeals" />
        </Text>
      )}
      {appeals.map(group => {
        return (
          <React.Fragment key={group.title}>
            <Text type="body" className="tag-title">
              {group.title}
            </Text>
            {group.data.map(t => {
              const matchClass = some(priorityTagsArr, ['id', t.id])
                ? 'match'
                : '';

              return (
                <Link
                  key={t.id}
                  href="/find"
                  params={{tags: t.id}}
                  type={HISTORY_REPLACE}
                >
                  <Button
                    key={t.title}
                    type="tertiary"
                    size="small"
                    className={`tag ${matchClass}`}
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
  );
};
