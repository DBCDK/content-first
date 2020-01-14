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
import Kiosk from '../../base/Kiosk/Kiosk.js';

const TagsMultiRowContainer = withTagsToPids(MultiRowContainer);

const NonEditorRolePin = ({tags, isStored, removeBelt, storeBelt}) => (
  <Pin
    icon="add"
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
  <Link
    href="/redaktionen/opret"
    params={{tags: tags.map(tag => tag.id).join()}}
  >
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
  formatTitle = tag => {
    let title = tag.title;
    let id = tag.id;
    let minus = [];
    let plus = [];

    if (this.props.minus) {
      minus =
        typeof this.props.minus[0] === 'string'
          ? [Math.trunc(this.props.minus)]
          : this.props.minus[0].map(n => Math.trunc(n));
    }
    if (this.props.plus) {
      plus =
        typeof this.props.plus[0] === 'string'
          ? [Math.trunc(this.props.plus)]
          : this.props.plus[0].map(n => Math.trunc(n));
    }

    if (plus.includes(id)) {
      return (
        <div key={id} className="must-include">
          {title}
        </div>
      );
    }

    if (minus.includes(id)) {
      return (
        <div key={id} className="must-not-include">
          {title}
        </div>
      );
    }

    return <div>{title}</div>;
  };

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
      <div id="filter-page-results" className="filter-page-results pt-5">
        {allPids.length > 0 && (
          <div>
            <MultiRowContainer
              recommendations={allPids}
              origin="Fra søgning"
              plus={this.props.plus}
              minus={this.props.minus}
            />
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
                className="mr-4 recommended-words"
              >
                <strong>Forslag til</strong>
                {tags.map((tag, idx) => {
                  if (idx === 0) {
                    return (
                      <React.Fragment key={idx}>
                        &nbsp;
                        {this.formatTitle(tag)}
                      </React.Fragment>
                    );
                  } else if (idx === tags.length - 1) {
                    return (
                      <React.Fragment key={idx}>
                        &nbsp;og&nbsp;
                        {this.formatTitle(tag)}
                      </React.Fragment>
                    );
                  }
                  return (
                    <React.Fragment key={idx}>
                      ,&nbsp;
                      {this.formatTitle(tag)}
                    </React.Fragment>
                  );
                })}
              </Title>
              <Kiosk
                render={({kiosk}) => {
                  if (!kiosk.enabled) {
                    return (
                      <StoreBeltPin
                        id={tags.map(tag => tag.id).join(',')}
                        tags={tags}
                      />
                    );
                  }
                  return null;
                }}
              />
            </div>
            <TagsMultiRowContainer
              limit={200}
              tags={tags.map(tag => tag.id)}
              origin={{type: 'searchTags', tags: tags.map(t => t.id)}}
              plus={this.props.plus}
              minus={this.props.minus}
            />
          </div>
        )}
      </div>
    );
  }
}

export default withTagsFromUrl(Results);
