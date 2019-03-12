import React from 'react';
import {toast} from 'react-toastify';
import ToastMessage from '../base/ToastMessage';
import Link from '../general/Link.component';
import T from '../base/T';
import Title from '../base/Title';
import Pin from '../base/Pin';
import withTagsFromUrl from '../base/AdressBar/withTagsFromUrl.hoc';
import withTagsToPids from '../base/Recommender/withTagsToPids.hoc';
import CreatorBelt from '../base/Belt/CreatorBelt.component';
import SimilarBelt from '../base/Belt/SimilarBelt.component';
import MultiRowContainer from '../base/Belt/MultiRowContainer';
import withStoreBelt from '../base/Belt/withStoreBelt.hoc';
const TagsMultiRowContainer = withTagsToPids(MultiRowContainer);

const StoreBeltPin = withStoreBelt(
  ({isStored, tags, storeBelt, removeBelt, id}) => {
    return (
      <Pin
        active={isStored}
        text={T({
          component: 'filter',
          name: isStored ? 'pinAdded' : 'pinAdd'
        })}
        notLoggedIncontext={{
          title: <T component="filter" name="pinLoginModalTitle" />,
          reason: <T component="filter" name="pinLoginModalDescription" />
        }}
        onClick={
          isStored
            ? removeBelt
            : () => {
                storeBelt({
                  name: tags
                    .slice(0, 3)
                    .map(t => t.title)
                    .join(', '),
                  subtext: '',
                  tags: tags.map(t => t.id),
                  onFrontPage: true
                });
                toast(
                  <ToastMessage
                    type="success"
                    icon="check_circle"
                    lines={[
                      <T
                        key="label"
                        component="filter"
                        name="pinnedToFrontpageToast"
                      />,
                      <Link
                        key="href"
                        href={`/#temp_${tags.map(t => t.id).join('')}`}
                      >
                        <T component="filter" name="watchToastAction" />
                      </Link>
                    ]}
                  />,
                  {pauseOnHover: true}
                );
              }
        }
      />
    );
  }
);

class Results extends React.Component {
  render() {
    const pids = this.props.tags
      .filter(t => t.type === 'TITLE')
      .map(p => p.pid);
    const tags = this.props.tags.reduce((arr, tag) => {
      if (tag.type === 'TAG') {
        return [...arr, tag];
      } else if (tag.type === 'TAG_RANGE') {
        return [...arr, ...tag.inRange];
      }
      return arr;
    }, []);

    const creators = this.props.tags
      .filter(t => t.type === 'QUERY')
      .map(q => q.query);

    return (
      <div className="filter-page-results mt-5">
        {pids.length > 0 && (
          <div>
            <Title
              Tag="h1"
              type="title4"
              variant="transform-uppercase"
              className="mr-4 px-2 px-sm-3 px-lg-5 pt-5"
            >
              <strong>Valgte bøger</strong>
            </Title>
            <MultiRowContainer recommendations={pids} />
          </div>
        )}

        {creators.map(creator => (
          <CreatorBelt mount={'filterpage' + creator} query={creator} />
        ))}
        {pids.length > 0 && (
          <SimilarBelt
            mount={'filterpage' + JSON.stringify(pids)}
            likes={pids}
          />
        )}

        {tags.length > 0 && (
          <div>
            <div className="d-flex flex-row justify-content-between px-2 px-sm-3 px-lg-5 pt-5">
              <Title
                Tag="h1"
                type="title4"
                variant="transform-uppercase"
                className="mr-4"
              >
                {tags.map((tag, idx) => {
                  if (idx === 0) {
                    return <strong key={idx}>{tag.title}</strong>;
                  }
                  return ' ' + tag.title;
                })}
              </Title>
              <StoreBeltPin
                id={tags.map(tag => tag.id).join(',')}
                tags={tags}
              />
            </div>

            <TagsMultiRowContainer tags={tags.map(tag => tag.id)} />
          </div>
        )}
      </div>
    );
  }
}
export default withTagsFromUrl(Results);
