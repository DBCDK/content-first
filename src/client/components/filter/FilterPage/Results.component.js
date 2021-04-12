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
import ResultsFilter from './ResultsFilter.component';
import scrollToComponent from 'react-scroll-to-component';

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
  constructor() {
    super();
    this.hasScrolled = false;
    this.state = {type: 'Bog'};
  }

  componentDidMount() {
    this.setState(
      {type: this.props.types ? this.props.types : this.state.type}
      // this.props.updateType(this.state.type)
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.type !== prevState.type) {
      this.props.updateType(this.state.type);
    }
    console.log('=== hasScrolled', this.hasScrolled);
    console.log('=== document.referrer', document.referrer);
    console.log('=== window.location.origin', window.location.origin);
    if (
      !this.hasScrolled && // Only scroll when loading page first time
      document.referrer !== '' && // Do not scroll on internal navigation
      document.referrer.startsWith(window.location.origin) // Only scroll if redirected from outside
    ) {
      this.hasScrolled = true;
      scrollToComponent(this.resultBlockRef, {
        align: 'top',
        ease: 'inOutCube',
        offset: 100
      });
    }
  }

  initBtns = () => {
    return {selected: this.props.types ? this.props.types : 'Bog'};
  };

  formatTitle = tag => {
    let title = tag.title;
    let id = tag.id;
    let {plus = [], minus = []} = this.props;

    if (plus.includes(id)) {
      return (
        <span key={id} className="must-include">
          {title}
        </span>
      );
    }
    if (minus.includes(id)) {
      return (
        <span key={id} className="must-not-include">
          {title}
        </span>
      );
    }
    return <span key={id}>{title}</span>;
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

    const changeType = t => {
      let retStr = convertType(t, 'toStr');
      this.setState({type: retStr});
    };

    const convertType = (t, dir) => {
      let nameArr = ['Bog', 'Ebog', 'Lydbog (net)'];
      if (dir === 'toStr') {
        let retStr = '';
        let c = 0;
        for (let i = 0; i < t.length; i++) {
          if (t[i] === 1) {
            if (c > 0) {
              retStr += ',';
            }
            c++;
            retStr += nameArr[i];
          }
        }
        return retStr;
      }
      if (dir === 'toArr') {
        let retArr = [0, 0, 0];
        let typeArr = t.split(',');
        for (let i = 0; i < nameArr.length; i++) {
          if (typeArr.indexOf(nameArr[i]) > -1) {
            retArr[i] = 1;
          }
        }
        return retArr;
      }
    };

    return (
      <div id="filter-page-results" className="filter-page-results pt-5">
        {(tags.length > 0 || allPids.length > 0 || creators.length > 0) && (
          <ResultsFilter
            changeType={changeType}
            type={convertType(this.state.type, 'toArr')}
            init={this.initBtns}
            disabled={allPids.length > 0 || creators.length > 0}
          />
        )}

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
          <div ref={ref => (this.resultBlockRef = ref)}>
            <div className="d-flex flex-row justify-content-between px-2 px-sm-3 px-lg-5 pt-5">
              <Title
                Tag="h1"
                type="title4"
                variant="transform-uppercase"
                className="mr-4 recommended-words"
              >
                <strong className="tag-title">Forslag til</strong>
                {tags.map((tag, idx) => {
                  let len = tags.length;

                  if ((idx === 0 && len === 1) || idx === len - 2) {
                    return (
                      <span key={idx} className="tag-title">
                        &nbsp;{this.formatTitle(tag)}
                      </span>
                    );
                  } else if (idx < len - 2) {
                    return (
                      <span key={idx} className="tag-title">
                        &nbsp;{this.formatTitle(tag)},
                      </span>
                    );
                  }
                  return (
                    <span key={idx} className="tag-title">
                      &nbsp;og&nbsp; {this.formatTitle(tag)}
                    </span>
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
                        plus={this.props.plus}
                        minus={this.props.minus}
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
              types={this.state.type}
            />
          </div>
        )}
      </div>
    );
  }
}

export default withTagsFromUrl(Results);
