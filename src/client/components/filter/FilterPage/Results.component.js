import React from 'react';
import {toast} from 'react-toastify';
import ToastMessage from '../../base/ToastMessage';
import Link from '../../general/Link.component';
import T from '../../base/T';
import Title from '../../base/Title';
import Pin from '../../base/Pin';
import {withTagsFromUrl} from '../../hoc/AdressBar';
import {withTagsToPids} from '../../hoc/Recommender';
import CreatorBelt from '../../base/Belt/CreatorBelt.component';
import MultiRowContainer from '../../base/Belt/MultiRowContainer';
import {withStoreBelt} from '../../hoc/Belt';
import Role from '../../roles/Role.component';

const TagsMultiRowContainer = withTagsToPids(MultiRowContainer);

const NonEditorRolePin = ({tags, isStored, removeBelt, storeBelt}) => (
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

const EditorRolePin = ({tags}) => (
  <Link href={`/redaktionen/opret/?tags=${tags.map(tag => tag.id).join()}`}>
    <Pin
      icon="add"
      active={false}
      text={T({
        component: 'filter',
        name: 'createAsNewBelt'
      })}
    />
  </Link>
);

const StoreBeltPin = withStoreBelt(props => {
  return (
    <React.Fragment>
      <Role not requiredRoles={['contentFirstAdmin', 'contentFirstEditor']}>
        <NonEditorRolePin {...props} />
      </Role>
      <Role requiredRoles={['contentFirstAdmin', 'contentFirstEditor']}>
        <EditorRolePin {...props} />
      </Role>
    </React.Fragment>
  );
});

class Results extends React.Component {
  render() {
    const singlePid = this.props.tags
      .filter(t => t.type === 'TITLE')
      .map(p => p.pid);
    const multiPids = this.props.getMultiPids();

    let allPids = [...singlePid, ...multiPids];
    const tags = this.props.flattenedTags();
    const creators = this.props.tags
      .filter(t => t.type === 'QUERY')
      .map(q => q.query);
    return (
      <div className="filter-page-results pt-5">
        {allPids.length > 0 && (
          <div>
            <MultiRowContainer recommendations={allPids} origin="Fra søgning" />
          </div>
        )}
        {creators.map(creator => {
          const mount = 'filterpage' + creator;
          return <CreatorBelt key={mount} mount={mount} query={creator} />;
        })}
        {tags.length > 0 && (
          <div>
            <div className="d-flex flex-row justify-content-between px-2 px-sm-3 px-lg-5 pt-5">
              <Title
                Tag="h1"
                type="title4"
                variant="transform-uppercase"
                className="mr-4"
              >
                <strong>Forslag til</strong>
                {tags.map((tag, idx) => {
                  if (idx === 0) {
                    return ' ' + tag.title;
                  } else if (idx === tags.length - 1) {
                    return ' og ' + tag.title;
                  }
                  return ', ' + tag.title;
                })}
              </Title>
              <StoreBeltPin
                id={tags.map(tag => tag.id).join(',')}
                tags={tags}
              />
            </div>
            <TagsMultiRowContainer
              limit={200}
              tags={tags.map(tag => tag.id)}
              origin={{type: 'searchTags', tags: tags.map(t => t.id)}}
            />
          </div>
        )}
      </div>
    );
  }
}

export default withTagsFromUrl(Results);
